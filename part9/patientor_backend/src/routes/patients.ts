/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from "express";
import patients from "../../data/patients";
import {
  NonSensitivePatient,
  PatientFormValues,
  Gender,
  NewEntry,
  EntryType,
  HealthCheckRating,
} from "../types/types";
import { v1 as uuid } from "uuid";
import * as patientsService from "../services/patients";

const patientsRouter = express.Router();

patientsRouter.get("/", (_req, res) => {
  const nonSensitivePatients: NonSensitivePatient[] = patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );

  res.json(nonSensitivePatients);
});

patientsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const patient = patients.find((p) => p.id === id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date of birth: " + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing SSN");
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }
  return occupation;
};

const parseDiagnosisCodes = (object: unknown): Array<string> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<string>;
  }
  return (object as { diagnosisCodes: Array<string> }).diagnosisCodes;
};

const parseEntryType = (param: unknown): EntryType => {
  if (!param || !isString(param)) {
    throw new Error("Incorrect or missing entry type");
  }
  switch (param) {
    case "Hospital":
    case "OccupationalHealthcare":
    case "HealthCheck":
      return param;
    default:
      throw new Error("Incorrect entry type");
  }
};

const parseHealthCheckRating = (param: unknown): HealthCheckRating => {
  if (
    typeof param !== "number" ||
    !Number.isInteger(param) ||
    param < 0 ||
    param > 3
  ) {
    throw new Error("Incorrect or missing health check rating");
  }
  return param;
};

type Fields = { [key: string]: unknown };

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing text");
  }
  return text;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date");
  }
  return date;
};

const toNewEntry = (object: Fields): NewEntry => {
  const baseEntry = {
    description: parseString(object.description),
    date: parseDate(object.date),
    specialist: parseString(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
  };

  switch (parseEntryType(object.type)) {
    case "Hospital":
      const hospitalEntry = object as {
        type: "Hospital";
        discharge: {
          date: unknown;
          criteria: unknown;
        };
      };
      return {
        ...baseEntry,
        type: "Hospital",
        discharge: {
          date: parseDate(hospitalEntry.discharge.date),
          criteria: parseString(hospitalEntry.discharge.criteria),
        },
      };
    case "OccupationalHealthcare":
      const occupationalHealthcareEntry = object as {
        type: "OccupationalHealthcare";
        employerName: unknown;
        sickLeave?: {
          startDate: unknown;
          endDate: unknown;
        };
      };
      return {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName: parseString(occupationalHealthcareEntry.employerName),
        sickLeave: occupationalHealthcareEntry.sickLeave
          ? {
              startDate: parseDate(
                occupationalHealthcareEntry.sickLeave.startDate
              ),
              endDate: parseDate(occupationalHealthcareEntry.sickLeave.endDate),
            }
          : undefined,
      };
    case "HealthCheck":
      const healthCheckEntry = object as {
        type: "HealthCheck";
        healthCheckRating: unknown;
      };
      return {
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(
          healthCheckEntry.healthCheckRating
        ),
      };
    default:
      throw new Error("Incorrect entry type");
  }
};

const toNewPatient = (object: unknown): PatientFormValues => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: PatientFormValues = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

patientsRouter.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const patientWithId = {
      id: uuid(),
      ...newPatient,
    };

    patients.push(patientWithId);
    res.json(patientWithId);
  } catch (e: unknown) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

patientsRouter.post("/:id/entries", (req, res) => {
  patientsService
    .getPatientById(req.params.id)
    .then((patient) => {
      if (!patient) {
        res.status(404).send({ error: "Patient not found" });
        // Return undefined to continue the promise chain with a resolved promise
        return undefined;
      }

      try {
        const newEntry: NewEntry = toNewEntry(req.body);
        return patientsService.addEntry(req.params.id, newEntry);
      } catch (e: unknown) {
        let errorMessage = "Something went wrong.";
        if (e instanceof Error) {
          errorMessage += " Error: " + e.message;
        }
        res.status(400).send(errorMessage);
        // Return undefined to continue the promise chain with a resolved promise
        return undefined;
      }
    })
    .then((updatedPatient) => {
      if (updatedPatient) {
        res.json(updatedPatient);
      } else if (!res.headersSent) {
        // Ensure we don't send another response if headers have already been sent
        res.status(400).send({ error: "Failed to add entry" });
      }
    })
    .catch((e: unknown) => {
      let errorMessage = "Something went wrong.";
      if (e instanceof Error) {
        errorMessage += " Error: " + e.message;
      }
      res.status(400).send(errorMessage);
    });
});

export default patientsRouter;
