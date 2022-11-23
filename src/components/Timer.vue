<template>
  <div class="timer">{{ prettyTime() }}</div>
</template>
<script>
export default { 
  data() { 
    return{ 
      timeCounter : null, //3분 
      resTimeData : '' 
    } 
  },
  created(){ //3분 유효 타이머 시작 
    this.start()
    this.timeCounter = this.timer();
  },
  methods: { 
    timer(){
      let expiredTime = sessionStorage.getItem('expiredTime')
      let date = new Date(expiredTime);
      let now = new Date();
      return Math.floor((date.getTime()-now.getTime())/1000)
      // return 10
    },
    start(){ // 1초에 한번씩 start 호출 
      this.polling = setInterval( () =>{ 
        this.timeCounter-- //1찍 감소 
        this.resTimeData = this.prettyTime() 
        
        if (this.timeCounter <= 1){
          this.timeCounter = this.timer();
          // this.$emit('stop:time')
          // alert("stop!!!")
        } 
        

      },1000) 
    }, // 시간 형식으로 변환 리턴 
    prettyTime() { 
      let hour = Math.floor(this.timeCounter / 3600);
      let min = Math.floor((this.timeCounter - (hour*3600)) / 60);
      let sec = this.timeCounter - (hour*3600) - (min*60);
      return this.pad(hour, 2) + ":" + this.pad(min, 2) + ":" + this.pad(sec, 2) 
    }, // 2자리수로 만들어줌 09,08... 
    pad(n, width) { 
      n = n + ''; 
      return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n 
    }, 
    timeStop() { 
      clearInterval(this.polling) 
    }, // 재발행 
    smsReset() { 
      clearInterval(this.polling) 
      this.tcounter = 180 
      this.startTime() 
    }, 
  }, 
  beforeDestroy() { 
    clearInterval(this.polling) 
  } 
}

</script>
<style>
.timer{
  margin:0 10px;
}
</style>