import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data.error; // Forward the error message
    });
};

const update = (name, newObject) => {
  const request = axios.put(`${baseUrl}/${name}`, newObject);
  return request
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data.error; // Forward the error message
    });
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
  remove,
};
