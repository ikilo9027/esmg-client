<template>
  <div class="lodding" :style="isOpen?'display:block':'display:none'">
    <v-progress-circular
      indeterminate
      color="white"
      :size="70"
      :width="7"
    ></v-progress-circular>
  </div>
</template>
<script>
export default { 
  props:{
    isOpen:{
      type:Boolean,
      default:false,
    },
  },
  data() { 
    return{ 
    } 
  },
  created(){ 
  },
  methods: { 
  },
}

</script>
<style>
.lodding{  
    display: none;  
    position: absolute;
    top: 40%;  
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;   
    z-index: 101;
}
</style>