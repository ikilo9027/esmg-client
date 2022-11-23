<template>
  <v-app id="inspire">
    <Loading :isOpen="isLoading"/>
    <DimLayer :isOpen="isOpen || isLoading" />
    <!-- @cilck:bgDim="onClickBgDim" -->
    <Header @refresh:token="refreshToken()"/>
    
    <v-main>
      <router-view @cilck:bgDim="onClickBgDim" :isPopOpen="isOpen" @loading="loadingView" @cilck:close="onClickClose"/>
    </v-main>
  </v-app>
</template>
<script>
// import { refreshToken } from "@/api/modules/auth";
import DimLayer from '@/layout/DimLayer'
import Loading from '@/components/Loading'
import Header from './Header'

export default {
  name: "LayoutNormal",
  components: {
    Header,
    DimLayer,
    Loading
  },
  data() {
    return {
      isOpen:false,
      isLoading:false
    }
  },
  methods:{
    onClickClose(){
      this.isOpen = false
    },
    loadingView(e){
      this.isLoading = e
    },
    onClickBgDim(e){
      this.isOpen = e
    },
  },
  
}
</script>
<style>
html{ -ms-overflow-style: none; } 
html::-webkit-scrollbar { display: none; }
</style>
