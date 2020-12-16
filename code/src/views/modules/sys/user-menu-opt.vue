<template>
  <el-dialog
    :title="'查看权限'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-tree :data="dataList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        defaultProps: {
          children: 'children',
          label: 'menu_name'
        }
//      ,tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
      	this.$http({
          url: this.$http.adornUrl('/user/getUserMenuOpt'),
            method: 'get',
            params: this.$http.adornParams({id:id},false)
        }).then(({data}) => {
        	if(data.successful){
        		var list = data.data;
        		var result = [];
        		//处理菜单
        		for (var i = 0; i < list.length; i++) {
        			var temp = {
        				menu_id :  list[i].menu_id,
        				menu_name : list[i].menu_name + '【' + list[i].opt_name + '】',
        				parent_id : list[i].parent_id
        			}
        			
        			var flag = false;
        			for (var j = 0; j < result.length; j++) {
        				if(result[j].menu_id == temp.menu_id){
        					flag = true
        					result[j].menu_name = result[j].menu_name.split("】")[0] + '、' + list[i].opt_name + '】'
        					break
        				}
        			}
        			if(!flag){
        				result.push(temp)
        			}
        		}

        		
        		this.dataList = treeDataTranslate(result, 'menu_id','parent_id')	
        		console.log(this.dataList)
        	}else{
        		console.log('ERROR',data)
        	}
          
        }).then(() => {
          this.visible = true
        })
      },
      // 表单提交
       handleNodeClick(data) {
        console.log(data);
      }
      
      
      
    }
  }
</script>
