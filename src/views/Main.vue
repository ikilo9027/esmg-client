<template>
  <div>
    <!-- <div style="cursor:pointer" @click="onClickPopup">▲</div> -->
    <div class="action_line">
      <a 
        href="javascript:;" 
        class="check_icon"
        :class="{ on: checkList.length !== 0 && isChangeFileList == false}"
        @click="onClickAllCheck"
      ></a>
<!-- uploadType="image" -->
      <FileUpload 
        v-show="checkList.length === 0 && selected === 'Normal'"
        ref="upload1"
        :multiple="true"
        @add:all="loadFileList">
      </FileUpload>
      <div v-if="!(checkList.length === 0)" class="change" style="display: flex;">
        <v-btn 
          v-if="selected === 'Normal'"
          color="primary" 
          class="change" 
          @click="onClickChange()"
        >
          Change
        </v-btn>
        <v-btn 
          v-else
          color="primary" 
          class="change"
          @click="onClickDownload"
        >Download</v-btn>
        <!-- 
        href="abv" type="image/png" -->
        <v-btn color="primary" class="change" @click="onClickDelete" style="margin-left:10px">
            Delete
        </v-btn>
      </div>
      <div style="width:142px"></div>
      <!-- :class="{ on: file.isChecked }"
        @click="onClickCheckIcon(i)" -->
      
      <div class="option_btn_line" style="">
        <a 
          href="javascript:;" 
          class="option_btn" 
          :class="{ on: isOpenDetail }"
          @click="onClickDetail"
        ></a>
        <v-select
          style="float: right;"
          class="option_select"
          v-model="selected"
          :items="items"
          label="Option"
          hide-details
          dense
          solo
        ></v-select>
      </div>
    </div>
    <div class="main">
      <div class="es_scroll" :style="mainStyle">
        <div class="lnb" >
          <ul style="display:line-block">
            <li v-for="(file,i) in fileList" :key="'item'+i">
              <div class="icon_box" @click="onClickFileIcon(file)">
                <a 
                  v-show="overFileIcon(i) || file.isChecked"
                  href="javascript:;" 
                  class="check_icon" 
                  :class="{ on: file.isChecked }"
                  @mouseover="mouseOver(i)" 
                  @mouseleave="mouseOver(i)" 
                  @click="onClickCheckIcon(file,i)"
                ></a>
                <a 
                  href="javascript:;" 
                  class="file_icon" 
                  :class="{ on: file.isChecked }"
                  @mouseover="mouseOver(i)" 
                  @mouseleave="mouseOver(i)" 
                ></a>
              </div>
              <div class="file_text">{{file.file_name}}<br/><span style="color:#999">{{formatFileSize(file.size)}}</span></div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="this.fileDetail.file_name !== undefined" class="content" :style="sidebarStyle">
        <div class="content_filename">
          <div class="filename_text">{{fileDetail.file_name}}</div>
          <a class="close_btn" href="javascript:;" @click="onClickDetail">
          </a>
        </div>
        <div class="content_title">
          <span class="title_line">Details</span>
        </div>
        <div class="image_box">
          <img src="../assets/images/file_icon.png">
        </div>
        <div class="text_box">
          <div class="tb-thead-box">
            <ul>  
              <li>Type</li>
              <li>Size</li>
              <li>Register Date</li>
              <!-- <li>Play Time</li> -->
            </ul>
          </div>
          <div class="tb-tbody-box">
            <ul>
                <li>{{fileDetail.file_type}}</li>
                <li>{{formatFileSize(fileDetail.size)}}</li>
                <li>{{formatDate(fileDetail.register_time)}}</li>
                <!-- <li>{{fileDetail.playtime}}</li> -->
            </ul>
          </div>
        </div>
        <div class="option">
          <div class="select-box">
            
          </div>
          <!-- <div class="check-box">
            <v-checkbox
              v-model="checked"
              label="SR"
              value="SR"
            ></v-checkbox>
          </div> -->
        </div>
      </div>
      <div v-else class="empty_content" :style="sidebarStyle">
        <div class="content_filename">
          <div class="filename_text">{{fileDetail.filename}}</div>
          <a class="close_btn" href="javascript:;" @click="onClickDetail">
          </a>
        </div>
        <div class="image_box" style="margin-top:100px;">
          <div class="empty_image"></div>
        </div>
        <div class="text_box" style="font-size:14px; text-align:center;margin-top:30px">
          If you select the file you want,<br/>
          the details will be displayed here.<br/>
        </div>
      </div>
    </div>
    <ChangePopup 
      :isPopOpen="isPopOpen" 
      :changeFileList="checkList"
      :isChangeFileList="isChangeFileList"
      @cilck:bgDim="onClickPopup" 
      @cilck:close="onClickReset" 
      @disable:button="disableButton" 
      @complete:change="completeChange"
      @delete:single="deleteSingle"
      />
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload'
import ChangePopup from '@/views/ChangePopup'
import { fileUpload, fileList, srfileList, fileDownload, getChangeFileList } from "@/api/modules/file";
import moment from 'moment';
// import jsFileDownload from 'js-file-download';
// import axios from 'axios';
import { setChangeFileList  } from '@/api/modules/file'

