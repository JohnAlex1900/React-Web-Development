import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;
let redirecting = false; // State variable to track redirection

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.get(baseUrl, config);
    return response.data; // Return the data directly
  } catch (error) {
    handleAxiosError(error);
  }
};

const getBlog = async id => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.get(`${baseUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const create = async newObject => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const update = async (id, newObject) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const remove = async id => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    await axios.delete(`${baseUrl}/${id}`, config);
  } catch (error) {
    handleAxiosError(error);
  }
};

const addComment = async (id, comment) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(
      `${baseUrl}/${id}/comments`,
      { comment },
      config
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const handleAxiosError = error => {
  console.error('Axios Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    const status = error.response.status;
    if (status === 401 && !redirecting) {
      redirecting = true; // Set flag to true to prevent further redirection
      console.log('JWT expired. Redirecting to login page.');

      window.localStorage.removeItem('loggedBlogappUser');
      // Redirect to login page
      window.location.replace('/'); // Adjust the path as per your application setup
      return; // Ensure to return to prevent further execution
    } else {
      throw new Error(`Request failed with status ${status}`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response received');
  } else {
    // Something happened in setting up the request that triggered an error
    console.error('Error setting up request:', error.message);
    throw new Error('Error setting up request');
  }
};

export default {
  getAll,
  getBlog,
  create,
  update,
  remove,
  addComment,
  setToken,
};
