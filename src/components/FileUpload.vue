<template>
<div>
  <!-- <input class="upload-name input wd-xl" value="" disabled="disabled"> -->
  <form 
    class="upload-img-content"
    :class={hide:!visible}
    method="POST" 
    enctype="multipart/form-data"
    >
    <v-btn color="primary" class="upload">
      <label :for="name" style="cursor:pointer">
        Upload
        <!-- <slot /> -->
      </label>
    </v-btn>
    <input 
      ref="input" 
      type="file"
      style="display:none"
      :name="name" 
      :id="name"
      :multiple="multiple"
      @change="onInputChange"
    >
  </form>
  </div>
</template>
<script>
import axios from 'axios'
// import { fileDelete } from "@/api/modules/file";


export default {
  name: 'FileUpload',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default() {
        return `name-${this.$scUtil.guid()}`
      }
    },
    headers: {
      type: Object,
      default() {
        return {
          'Content-Type': 'multipart/form-data',
          'Authorization':'Bearer ' + sessionStorage.getItem('accessToken')
        }
      }
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      bufferFile:null,
      byteLength:null,
      files: [],
      count:0,
    }
  },
  methods: {
    async onInputChange(e) {
      
      let path = e.target.value;
      console.log("path",path)
      
      for (let i=0; i < e.target.files.length; i++) {
        const f = e.target.files[i]
        const file = {
          file: f,
          filePath: path,
        }
        this.files.push(file)
        this.$emit('add', f) 
      }
      this.$emit('add:all',this.files)
    },
    async delete(fileList) {
      let request = {
        file_list : []
      }
      fileList.forEach(data => {
        request.file_list.push(data.file_name)
      });
      console.log("delete)))))",request)
      return axios({
        baseURL: process.env.VUE_APP_BASE_URL,
        url: `/api/file/delete`,
        method: 'POST',
        headers: {'Authorization':'Bearer ' + sessionStorage.getItem('accessToken')},
        data: request
      });
    },
    clear() {
      // console.log('clear')
      this.files = []
      this.$refs.input.value = null
      this.$emit('change')
    },
    upload(url,fileInfo) {
      this.clear();
      // const form = new FormData()
      
      console.log("fileInfo",fileInfo.file)
      // console.log("filesfilesfiles",this.files)
      // var buffer = new Buffer(fileInfo.filePath)
      // var reader = new FileReader();
      // console.log("reader______",buffer)
      let fr = new FileReader();
      fr.readAsArrayBuffer(fileInfo.file);
      fr.onload = function () {
          this.bufferFile = fr.result;
          this.byteLength = fr.result.byteLength;
          console.log(fr.result);
      }
      console.log("vthis.bufferFile__________",fr)
      let requestOptions = {
        method: 'PUT',
        body: this.bufferFile,
        headers: {
          'Content-Type': 'application/octet-stream',
          // 'Content-Length': this.bufferFile.length,
          // 'Authorization':'Bearer ' + sessionStorage.getItem('accessToken')
        }
      };
      return axios(url, requestOptions);
    }
  },
}
</script>

<style scoped>
form.upload-img-content {
  width: 140px;
}
.hide {
  position: fixed;
  visibility: hidden;
}
</style>