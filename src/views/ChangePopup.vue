<template>
  <div>
    <div v-if="!isOpenMiniPopup" class="pop-layer" :style="isPopOpen? 'display: block':'display: none'">
      <div class="popup-box">
        <div class="popup-header">
          <div class="upload-icon"></div>
          <div class="text-box">File Change</div>
          <div class="btn-box">
            <div class="mini-btn" @click="onClickMiniBtn"><hr></div>
            <div class="close-btn" @click="onClickCloseBtn"></div>
          </div>
        </div>
        <div class="popup-body">
          <div class="table_box">
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="save"
              :height="200"
              fixed-header
              disable-pagination
              hide-default-footer
              :dense="true"
              :items-per-page="5"
              item-key="name"
              class="elevation-1"
            >
            
            <!-- :show-text="false" -->
            <template v-slot:item.percent="{ item }" >
              <k-progress
                active 
                bg-color="#f0f0f0"
                status="success" 
                type="line"
                :flow-second="2"
                :percent="item.percent" >
              </k-progress>
            </template>
            <template v-slot:item.selected="{ item }" >
              <v-select
                v-model="item.selected"
                class="option"
                :items="items"
                label="Option"
                dense
                solo
              ></v-select>
            </template>
            <template v-slot:item.delete="{ item }" >
              <div class="delete-btn-box">
                <div class="delete-btn" @click="onClickDelete(item)"></div>
              </div>
            </template>
            </v-data-table>
          </div>
        </div>
        <div class="footer-box">
          <v-btn v-if="!isChange" color="primary" class="popup" @click="changeStartOrStop(true)">
              Start
          </v-btn>
          <v-btn v-else color="primary" class="popup" @click="changeStartOrStop(false)">
              Stop
          </v-btn>
        </div>
      </div>
    </div>
    <div v-else class="mini-popup" >
      <div class="popup-left" @click="changePopup">
        <div class="popup-icon"></div>
        <div class="popup-text"> File Change ( {{nowProgress }} / {{this.save.length}} ) > </div>
      </div>
      <div class="close-btn" @click="onClickCloseBtn"></div>
    </div>
  </div>
</template>

<script>
import KProgress from 'k-progress';
import { startProgress, proceeding, killProgress  } from '@/api/modules/progress'
// import axios from 'axios'


let playPersent; 
export default {
  name: 'ChangePopup',
  props: {
    isPopOpen: {
      type: Boolean,
      default: false
    },
    changeFileList: {
        type: Array,
        default: () => []
    },
    isChangeFileList:{
      type: Boolean,
      default: false
    }
  },
  components:{
    KProgress
  },
  watch:{
    changeFileList:{
        handler(val){
          if(val.length == 0) {
            this.isOpenMiniPopup = false;
          }
          this.save = val
        },
        deep:true
    },
    isChangeFileList(val){
      this.isOpenMiniPopup = val
    },
  },
  data(){
    return {
      nowProgress:0,
      items: ['Soccer', 'Tennis'],
      save:[],
      isOpenMiniPopup:false,
      isChange:false,
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: 'Filename',
          align: 'start',
          value: 'file_name',
          width: '10%'
        },
        { text: 'Send State', value: 'percent',width: '40%', align: 'center',sortable: false,},
        { text: 'Type', value: 'selected',width: '30%', align: 'center',sortable: false, },
        { text: 'Delete',value: 'delete', width: '20%', align: 'center',sortable: false, },
      ],
    }  
  },
  methods:{
    onClickDelete(item){
      if(!this.isChange){
        let fileList = []
        fileList.push(item.file_name)
        let request = {
          email: sessionStorage.getItem("userId"),
          file_name: fileList
        }
        killProgress(request).then((data)=>{
          if(data.status == 200) {
            this.$emit("delete:single",item.file_name)
          }
        })
      } else {
        alert("It cannot be deleted during conversion.")
      }
      
    },
    changePopup(){
      this.isOpenMiniPopup = !this.isOpenMiniPopup
      this.$emit('cilck:bgDim', true)
    },
    async fetchStartProgress(val){
      this.isChange = val
      let saveFilter= this.save.filter(data => data.percent == 100);
      this.nowProgress = saveFilter.length
      if(this.isChange) {
        if(this.nowProgress !== this.save.length){
          let request = {
            file_name:this.save[this.nowProgress].file_name
          }
        
          await startProgress(request).then((data)=>{
            if(data.status == 200){
                playPersent = setInterval(()=>{
                  proceeding({task_id:data.data.task_id}).then((progress)=>{
                    if(progress.status == 200){
                      let result = progress.data
                      if(progress.data.total !== 0){
                        this.save[this.nowProgress].percent = Math.floor((result.done/result.total)*100);
                        if(progress.data.done === progress.data.total && progress.data.state == "SUCCESS"){
                          clearInterval(playPersent);
                          this.fetchStartProgress(true);
                        }
                      }
                    }
                  })
                },1000);
            }
          }).catch((e)=>{
            console.log(e.response);
          });
        } else {
          this.$emit("complete:change")
        }
      } else {
        this.fetchKillTask();
        clearInterval(playPersent);
      }
        
      
    },
    changeStartOrStop(val){
      this.fetchStartProgress(val);
    },
    onClickMiniBtn(){
      this.isOpenMiniPopup = !this.isOpenMiniPopup
      this.$emit('disable:button', this.isOpenMiniPopup)
      this.$emit('cilck:bgDim', false)
    },
    onClickCloseBtn(){
      let result = this.save.filter((data) => { return data.percent == 100});
      if(result.length === this.save.length) {
        this.isOpenMiniPopup =  false;
        this.isChange = false;
        this.save = [];
        this.$emit('cilck:close')
        this.$emit('cilck:bgDim', false)
      } else {
        const message = `Would you really stop all the conversions?`
        if (confirm(message) === true) {
          this.fetchKillTask();
          clearInterval(playPersent);
          this.isOpenMiniPopup =  false;
          this.isChange = false;
          this.save = [];
          this.$emit('cilck:close')
          this.$emit('cilck:bgDim', false)
        }
      }
    },
    fetchKillTask(){
      let fileList = []
      this.save.filter(data =>{
        if(data.percent !== 100){                                                                                                                                                                                   
          fileList.push(data.file_name)
        }
      });
      let request = {
        email: sessionStorage.getItem("userId"),
        file_name: fileList
      }
      killProgress(request).then((data)=>{
        console.log("kill__data___",data)
      })
    }
  },
  created(){
    this.save = this.changeFileList
  },
}
</script>
<style>
.option .v-input__slot{
width: 110px;
}
.delete-btn-box {
  cursor: pointer;
}
.delete-btn-box .delete-btn{
  margin: 0 auto;
  height: 20px;
  width: 20px;
  font-size: 10px;
  width:20px; 
  height:20px;
  background:url('../assets/images/trash-4.png') center center no-repeat;
  background-size : 15px 18px ;
}
</style>