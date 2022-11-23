import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import scUtil from './util/sc-util.js';
import { refreshToken } from '@/api/modules/auth';
import moment from 'moment'
// import jwt_decode from 'jwt-decode';
import axios from 'axios';

Vue.config.productionTip = false
Vue.use(scUtil);
// Vue.use(fileUtil);

function refresh(){
  
  if(window.refreshTokenInterval){
    clearInterval(window.refreshTokenInterval);
    window.refreshTokenInterval = null;
  }
  if(accessToken == 'null'){
    clearInterval(window.refreshTokenInterval);
  }
  window.refreshTokenInterval = setInterval(()=>{
    const now = moment()
    let accessToken = sessionStorage.getItem('accessToken');
    let date = new Date(sessionStorage.getItem('expiredTime'))
    // 만료 60초 전에 리프레쉬
    date.getSeconds() - 60
    if(accessToken == 'null'||accessToken===null){
      clearInterval(window.refreshTokenInterval);
    } else {
      // console.log("now.toDate()", date)
      // console.log("now.toDate()", now.toDate())
      if(now.toDate() > date){
        let request = {
          refresh_token: sessionStorage.getItem('refreshToken'),
          email: sessionStorage.getItem('userId')
        }
        refreshToken(request).then((res)=>{
          sessionStorage.setItem('accessToken', res.data.access_token);
          sessionStorage.setItem('expiredTime', res.data.expired_time);
        }).catch((e)=> {
          console.log('error___',e.response)
          if(e.response.status == 401){
            alert("The token has expired. Please login again.")
            sessionStorage.setItem('accessToken', null);
            sessionStorage.setItem('refreshToken', null);
            sessionStorage.setItem('expiredTime', null);
            sessionStorage.setItem('userId', null);
            window.location.href = `/login`
          }else {
            alert("There is a problem with the server. Please contact the manager.")
            window.location.href = `/login`
          }
          
        });
      }
    }
    // 10초 마다 확인
  }, 10000);
}
let accessToken = sessionStorage.getItem('accessToken');
console.log("&&&&&_____",accessToken)
if(accessToken !== 'null'){
  axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  refresh();
} 

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
