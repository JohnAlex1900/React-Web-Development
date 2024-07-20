"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const express_1 = __importDefault(require("express"));
const patients_1 = __importDefault(require("../../data/patients"));
const types_1 = require("../types/types");
const uuid_1 = require("uuid");
const patientsService = __importStar(require("../services/patients"));
const patientsRouter = express_1.default.Router();
patientsRouter.get("/", (_req, res) => {
    const nonSensitivePatients = patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
    res.json(nonSensitivePatients);
});
patientsRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const patient = patients_1.default.find((p) => p.id === id);
    if (patient) {
        res.json(patient);
    }
    else {
        res.status(404).send({ error: "Patient not found" });
    }
});
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isGender = (param) => {
    return Object.values(types_1.Gender)
        .map((g) => g.toString())
        .includes(param);
};
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new Error("Incorrect or missing name");
    }
    return name;
};
const parseDateOfBirth = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date of birth: " + date);
    }
    return date;
};
const parseSsn = (ssn) => {
    if (!ssn || !isString(ssn)) {
        throw new Error("Incorrect or missing SSN");
    }
    return ssn;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error("Incorrect or missing gender: " + gender);
    }
    return gender;
};
const parseOccupation = (occupation) => {
    if (!occupation || !isString(occupation)) {
        throw new Error("Incorrect or missing occupation");
    }
    return occupation;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        return [];
    }
    return object.diagnosisCodes;
};
const parseEntryType = (param) => {
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
const parseHealthCheckRating = (param) => {
    if (typeof param !== "number" ||
        !Number.isInteger(param) ||
        param < 0 ||
        param > 3) {
        throw new Error("Incorrect or missing health check rating");
    }
    return param;
};
const parseString = (text) => {
    if (!text || !isString(text)) {
        throw new Error("Incorrect or missing text");
    }
    return text;
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date");
    }
    return date;
};
const toNewEntry = (object) => {
    const baseEntry = {
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
    };
    switch (parseEntryType(object.type)) {
        case "Hospital":
            const hospitalEntry = object;
            return Object.assign(Object.assign({}, baseEntry), { type: "Hospital", discharge: {
                    date: parseDate(hospitalEntry.discharge.date),
                    criteria: parseString(hospitalEntry.discharge.criteria),
                } });
        case "OccupationalHealthcare":
            const occupationalHealthcareEntry = object;
            return Object.assign(Object.assign({}, baseEntry), { type: "OccupationalHealthcare", employerName: parseString(occupationalHealthcareEntry.employerName), sickLeave: occupationalHealthcareEntry.sickLeave
                    ? {
                        startDate: parseDate(occupationalHealthcareEntry.sickLeave.startDate),
                        endDate: parseDate(occupationalHealthcareEntry.sickLeave.endDate),
                    }
                    : undefined });
        case "HealthCheck":
            const healthCheckEntry = object;
            return Object.assign(Object.assign({}, baseEntry), { type: "HealthCheck", healthCheckRating: parseHealthCheckRating(healthCheckEntry.healthCheckRating) });
        default:
            throw new Error("Incorrect entry type");
    }
};
const toNewPatient = (object) => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }
    if ("name" in object &&
        "dateOfBirth" in object &&
        "ssn" in object &&
        "gender" in object &&
        "occupation" in object) {
        const newPatient = {
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
        const patientWithId = Object.assign({ id: (0, uuid_1.v1)() }, newPatient);
        patients_1.default.push(patientWithId);
        res.json(patientWithId);
    }
    catch (e) {
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
            const newEntry = toNewEntry(req.body);
            return patientsService.addEntry(req.params.id, newEntry);
        }
        catch (e) {
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
        }
        else if (!res.headersSent) {
            // Ensure we don't send another response if headers have already been sent
            res.status(400).send({ error: "Failed to add entry" });
        }
    })
        .catch((e) => {
        let errorMessage = "Something went wrong.";
        if (e instanceof Error) {
            errorMessage += " Error: " + e.message;
        }
        res.status(400).send(errorMessage);
    });
});
exports.default = patientsRouter;
