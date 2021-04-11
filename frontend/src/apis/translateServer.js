import axios from 'axios';
import { BACKEND_ADDRESS } from '../constants/server_constants';

export default axios.create({
  baseURL: BACKEND_ADDRESS,
  withCredentials: true,
});
