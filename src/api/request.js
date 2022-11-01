import axios from "axios";
let requests = axios.create({
  // baseURL: "/api",
  timeout: 5000
});

// 请求拦截器
requests.interceptors.request.use((config)=>{
  console.log(config)
})

requests.interceptors.response.use((res)=>{
  return res.data;
},(error)=>{
  return Promise.reject((new Error('failed')));
})
export default requests;
