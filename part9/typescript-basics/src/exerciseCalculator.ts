export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(
  dailyHours: number[],
  target: number
): ExerciseResult {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day > 0).length;
  const totalHours = dailyHours.reduce((sum, hour) => sum + hour, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "Great job! You met your target.";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "Not too bad but could be better.";
  } else {
    rating = 1;
    ratingDescription = "You need to work harder to meet your target.";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}
