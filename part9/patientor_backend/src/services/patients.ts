// backend/src/services/patients.ts
import { v4 as uuidv4 } from "uuid";
import patients from "../../data/patients";
import { Patient, Entry, NewEntry } from "../types/types";

// Since we don't have real async operations right now, we'll simulate promises.
export const getPatientById = (id: string): Promise<Patient | undefined> => {
  // Simulating async behavior
  return new Promise((resolve) => {
    const patient = patients.find((p) => p.id === id);
    resolve(patient);
  });
};

export const addEntry = (
  id: string,
  entry: NewEntry
): Promise<Patient | undefined> => {
  return new Promise((resolve) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) {
      resolve(undefined);
    } else {
      const newEntry: Entry = {
        id: uuidv4(),
        ...entry,
      };
      patient.entries.push(newEntry);
      resolve(patient);
    }
  });
};
