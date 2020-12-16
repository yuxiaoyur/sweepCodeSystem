<template>
	
  <el-dialog
    title="用户授权"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    
    <el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="用户" name="user">
	    	<bind-user-userlist ref="bindUserUserlist"></bind-user-userlist>
	    </el-tab-pane>
	    <el-tab-pane label="部门" name="dept">
	    	<bind-user-dept ref="bindUserDept"></bind-user-dept>
	    </el-tab-pane>
	    <el-tab-pane label="用户组" name="group">
	    	<bind-user-group ref="bindUserGroup"></bind-user-group>
	    </el-tab-pane>
  	</el-tabs>

		
  </el-dialog>
</template>

<script>
	import BindUserUserlist from './bind-user-userlist'
	import BindUserDept from './bind-user-dept'
	import BindUserGroup from './bind-user-group'
	
  export default {
    data () {
      return {
        visible: false,
        activeName: 'user',	//选项卡默认值
        dataForm: {
          id: ''
        },

        dataListLoading: false
      }
    },
    
    components: {
      BindUserUserlist,
      BindUserDept,
      BindUserGroup
    },
    methods: {
      init (id) {
      	this.dataForm.id = id || 0
        this.visible = true
        //默认触发user选项卡
        if(this.activeName == 'user'){
       
        this.$nextTick(() => {
	          this.$refs.bindUserUserlist.init(this.dataForm.id)
	        })
        }else if(this.activeName == 'dept'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindUserDept.init(this.dataForm.id)
	        })
        }else if(this.activeName == 'group'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindUserGroup.init(this.dataForm.id)
	        })
        }
        
      },
      //选项卡切换
      handleClick(tab, event) {
        if(tab.name == 'user'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindUserUserlist.init(this.dataForm.id)
	        })
        }else if(tab.name == 'dept'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindUserDept.init(this.dataForm.id)
	        })
        }else if(tab.name == 'group'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindUserGroup.init(this.dataForm.id)
	        })
        }
        
      }
    }
  }
</script>
