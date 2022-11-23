<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
  
    <v-spacer>
      <div class="company_logo">
        
      </div>
      
    </v-spacer>
    <Timer @stop:time="CheckExpirationTime()"/>
    <!-- {{ timer }}  &nbsp; -->
    <div v-show="isUserDetail" class="userinfo-detail pop">
      <div class="username pop">
        <span style="font-weight: 800;font-size: 18px;color:black" class="pop">{{name}}</span>
      </div>
      <div class="logout-btn pop" @click="onClickLogout">LOGOUT</div>
      <div style="color:black;font-size:13px;margin-top:30px;border-bottom:1px solid #c9c9c9;" class="pop"></div>
      <div>
        <ul class="userInfo-text-box">
          <li>Email | <span>{{email}}</span> </li>
          <li>Uploaded File | <span>{{historyFile.sum_uploaded_file}}</span> </li>
          <li>Changed File | <span>{{historyFile.sum_predict_file}}</span></li>
          <li>Total Changed Time | <span>{{historyFile.sum_predict_duration}}</span></li>
        </ul>
      </div>
    </div>
    
    <div class="userinfo-detail-btn pop" @click="onClickUserName" >
      <span class="userinfo-text pop" >{{name}}</span>
    </div>
    <a class="detail-btn" :style="arrowStyle"></a>
    <!--  /* IE 9 */
   /* Chrome, Safari, Opera */
   -->
    
      <!-- <v-btn
        target="_blank"
        text
        @click="onClickLogout"
      >
      LOGOUT &nbsp;
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
  </v-app-bar>
</template>

<script>
// import moment from 'moment';
import Timer from '@/components/Timer'
import $ from 'jquery'
import { getStatistics  } from '@/api/modules/file'

export default {
  name: "Header",
  components: {
    Timer
  },
  data: () => ({
    historyFile:{},
    name:'홍길동',
    email:'sch9027@espresomedia.com',
    isUserDetail:false,
    arrowStyle:{
      transform:'rotate('+0+'deg)'
    }
  }),
  methods: {
    async fetchGetStatistics(){
      await getStatistics().then((data)=>{
        this.historyFile = data.data
      });
    },
    onClickUserName(){
      this.isUserDetail = !this.isUserDetail
      if(this.isUserDetail) {
        this.arrowStyle.transform = 'rotate('+-180+'deg)';
      }else {
        this.arrowStyle.transform = 'rotate('+0+'deg)';
      }
      let that = this;
      $('html').click(function(e) {
        let $tgPoint = $(e.target);
        if( !$tgPoint.hasClass('pop') ) {
          that.isUserDetail= false;
          that.arrowStyle.transform = 'rotate('+0+'deg)';
        } 
      });
    },
    CheckExpirationTime(){
      // const message = `The login time has expired. Do you want to extend it?`
      // if (confirm(message) === true) {
      //   this.$emit('refresh:token')
      // } else {
      //   sessionStorage.setItem('accessToken', null);
      //   sessionStorage.setItem('refreshToken', null);
      //   sessionStorage.setItem('expiredTime', null);
      //   sessionStorage.setItem('userId', null);
      //   this.$router.push('/login');
      // }
    },
    onClickLogout(){
      const message = `Do you want to log out?`
      if (confirm(message) === true) {
        sessionStorage.setItem('accessToken', null);
        sessionStorage.setItem('refreshToken', null);
        sessionStorage.setItem('expiredTime', null);
        sessionStorage.setItem('userId', null);
        this.$router.push('/login');
      }
    }
  },
  created() {
    this.fetchGetStatistics();
  }

}
</script>

<style scoped>
.userInfo-text-box{
  list-style:none;
  color:black;
  padding:12px 0
}
.userInfo-text-box li{
  font-weight: 500;
  color: #2e2e2e;
  font-size: 13px;
}
.userInfo-text-box li span{
  color:#545454;
  font-weight: 400;
  font-size: 14px;
  margin-left: 5px;
}
.detail-btn{
  /* border: 1px solid red; */
  border-top:5px solid white;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content:"";
  position:relative;
  margin-right: 10px;
  bottom: 1px;
  transition: .3s; 
}
.logout-btn{
  border: 1px solid #c9c9c9;
  float: left;
  padding: 3px;
  font-size: 13px;
  border-radius: 2px;
  height: 25px;
  color: #a1a1a1;
  cursor: pointer;
}
.username{
  float: left;
  height: 25px;
  margin-right: 10px;
}
.userinfo-text {
  cursor: pointer;
  margin-right: 10px;
}
.userinfo-detail {
  /* border: 1px solid red; */
  position:relative;
  width:300px;
  height:150px;
  background:white;
  border-radius: 2px;
  top: 105px;
  left: 75px;
  box-shadow: 0px 0px 3px #646464;
  padding: 10px;
}
.userinfo-detail:after {
  border-top:0px solid transparent;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
  content:"";
  position:absolute;
  top:-5px;
  left:245px;
}
header {
  min-width: 800px;
}
</style>
