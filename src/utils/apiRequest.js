import axios from 'axios';

const apiRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const get = async (path, options = {}) => {
    const response = await apiRequest.get(path, options);
    return response;
};

export default apiRequest;
