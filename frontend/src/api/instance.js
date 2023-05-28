import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:7037/api'
});

export default instance;