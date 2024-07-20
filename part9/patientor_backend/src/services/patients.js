"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEntry = exports.getPatientById = void 0;
// backend/src/services/patients.ts
const uuid_1 = require("uuid");
const patients_1 = __importDefault(require("../../data/patients"));
// Since we don't have real async operations right now, we'll simulate promises.
const getPatientById = (id) => {
    // Simulating async behavior
    return new Promise((resolve) => {
        const patient = patients_1.default.find((p) => p.id === id);
        resolve(patient);
    });
};
exports.getPatientById = getPatientById;
const addEntry = (id, entry) => {
    return new Promise((resolve) => {
        const patient = patients_1.default.find((p) => p.id === id);
        if (!patient) {
            resolve(undefined);
        }
        else {
            const newEntry = Object.assign({ id: (0, uuid_1.v4)() }, entry);
            patient.entries.push(newEntry);
            resolve(patient);
        }
    });
};
exports.addEntry = addEntry;
