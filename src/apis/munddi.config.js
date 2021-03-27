import axios from 'axios'

const munddiApi = axios.create({
  baseURL: 'https://munddi.com/dev',
  timeout: 1000,
});

export default munddiApi