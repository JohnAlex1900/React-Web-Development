import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export const getDiagnoses = async (): Promise<Diagnosis[]> => {
  const response = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return response.data;
};

export default {
  getAll,
};
