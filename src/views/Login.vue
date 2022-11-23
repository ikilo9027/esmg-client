<template>
  <div class="login">
    <div class="login_logo"></div>

    <div class="login_email">
      <v-text-field
        v-model="membInfo.email"
        :rules="emailRules"
        label="Email"
        outlined
        dense
      ></v-text-field>
    </div>
    <div class="login_password">
      <v-text-field
        v-model="membInfo.password"
        :rules="passwordRules"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        label="Password"
        outlined
        dense
        @click:append="show = !show"
      ></v-text-field>
    </div>
    <div class="login_btn">
      <v-btn 
        block
        color="primary"
        @click="onClickLogin"
      >
        Login
      </v-btn>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/modules/auth";

export default {
  name: 'Login',
  props: {
  },
  components:{
  },
  data(){
    return {
      show:false,
      membInfo:{
        email: "esmg@test.com",
        password: "espreso1!",
      },
      emailRules: [
        v => !!v || 'Please enter your email.',
        v => new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(v)
            ||'It\'s not in the form of an email.'
      ],
      passwordRules: [
        v => !!v || 'Please enter your password.',
      ],
    }  
  },
  methods:{
    onClickLogin(){
      this.fetchLogin();
    },
    async fetchLogin() {
      let request = {
        email: this.membInfo.email,
        password: this.membInfo.password
      }
        await login(request).then(result=> {
          if(result.status==200){
            sessionStorage.setItem('accessToken', result.data.access_token);
            sessionStorage.setItem('refreshToken', result.data.refresh_token);
            sessionStorage.setItem('expiredTime', result.data.expired_time);
            sessionStorage.setItem('userId', this.membInfo.email);
            window.location.href = `/main`
          }
        }).catch((e)=> {
          console.log('error___',e.response)
          if(e.response.status == 500){
            alert("There is a problem with the server. Please contact the manager.")
          } else {
            alert("Please check your email and password again.")
          }
        });
    },
  },
}
</script>