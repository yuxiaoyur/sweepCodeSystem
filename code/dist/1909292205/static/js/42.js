webpackJsonp([42,65],{w4aG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("E4LH");var r={data:function(){return{visible:!1,dataForm:{id:0,sj:"",yjxtgn:"",erjxtgn:"",sjxtgn:"",bjxx:"",lx:1,url:""},dataRule:{yjxtgn:[{required:!0,message:"一级系统功能不能为空",trigger:"blur"},{max:10,message:"长度不超过10个字",trigger:"blur"}],erjxtgn:[{required:!0,message:"二级系统功能不能为空",trigger:"blur"},{max:20,message:"长度不超过10个字",trigger:"blur"}],sjxtgn:[{required:!0,message:"三级系统功能不能为空",trigger:"blur"},{max:20,message:"长度不超过10个字",trigger:"blur"}]}}},methods:{init:function(t){var e=this;this.visible=!0,this.$nextTick(function(){e.$refs.dataForm.resetFields(),e.dataForm.id=t,e.dataForm.id&&e.$http({url:e.$http.adornUrl("/kfkb/xtjrgljk/detail?id="+e.dataForm.id),method:"get"}).then(function(t){var a=t.data;a&&a.successful?(e.dataForm.sj=a.data.sj,e.dataForm.yjxtgn=a.data.yjxtgn,e.dataForm.erjxtgn=a.data.erjxtgn,e.dataForm.sjxtgn=a.data.sjxtgn,e.dataForm.bjxx=a.data.bjxx,e.dataForm.lx=a.data.lx,e.dataForm.url=a.data.url):(console.log("ERROR",a),e.$message.error("操作失败"))})})},dataFormSubmit:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&t.$http({url:t.$http.adornUrl("/kfkb/xtjrgljk/"+(t.dataForm.id?"update":"save")),method:"post",params:t.$http.adornParams({id:t.dataForm.id||void 0,sj:t.dataForm.sj,yjxtgn:t.dataForm.yjxtgn,erjxtgn:t.dataForm.erjxtgn,sjxtgn:t.dataForm.sjxtgn,bjxx:t.dataForm.bjxx,lx:t.dataForm.lx,url:t.dataForm.url})}).then(function(e){var a=e.data;a&&a.successful?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.visible=!1,t.$emit("refreshDataList")}}):t.$message.error(a.message)})})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:t.dataForm.id?"修改":"新增","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-form",{ref:"dataForm",attrs:{model:t.dataForm,rules:t.dataRule,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"一级系统功能",prop:"yjxtgn"}},[a("el-input",{attrs:{placeholder:"一级系统功能，长度不超过10个字"},model:{value:t.dataForm.yjxtgn,callback:function(e){t.$set(t.dataForm,"yjxtgn",e)},expression:"dataForm.yjxtgn"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"二级系统功能",prop:"erjxtgn"}},[a("el-input",{attrs:{placeholder:"二级系统名称，长度不超过10个字"},model:{value:t.dataForm.erjxtgn,callback:function(e){t.$set(t.dataForm,"erjxtgn",e)},expression:"dataForm.erjxtgn"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"三级系统功能",prop:"sjxtgn"}},[a("el-input",{attrs:{placeholder:"三级系统名称，长度不超过10个字"},model:{value:t.dataForm.sjxtgn,callback:function(e){t.$set(t.dataForm,"sjxtgn",e)},expression:"dataForm.sjxtgn"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"表（接口）信息",prop:"bjxx"}},[a("el-input",{model:{value:t.dataForm.bjxx,callback:function(e){t.$set(t.dataForm,"bjxx",e)},expression:"dataForm.bjxx"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"类型",size:"mini",prop:"lx"}},[a("el-radio-group",{model:{value:t.dataForm.lx,callback:function(e){t.$set(t.dataForm,"lx",e)},expression:"dataForm.lx"}},[a("el-radio",{attrs:{label:0}},[t._v("接口")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("表")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"备注",prop:"url"}},[a("el-input",{model:{value:t.dataForm.url,callback:function(e){t.$set(t.dataForm,"url",e)},expression:"dataForm.url"}})],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.visible=!1}}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dataFormSubmit()}}},[t._v("确定")])],1)],1)},staticRenderFns:[]},i=a("46Yf")(r,n,!1,null,null,null);e.default=i.exports},wHc3:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={data:function(){return{dataForm:{gjc:"",date:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1,dataListSelections:[],permission:[],permissionVisible:{add:!1,update:!1,delete:!1},addOrUpdateVisible:!1}},components:{AddOrUpdate:a("w4aG").default},activated:function(){this.getDataList()},mounted:function(){this.getPermission()},methods:{getPermission:function(){var t=this;this.$http({url:this.$http.adornUrl("/sys/menuPermission"),method:"get",params:this.$http.adornParams({menuId:this.$route.meta.menuId})}).then(function(e){var a=e.data;t.permission=a;for(var r=0;r<a.length;r++)switch(a[r].split(":")[1]){case"add":t.permissionVisible.add=!0;break;case"update":t.permissionVisible.update=!0;break;case"delete":t.permissionVisible.delete=!0}})},hasPermission:function(t){switch(t){case"add":return this.permissionVisible.add;case"update":return this.permissionVisible.update;case"delete":return this.permissionVisible.delete;default:return!1}},getDataList:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/kfkb/xtjrgljk"),method:"get",params:this.$http.adornParams({page:this.pageIndex,limit:this.pageSize,gjc:this.dataForm.gjc,date:this.dataForm.date})}).then(function(e){var a=e.data;a&&a.successful?(t.dataList=a.data.list,t.totalPage=a.data.total,t.dataListLoading=!1):(console.log("ERROR",a),t.$message.error("操作失败"))})},sizeChangeHandle:function(t){this.pageSize=t,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(t){this.pageIndex=t,this.getDataList()},selectionChangeHandle:function(t){this.dataListSelections=t},addOrUpdateHandle:function(t){var e=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){e.$refs.addOrUpdate.init(t)})},deleteHandle:function(t){var e=this,a=t?[t]:this.dataListSelections.map(function(t){return t.id});null!=a&&""!=a?this.$confirm("确定进行["+(t?"删除":"批量删除")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http({url:e.$http.adornUrl("/kfkb/xtjrgljk/remove"),method:"post",params:e.$http.adornParams({id:a.join(",")},!1)}).then(function(t){var a=t.data;a&&a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.getDataList()}}):e.$message.error(a.message)})}).catch(function(){}):this.$message.error("请选择要删除的数据")}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mod-kfkb-rcjl"},[a("el-form",{attrs:{inline:!0,model:t.dataForm},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.getDataList()}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"输入系统级别信息",clearable:""},model:{value:t.dataForm.gjc,callback:function(e){t.$set(t.dataForm,"gjc",e)},expression:"dataForm.gjc"}})],1),t._v(" "),a("el-form-item",[a("el-input",{attrs:{placeholder:"时间(yyyy-MM-dd)",clearable:""},model:{value:t.dataForm.date,callback:function(e){t.$set(t.dataForm,"date",e)},expression:"dataForm.date"}})],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.getDataList()}}},[t._v("查询")]),t._v(" "),t.hasPermission("add")?a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addOrUpdateHandle()}}},[t._v("新增")]):t._e(),t._v(" "),t.hasPermission("delete")?a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.deleteHandle()}}},[t._v("批量删除")]):t._e()],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataList,border:""},on:{"selection-change":t.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:"center",width:"50"}}),t._v(" "),a("el-table-column",{attrs:{prop:"yjxtgn","header-align":"center",align:"center",width:"160",label:"一级系统功能"}}),t._v(" "),a("el-table-column",{attrs:{prop:"erjxtgn","header-align":"center",align:"center",width:"160",label:"二级系统功能"}}),t._v(" "),a("el-table-column",{attrs:{prop:"sjxtgn","header-align":"center",align:"center",width:"160",label:"三级系统功能"}}),t._v(" "),a("el-table-column",{attrs:{prop:"lx","header-align":"center",align:"center",width:"80",label:"类型"},scopedSlots:t._u([{key:"default",fn:function(e){return[1==e.row.lx?a("el-tag",{attrs:{size:"small",type:"danger"}},[t._v("表")]):a("el-tag",{attrs:{size:"small"}},[t._v("接口")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"bjxx","header-align":"center",align:"center",width:"160",label:"表（接口）信息"}}),t._v(" "),a("el-table-column",{attrs:{prop:"url","header-align":"center",align:"center",label:"备注"}}),t._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",width:"100",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.hasPermission("update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.addOrUpdateHandle(e.row.id)}}},[t._v("修改")]):t._e(),t._v(" "),t.hasPermission("delete")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.deleteHandle(e.row.id)}}},[t._v("删除")]):t._e()]}}])})],1),t._v(" "),a("el-pagination",{attrs:{"current-page":t.pageIndex,"page-sizes":[10,20,50,100],"page-size":t.pageSize,total:t.totalPage,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":t.sizeChangeHandle,"current-change":t.currentChangeHandle}}),t._v(" "),t.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:t.getDataList}}):t._e()],1)},staticRenderFns:[]},i=a("46Yf")(r,n,!1,null,null,null);e.default=i.exports}});