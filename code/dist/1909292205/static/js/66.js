webpackJsonp([66],{DSak:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={data:function(){return{visible:!1,activeName:"user",dataForm:{id:"",REALNAME:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1}},methods:{init:function(t){this.dataForm.id=t||0,this.visible=!0,this.getDataList()},getDataList:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/group/getUserList"),method:"post",data:this.$http.adornData({type:"user",id:this.dataForm.id,name:this.dataForm.REALNAME,page:this.pageIndex,limit:this.pageSize},!1)}).then(function(e){var a=e.data;a.successful?(t.dataList=a.data.list,t.totalPage=a.data.total,t.dataListLoading=!1):console.log("ERROR",a)})},sizeChangeHandle:function(t){this.pageSize=t,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(t){this.pageIndex=t,this.getDataList()},bindHandle:function(t){var e=this,a=this;this.$confirm("确定进行[绑定]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http({url:e.$http.adornUrl("/group/bindUser"),method:"post",data:e.$http.adornData({groupId:a.dataForm.id,userId:t},!1)}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){e.getDataList()}}):(console.log("ERROR",a),e.$message.error("操作失败"))})}).catch(function(){})},unbindHandle:function(t){var e=this,a=this;this.$confirm("确定进行[解绑]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http({url:e.$http.adornUrl("/group/untieUser"),method:"post",data:e.$http.adornData({groupId:a.dataForm.id,userId:t},!1)}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){e.getDataList()}}):(console.log("ERROR",a),e.$message.error("操作失败"))})}).catch(function(){})}}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:"绑定用户","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-form",{attrs:{inline:!0,model:t.dataForm},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.getDataList()}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"用户名",clearable:""},model:{value:t.dataForm.REALNAME,callback:function(e){t.$set(t.dataForm,"REALNAME",e)},expression:"dataForm.REALNAME"}})],1),t._v(" "),a("el-form-item",[a("el-button",{on:{click:function(e){t.getDataList()}}},[t._v("查询")])],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataList,border:"",height:"460"}},[a("el-table-column",{attrs:{prop:"DEPTNAME","header-align":"center",align:"center",label:"所属部门"}}),t._v(" "),a("el-table-column",{attrs:{prop:"REALNAME","header-align":"center",align:"center",label:"用户名"}}),t._v(" "),a("el-table-column",{attrs:{prop:"STATE","header-align":"center",align:"center",label:"当前状态"},scopedSlots:t._u([{key:"default",fn:function(e){return["0"==e.row.STATE?a("el-tag",{attrs:{size:"small"}},[t._v("未绑定")]):"1"==e.row.STATE?a("el-tag",{attrs:{size:"small",type:"success"}},[t._v("已绑定")]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{fixed:"right","header-align":"center",align:"center",width:"150",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return["0"==e.row.STATE?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.bindHandle(e.row.ID)}}},[t._v("绑定")]):t._e(),t._v(" "),"1"==e.row.STATE?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.unbindHandle(e.row.ID)}}},[t._v("解绑")]):t._e()]}}])})],1),t._v(" "),a("el-pagination",{attrs:{"current-page":t.pageIndex,"page-sizes":[10,20,50,100],"page-size":t.pageSize,total:t.totalPage,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":t.sizeChangeHandle,"current-change":t.currentChangeHandle}})],1)},staticRenderFns:[]},s=a("46Yf")(n,i,!1,null,null,null);e.default=s.exports}});