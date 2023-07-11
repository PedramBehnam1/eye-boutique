import axios from 'axios';

const instance = axios.create({

    baseURL: 'http://3.236.241.144:8000/'
    

});

export default instance;
