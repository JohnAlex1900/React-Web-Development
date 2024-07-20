import express from "express";
import diagnoses from "../../data/diagnoses.json";
import { Diagnosis } from "../types/types";

const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req, res) => {
  res.json(diagnoses as Diagnosis[]);
});

export default diagnosesRouter;
