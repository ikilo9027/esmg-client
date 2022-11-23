import Vue from 'vue'
import Router from 'vue-router'
import LayoutNormal from '@/layout/Layout_normal'
import LayoutLogin from '@/layout/Layout_login'

Vue.use(Router)

function guard(to, from, next){
  /*
  로그인이 필수인 페이지에 GUARD를 포함시킨다.
  --> beforeEnter: guard, 
  */
  let getToken = sessionStorage.getItem('accessToken');
  if(getToken != 'null' &&  getToken != '' && getToken != null ) { 
    next();  
  } else{ 
    next({ name: 'Login', query: { redirect:  to.path } }); 
  }
}

export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: LayoutLogin,
        redirect: '/login',
        children: [
          {
            name: 'Login',
            path: 'login',
            component: () => import('@/views/Login.vue')
          },
        ]
      },
      {
        path: '/main',
        beforeEnter: guard,
        component: LayoutNormal,
        children: [
          {
            name: 'Main',
            path: '',
            component: () => import('@/views/Main.vue')
          },
        ]
      },
    ]
  })