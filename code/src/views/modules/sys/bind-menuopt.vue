<template>
	
  <el-dialog
    title="菜单配置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    
    <el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="菜单权限" name="menuOpt">
	    	<bind-menuopt-list ref="bindMenuoptList"></bind-menuopt-list>
	    </el-tab-pane>
  	</el-tabs>

		
  </el-dialog>
</template>

<script>
	import BindMenuoptList from './bind-menuopt-list'
  export default {
    data () {
      return {
        visible: false,
        activeName: 'menuOpt',	//选项卡默认值
        dataForm: {
          id: ''
        },

        dataListLoading: false
      }
    },
    
    components: {
      BindMenuoptList
    },
    methods: {
      init (id) {
      	this.dataForm.id = id || 0
        this.visible = true
        //默认触发user选项卡
        this.$nextTick(() => {
	          this.$refs.bindMenuoptList.init(this.dataForm.id)
	    })
        
      },
      //选项卡切换
      handleClick(tab, event) {
        if(tab.name == 'menuOpt'){
        	
        	this.$nextTick(() => {
	          this.$refs.bindMenuoptList.init(this.dataForm.id)
	        })
        }
      }
    }
  }
</script>
