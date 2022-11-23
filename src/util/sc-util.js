const scUtil = {
  install (Vue){
    Vue.prototype.$scUtil = {

      guid (mode) {
        let guid = '';
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        if(mode === 'long'){
          guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
        else{
          guid = s4();
        }

        return guid;
      },
    }
  }
};

export default scUtil;