let bufferFile;
export default {
  name: 'Main',
  props: {
    isPopOpen: {
      type: Boolean,
      default: false
    }
  },
  components:{
    FileUpload,
    ChangePopup,
  },
  data(){
    return {
      selected:'Normal',
      count:0,
      rowIndex: -1,
      isChangeFileList:false,
      isDisable:false,
      isAllChecked:false,
      isCheckIcon:false,
      isOpen: false,
      isIcon:false,
      isOpenDetail:false,
      isPopDim:false,
      uploadFileList:[],
      checkList:[],
      fileList:[],
      items: ['Normal', 'SR'],
      fileDetail:{},
      mainStyle:{
        width:'100%',
      },
      sidebarStyle:{
        width:'0%',
        display:'none',
      },
    }  
  },
  created(){
    this.fetchFileList();
  },
  watch:{
    selected(val){
      //
      if(val !== 'Normal'){
        this.isChangeFileList = false;
        this.checkList = [];
        this.isDisable = false;
      }
      this.fileDetail = {};
      this.fetchFileList();
    },
  },
  methods:{
    fetchGetChangeFileList(){
      getChangeFileList().then((data)=>{
        if(data.status == 200){
          let result = data.data
          let changeFileList = []
          result.forEach((data)=>{
            this.fileList.forEach((file)=>{
              if(
                (data.predict === true && data.event_key !== 'None') || 
                (data.predict === false && data.event_key === 'None')
              ){
                if(file.file_name == data.file_name) {
                  changeFileList.push(file)
                }
              }
            })
          })
          this.checkList = changeFileList;
          if(this.checkList.length !== 0){
            this.isChangeFileList = true;
          }
        }
      }).catch((e)=>{
        // mini pop off
        this.isChangeFileList = false;
        console.log("e.response____",e.response)
      })
    },
    deleteSingle(file_name){
      this.checkList.forEach((data,i)=>{
        if(data.file_name == file_name){
          this.checkList.splice(i, 1);
        }
      })
    },
    completeChange(){
      alert("The conversion has been completed.")
    },
    async fetchFileDownload(file_name){
      let request = {
        file_name: file_name
      }
      await fileDownload(request).then((data)=>{
        // jsFileDownload(data.data, file_name)
        this.downloadFiles(data.data,file_name)
      })
    },
    downloadFiles(url,file_name){
      let filename = file_name
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
          a.download = filename; // Set the file name.
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          // delete a;
      };
      xhr.open('GET', url);
      xhr.send();
    },
    onClickDownload(){
      this.checkList.forEach((data)=>{
        this.fetchFileDownload(data.file_name)
      })
    },
    formatDate(date) {
      return moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
    },
    formatFileSize(x) {
      let s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let e = Math.floor(Math.log(x) / Math.log(1024));
      return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    },
    onClickReset(){
      this.$emit('cilck:close')
      this.checkList = [];
      this.fileDetail = {};
      this.isDisable = false;
      this.fileList.forEach((data)=>{
        data.percent = 0
        data.isChecked = false
      })
    },
    async onClickDelete(){
      const message = `Do you really want to delete it?`
      if (confirm(message) === true) {
        this.$emit("loading",true)
        const {upload1} = this.$refs
        // let result = upload1.delete(this.checkList)
        let result = await upload1.delete(this.checkList)
        if(result.status == 200){
          this.checkList = [];
          this.fileDetail = {};
          this.fetchFileList();
          setTimeout(()=>{
            this.$emit("loading",false)
          },1500)
        }
      }
    },
    disableButton(e){
      this.isDisable = e
    },
    onClickChange(){
      // file change 창 최소화 일때 change 버튼을 막아줌
      if(!this.isDisable && !this.isChangeFileList){
        this.isPopDim = !this.isPopDim
        this.$emit('cilck:bgDim', this.isPopDim)

        let fileList = [];
        this.checkList.forEach((data)=>{
          fileList.push(data.file_name)
        })
        let request = {
          file_list : fileList
        }
        setChangeFileList(request)
      } else {
        alert('There is already a file under conversion.')
      }
    },
    onClickPopup(e){
      this.$emit('cilck:bgDim', e)
    },
    loadFileList(e){
      this.uploadFileList = e
      //파일 업로드 처음
      let imageFilter = e.filter((data)=>{
        let indexOf = data.file.type.indexOf("/")
        return data.file.type.substring(0, indexOf) !== 'video';
      })
      if(imageFilter.length > 0) {
        alert('Only video files can be uploaded.')
      } else {
        this.sendSequentially();
      }
    },
    sendSequentially(){
      this.$emit("loading",true)
      this.fetchFileURL(this.uploadFileList[this.count].file)
    },
    onClickAllCheck(){
      if(this.fileList.length !== 0){
        this.isAllChecked = true;
        this.fileDetail = this.fileList[this.fileList.length-1]
        this.fileList.forEach((file)=>{
          if(this.isAllChecked) {
            if(this.checkList.indexOf(file) === -1){
              this.checkList.push(file)
            }
            file.isChecked = true;
          } else {
            this.fileDetail = {};
            this.checkList = [];
            file.isChecked = false;
          }
        })
      } else {
        this.isAllChecked = false;
      }
      
      
    },
    onClickFileIcon(fileInfo){
      if(fileInfo.isChecked){
        this.fileDetail = fileInfo
      }else {
        if(this.checkList.length === 0){
          this.fileDetail = {};
        }else {
          this.fileDetail = this.checkList[this.checkList.length-1];
        }
      }
    },
    onClickCheckIcon(file){
      if(!this.isDisable){
        file.isChecked = !file.isChecked
        if(file.isChecked){
          this.checkList.push(file)
        } else {
          this.fileDetail = {};
          this.checkList = this.checkList.filter(data => data.file_name !== file.file_name);
        }
      }else {
        alert("Cannot be added during conversion.")
      }
    },
    overFileIcon(idx) {
      return this.rowIndex === idx;
    },
    mouseOver(i){
      this.isOpen = false;
      if (this.rowIndex == i) {
          this.isOpen = !this.isOpen;
          this.rowIndex = -1;
      } else {
          this.rowIndex = i;
      }
    },
    onClickDetail(){
      this.isOpenDetail = !this.isOpenDetail
      if(this.isOpenDetail) {
        this.mainStyle.width = '70%';
        this.sidebarStyle.width = '30%';
        this.sidebarStyle.display = '';
      } else {
        this.mainStyle.width = '100%';
        this.sidebarStyle.width = '0%';
        this.sidebarStyle.display = 'none';
      }
    },
    async fetchFileList() {
      let listType;

      if(this.selected === 'Normal'){
        listType = fileList()
      } else if(this.selected === 'SR'){
        listType = srfileList()
      }
        await listType.then(result=> {
          if(result.status==200){
            result.data.forEach((data)=>{
              data.percent = 0
            })
            this.fileList = result.data;
            if(this.selected === 'Normal') {
              this.fetchGetChangeFileList();
            }
          }
        }).catch((e)=> {
          if(e.response.status == 500){
            alert("There is a problem with the server. Please contact the manager.")
          }
        });
    },
    async fetchFileURL(fileInfo) {
      let request = {
        file_name:fileInfo.name
      }
      await fileUpload(request).then(result=> {
        if(result.status==200){
          console.log("fileInfo--->",fileInfo)
          let url = result.data
          this.fileUpload(url,fileInfo)
        }
      }).catch((e)=> {
        if(e.response.status == 500){
          alert("There is a problem with the server. Please contact the manager.")
          this.$emit("loading",false)
        }
        
      });
    },
    async fileUpload(url,fileInfo){
        let fr = new FileReader();
        fr.readAsArrayBuffer(fileInfo);
        let that = this;
        fr.onload = function () {
          
          bufferFile = fr.result;

          let requestOptions = {
              method: 'PUT',
              body: bufferFile,
              headers: {
                  'Content-Type': 'application/octet-stream',
                  // 'Authorization':'Bearer ' + sessionStorage.getItem('accessToken')
                  // 'Content-Length': bufferFile.length
              }
          };
              
          fetch(url, requestOptions)
          .then(response => {
              
              if(that.count+1 === that.uploadFileList.length){
                that.count = 0;
                that.$emit("loading",false)
              } else {
                that.count++
                that.sendSequentially()
                console.log("response___",response);
              }
              that.fetchFileList();
              // alert(JSON.stringify(response));
          })
          .catch(e => {
            if(e.response.status == 500){
              alert("There is a problem with the server. Please contact the manager.")
              this.$emit("loading",false)
            }
          });
        }
    },
  },
}
</script>