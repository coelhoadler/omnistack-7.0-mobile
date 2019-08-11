import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.54.32:3333' // ip da minha máquina
})

export default api;