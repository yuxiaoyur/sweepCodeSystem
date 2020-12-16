<template>
  <el-form>
    <el-form-item label="真实姓名" label-width="100px">
    	 <el-col :span="8">
		    <el-input v-model="dataForm.realname" readonly></el-input>
		  </el-col>
    </el-form-item>
    
    <el-form-item label="最后登录时间" label-width="100px">
    	 <el-col :span="8">
		    <el-input v-model="dataForm.lastlogintime" readonly></el-input>
		  </el-col>
    </el-form-item>
    
    <el-form-item label="部门" label-width="100px">
    	 <el-col :span="8">
		    <el-input v-model="dataForm.deptname" readonly></el-input>
		  </el-col>
    </el-form-item>
    
    
  </el-form>
</template>

<script>
  export default {
  	data () {
      return {
        dataForm: {
          id: 0,
          lastlogintime:'',
          deptname:''
        }
       }
   },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType },
        set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin },
        set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
      }
    },
    mounted () {
      this.getInfo()
    },
    methods:{
    	getInfo(){
    		this.$http({
              url: this.$http.adornUrl(`/user/getUserById`),
              method: 'post'
            }).then(({data}) => {
            	console.log(data)
              if (data && data.successful) {
                this.dataForm.realname = data.data.realname
                this.dataForm.lastlogintime = data.data.lastlogintime
                this.dataForm.deptname = data.data.deptname
              } else {
                this.$message.error(data.message)
              }
            })
    	}
    }
    
  }
</script>

