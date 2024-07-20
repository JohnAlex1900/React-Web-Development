import express from "express";
import bodyParser from "body-parser";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(bodyParser.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  const bmi = calculateBmi(weightNum, heightNum);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: "parameters missing" });
  } else if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.status(400).json({ error: "malformatted parameters" });
  } else {
    const result = calculateExercises(daily_exercises, Number(target));
    res.json(result);
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
