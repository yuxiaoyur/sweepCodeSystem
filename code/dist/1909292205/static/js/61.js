webpackJsonp([61],{nGpY:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("7+Dk"),n=a("KtFE"),d=a("0xDb"),s={data:function(){return{visible:!1,dataForm:{id:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1,addOrUpdateVisible:!1}},components:{TableTreeColumn:i.a,AddOrUpdate:n.default},methods:{init:function(t){this.dataForm.id=t||0,this.visible=!0,this.getDataList()},getDataList:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/meta/metaList"),method:"get",params:this.$http.adornParams({typeId:this.dataForm.id},!1)}).then(function(e){var a=e.data;a.successful?(t.dataList=Object(d.c)(a.data,"id","parentCode"),t.dataListLoading=!1):console.log("ERROR",a)})},sizeChangeHandle:function(t){this.pageSize=t,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(t){this.pageIndex=t,this.getDataList()},addOrUpdateHandle:function(t){var e=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){e.$refs.addOrUpdate.init(t,e.dataForm.id)})},deleteHandle:function(t){var e=this;this.$confirm("确定进行[删除]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http({url:e.$http.adornUrl("/meta/removeMate"),method:"post",params:e.$http.adornParams({id:t},!1)}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.getDataList()}}):(console.log("ERROR",a),e.$message.error("操作失败"))})}).catch(function(){})}}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:"元数据维护","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-form",{attrs:{inline:!0,model:t.dataForm}},[a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addOrUpdateHandle()}}},[t._v("新增")])],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataList,border:"",height:"460"}},[a("table-tree-column",{attrs:{prop:"dataName","header-align":"center",align:"center",treeKey:"id",parentKey:"parentCode",label:"元数据名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"dataCode","header-align":"center",align:"center",label:"元数据代码"}}),t._v(" "),a("el-table-column",{attrs:{fixed:"right","header-align":"center",align:"center",width:"150",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.addOrUpdateHandle(e.row.id)}}},[t._v("修改")]),t._v(" "),a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.deleteHandle(e.row.id)}}},[t._v("删除")])]}}])})],1),t._v(" "),t.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:t.getDataList}}):t._e()],1)},staticRenderFns:[]},l=a("46Yf")(s,r,!1,null,null,null);e.default=l.exports}});