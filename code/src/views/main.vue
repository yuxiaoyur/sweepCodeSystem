<template>
  <div id="main"
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      }
    },
    created () {
    	// eslint-disable-next-line
    	this.getUserInfo()
        
    },
    mounted () {
      this.resetDocumentClientHeight()
      this.checkLock()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/user/getUserInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data.successful) {
            this.loading = false
//          this.userId = data.data.userId
            this.userName = data.data.realname
	    localStorage.setItem('user',data.data.id)
          }
        })
      },
      //首页判断是否锁屏
      checkLock(){
      	if(sessionStorage.getItem('lock') && sessionStorage.getItem('lock') == 'lock'){
      		this.$router.push({ name: 'locking' })
      	}
      }
      
    }
  }
</script>
