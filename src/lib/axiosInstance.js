//here what i do like separate the axios function bcz 
//if we call 7 or 8 endpoints then in every endpoint we need to call the axios.get or axios.post with 
// headers: {
//     'Content-Type': 'application/json',
// }, this tag ..
//SO I CREATE A COMMON INSTANCE OF AXIOS THAT CAN HELP US TO REUSE THE CODE..

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1', // Automatically prepended to all URLs
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
