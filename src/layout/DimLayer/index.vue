<template>
    <!-- 레이어 팝업 배경 style="display:block"-->
    <div class="dim-layer" :style="isOpen?'display:block':'display:none'" @click="onClickBackground(false)">
      <div class="dimBg"></div>
    </div>
</template>

<script>
export default {
  name: 'DimLayer',
  props:{
    isOpen:{
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
   
    }
  },
  created() {

  },
  methods: {
    onClickBackground(e){
      this.$emit('cilck:bgDim',e)
    },
  }
}
</script>