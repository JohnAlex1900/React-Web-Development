"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnoses_json_1 = __importDefault(require("../../data/diagnoses.json"));
const diagnosesRouter = express_1.default.Router();
diagnosesRouter.get("/", (_req, res) => {
    res.json(diagnoses_json_1.default);
});
exports.default = diagnosesRouter;
