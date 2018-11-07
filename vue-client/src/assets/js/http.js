import axios from 'axios'
// import store from '@/store'
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(function(config) { //配置发送请求的信息
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) { //配置请求回来的信息
    console.log('返回信息：',response.data)
    return response.data;
}, function(error) {

    return Promise.reject(error);
});


export default axios