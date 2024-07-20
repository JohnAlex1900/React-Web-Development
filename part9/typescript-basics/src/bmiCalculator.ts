export function calculateBmi(weight: number, height: number): string {
  const heightInMeters = height / 100;
  const bmi = weight / heightInMeters ** 2;

  if (bmi < 18.5) {
    return `Underweight (BMI: ${bmi.toFixed(2)})`;
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return `Normal weight (BMI: ${bmi.toFixed(2)})`;
  } else if (bmi >= 25 && bmi < 29.9) {
    return `Overweight (BMI: ${bmi.toFixed(2)})`;
  } else {
    return `Obesity (BMI: ${bmi.toFixed(2)})`;
  }
}
