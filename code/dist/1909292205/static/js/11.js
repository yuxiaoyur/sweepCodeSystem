webpackJsonp([11,79],{SaeW:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={data:function(){return{usingStatusOptions:[{value:"已使用",lable:"已使用"},{value:"未使用",lable:"未使用"},{value:"淘汰",lable:"淘汰"}],dataForm:{id:"",dataType:"",department:"",apiUrl:"",usingStatus:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1,dataListSelections:[],permission:[],permissionVisible:{add:!1,update:!1,delete:!1},addOrUpdateVisible:!1}},computed:{},components:{addOrUpdate:a("gDfy").default},activated:function(){this.getDataList()},mounted:function(){this.getPermission()},methods:{getPermission:function(){var e=this;this.$http({url:this.$http.adornUrl("/sys/menuPermission"),method:"get",params:this.$http.adornParams({menuId:this.$route.meta.menuId})}).then(function(t){var a=t.data;e.permission=a;for(var r=0;r<a.length;r++)switch(a[r].split(":")[1]){case"add":e.permissionVisible.add=!0;break;case"update":e.permissionVisible.update=!0;break;case"delete":e.permissionVisible.delete=!0}})},hasPermission:function(e){switch(e){case"add":return this.permissionVisible.add;case"update":return this.permissionVisible.update;case"delete":return this.permissionVisible.delete;default:return!1}},getDataList:function(){var e=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/data_merge_ledger/list"),method:"post",params:this.$http.adornParams({page:this.pageIndex,limit:this.pageSize,doneUser:this.dataForm.doneUser,dataType:this.dataForm.dataType,department:this.dataForm.department,apiUrl:this.dataForm.apiUrl,usingStatus:this.dataForm.usingStatus})}).then(function(t){var a=t.data;a&&a.successful?(e.dataList=a.data.list,e.totalPage=a.data.total,e.dataListLoading=!1):(console.log("ERROR",a),e.$message.error("操作失败"))})},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},selectionChangeHandle:function(e){this.dataListSelections=e},addOrUpdateHandle:function(e,t){var a=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){a.$refs.addOrUpdate.initializing(e,t)})},deleteHandle:function(e){var t=this,a=e?[e]:this.dataListSelections.map(function(e){return e.id});null!=a&&""!==a?this.$confirm("确定进行["+(a?"删除":"批量删除")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http({url:t.$http.adornUrl("/business_manage/deleteRecord"),method:"post",params:t.$http.adornParams({id:a.join(",")},!1)}).then(function(e){var a=e.data;a&&a.successful?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.getDataList()}}):t.$message.error(a.message)})}).catch(function(){}):this.$message.error("请选择要删除的数据")}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-mssq-rcfx"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.getDataList()}}},[a("el-row",[a("el-col",{attrs:{span:3}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"数据类",clearable:""},model:{value:e.dataForm.dataType,callback:function(t){e.$set(e.dataForm,"dataType",t)},expression:"dataForm.dataType"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:3}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"部门",clearable:""},model:{value:e.dataForm.department,callback:function(t){e.$set(e.dataForm,"department",t)},expression:"dataForm.department"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"接口地址",clearable:""},model:{value:e.dataForm.apiUrl,callback:function(t){e.$set(e.dataForm,"apiUrl",t)},expression:"dataForm.apiUrl"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-select",{attrs:{placeholder:"请选择使用状态",clearable:""},model:{value:e.dataForm.usingStatus,callback:function(t){e.$set(e.dataForm,"usingStatus",t)},expression:"dataForm.usingStatus"}},e._l(e.usingStatusOptions,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1)],1),e._v(" "),a("el-form-item",[a("el-button",{on:{click:function(t){e.getDataList()}}},[e._v("查询")])],1),e._v(" "),a("el-form-item",[e.hasPermission("add")?a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addOrUpdateHandle(e.dataForm.id,"add")}}},[e._v("新增\n        ")]):e._e()],1)],1)],1),e._v(" "),a("br"),a("br"),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",stripe:"","highlight-current-row":"",height:"500","max-height":"500"},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{prop:"dataType","header-align":"center",align:"center",label:"数据类",sortable:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"department","header-align":"center",align:"center",sortable:"",label:"部门"}}),e._v(" "),a("el-table-column",{attrs:{prop:"apiUrl","header-align":"center",align:"center",sortable:"",label:"接口地址"}}),e._v(" "),a("el-table-column",{attrs:{prop:"usingStatus","header-align":"center",align:"center",sortable:"",label:"使用状态"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",width:"120",label:"操作",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.addOrUpdateHandle(t.row.id,"update")}}},[e._v("修改\n        ")]):e._e(),e._v(" "),e.hasPermission("delete")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.deleteHandle(t.row.id)}}},[e._v("删除\n        ")]):e._e()]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var n=a("46Yf")(r,i,!1,function(e){a("hhTA")},null,null);t.default=n.exports},gDfy:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={data:function(){return{visible:!1,dataForm:{id:"",dataType:"",departmetn:"",apiUrl:"",usingStatus:""},rules:{dataType:[{required:!0,message:"请输入数据类名称",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],department:[{required:!0,message:"请输入部门名称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],apiUrl:[{required:!0,message:"请输入接口地址",trigger:"blur"},{min:2,max:166,message:"长度在 2 到 66 个字符",trigger:"blur"}],usingStatus:[{required:!0,message:"请选择使用状态",trigger:"change"}]}}},methods:{initializing:function(e,t){var a=this;this.visible=!0,this.$nextTick(function(){if(a.$refs.dataForm.resetFields(),"number"==typeof e)a.$http({url:a.$http.adornUrl("/data_merge_ledger/detail"),method:"get",params:a.$http.adornParams({id:e})}).then(function(e){var t=e.data;t&&t.successful?a.dataForm=t.data:(console.log("ERROR",t),a.$message.error("操作失败"))});else for(var r in a.dataForm)a.dataForm[r]="";a.dataForm.type=t})},dataFormSubmit:function(){var e=this;this.$refs.dataForm.validate(function(t){if(!t)return!1;e.$http({url:e.$http.adornUrl("/data_merge_ledger/"+("add"===e.dataForm.type?"insert":"update")),method:"post",data:e.$http.adornData({id:e.dataForm.id||void 0,dataType:e.dataForm.dataType,department:e.dataForm.department,apiUrl:e.dataForm.apiUrl,usingStatus:e.dataForm.usingStatus})}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):(console.log("ERROR",a),e.$message.error("操作失败"))})})}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"add"===e.dataForm.type?"新增":"修改","modal-append-to-body":!1,"close-on-click-modal":!1,visible:e.visible,width:"60%"},on:{"update:visible":function(t){e.visible=t}}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,"label-width":"15%",rules:e.rules}},[a("el-form-item",{attrs:{label:"数据类",prop:"dataType"}},[a("el-input",{model:{value:e.dataForm.dataType,callback:function(t){e.$set(e.dataForm,"dataType",t)},expression:"dataForm.dataType"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"部门",prop:"department"}},[a("el-input",{model:{value:e.dataForm.department,callback:function(t){e.$set(e.dataForm,"department",t)},expression:"dataForm.department"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"接口地址",prop:"apiUrl"}},[a("el-input",{model:{value:e.dataForm.apiUrl,callback:function(t){e.$set(e.dataForm,"apiUrl",t)},expression:"dataForm.apiUrl"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"使用状态",prop:"usingStatus"}},[a("el-radio-group",{model:{value:e.dataForm.usingStatus,callback:function(t){e.$set(e.dataForm,"usingStatus",t)},expression:"dataForm.usingStatus"}},[a("el-radio",{attrs:{label:"已使用"}},[e._v("已使用")]),e._v(" "),a("el-radio",{attrs:{label:"未使用"}},[e._v("未使用")]),e._v(" "),a("el-radio",{attrs:{label:"淘汰"}},[e._v("淘汰")])],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("保存")])],1)],1)},staticRenderFns:[]},n=a("46Yf")(r,i,!1,null,null,null);t.default=n.exports},hhTA:function(e,t,a){var r=a("rMIt");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a("FIqI")("4d204d03",r,!0,{})},rMIt:function(e,t,a){(e.exports=a("UTlt")(!1)).push([e.i,"\n.fixElDatePicker {\n  -ms-flex-line-pack: center;\n      align-content: center;\n}\n.demo-table-expand {\n  font-size: 0;\n}\n.demo-table-expand label {\n  width: 120px;\n  color: #99a9bf;\n}\n.demo-table-expand .el-form-item {\n  margin-right: 0;\n  margin-bottom: 0;\n  width: 50%;\n}\n",""])}});