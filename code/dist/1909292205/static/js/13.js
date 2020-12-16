webpackJsonp([13,83],{"5qfT":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("Ndwf"),l={computed:{isView:function(){return"查看"===this.whichType(this.dataForm.type)}},components:{ElInput:a("4lon").a,ElFormItem:i.a},data:function(){return{visible:!1,deptName:[],dataForm:{id:"",dbName:"",dbTable:"",dbCnName:"",exhibitionDbDept:"",tableCnName:"",updateFrequencyValue:"",updateFrequencyUnit:"",type:""},rules:{dbName:[{required:!0,message:"请输入数据库名称",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],dbTable:[{required:!0,message:"请输入数据库表名称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],dbCnName:[{required:!0,message:"请输入库全称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],tableCnName:[{required:!0,message:"请输入表全称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],updateFrequencyValue:[{required:!0,message:"请输入更新周期",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],updateFrequencyUnit:[{required:!0,message:"请",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}]}}},methods:{whichType:function(e){return"add"===e?"新增":"update"===e?"修改":"view"===e?"查看":void 0},getDept:function(e){this.deptName=e},initializing:function(e,t){var a=this;this.visible=!0,this.$nextTick(function(){if(a.$refs.dataForm.resetFields(),"number"==typeof e)a.$http({url:a.$http.adornUrl("/exhibition_db/table"),method:"get",params:a.$http.adornParams({id:e})}).then(function(i){var l=i.data;l&&l.successful?(a.dataForm=l.data,a.dataForm.type=t,a.dataForm.id=e):(console.log("ERROR",l),a.$message.error("操作失败"))});else{for(var i in a.dataForm)a.dataForm[i]="";a.dataForm.provideWay="库表"}a.dataForm.type=t})},dataFormSubmit:function(){var e=this;this.$refs.dataForm.validate(function(t){if(!t)return!1;e.$http({url:e.$http.adornUrl("/exhibition_db/table"),method:"add"===e.dataForm.type?"post":"put",data:e.$http.adornData({id:e.dataForm.id||void 0,exhibitionDbDeptId:e.dataForm.exhibitionDbDept,dbName:e.dataForm.dbName,dbTable:e.dataForm.dbTable,updateFrequencyValue:e.dataForm.updateFrequencyValue,updateFrequencyUnit:e.dataForm.updateFrequencyUnit,deleteFlag:"1"})}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):(console.log("ERROR",a),e.$message.error("操作失败"))})})}}},n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.whichType(e.dataForm.type),"modal-append-to-body":!1,"close-on-click-modal":!1,visible:e.visible,width:"60%"},on:{"update:visible":function(t){e.visible=t}}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,"label-width":"20%",rules:e.rules}},[a("el-form-item",{attrs:{label:"数据库名称",prop:"dbName"}},[a("el-input",{attrs:{disabled:e.isView},model:{value:e.dataForm.dbName,callback:function(t){e.$set(e.dataForm,"dbName",t)},expression:"dataForm.dbName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"部门"}},[a("el-select",{attrs:{"allow-create":"",filterable:"","default-first-option":"",placeholder:"请选择部门",clearable:"",disabled:e.isView},model:{value:e.dataForm.exhibitionDbDept,callback:function(t){e.$set(e.dataForm,"exhibitionDbDept",t)},expression:"dataForm.exhibitionDbDept"}},e._l(e.deptName,function(t){return a("el-option",{key:t.moduleDept,attrs:{label:t.moduleDept,value:t.moduleDeptId}},[e._v("\n          "+e._s(t.moduleDept)+"\n        ")])}))],1),e._v(" "),a("el-form-item",{attrs:{label:"数据库表名称",prop:"dbTable"}},[a("el-input",{attrs:{disabled:e.isView},model:{value:e.dataForm.dbTable,callback:function(t){e.$set(e.dataForm,"dbTable",t)},expression:"dataForm.dbTable"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"更新周期",prop:"updateFrequencyValue"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{disabled:e.isView},model:{value:e.dataForm.updateFrequencyValue,callback:function(t){e.$set(e.dataForm,"updateFrequencyValue",t)},expression:"dataForm.updateFrequencyValue"}},[a("el-select",{staticStyle:{width:"120px"},attrs:{slot:"append",prop:"updateFrequencyUnit",placeholder:"请选择单位",disabled:e.isView},slot:"append",model:{value:e.dataForm.updateFrequencyUnit,callback:function(t){e.$set(e.dataForm,"updateFrequencyUnit",t)},expression:"dataForm.updateFrequencyUnit"}},[a("el-option",{attrs:{label:"年",value:"年"}}),e._v(" "),a("el-option",{attrs:{label:"月",value:"月"}}),e._v(" "),a("el-option",{attrs:{label:"周",value:"周"}}),e._v(" "),a("el-option",{attrs:{label:"天",value:"天",name:"1"}}),e._v(" "),a("el-option",{attrs:{label:"小时",value:"小时",name:"2"}}),e._v(" "),a("el-option",{attrs:{label:"分",value:"分",name:"3"}})],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.isView},on:{click:function(t){e.dataFormSubmit()}}},[e._v("保存")])],1)],1)},staticRenderFns:[]},r=a("46Yf")(l,n,!1,null,null,null);t.default=r.exports},"8Zud":function(e,t,a){(e.exports=a("UTlt")(!1)).push([e.i,"\n.fixElDatePicker {\n  -ms-flex-line-pack: center;\n      align-content: center;\n}\n.demo-table-expand {\n  font-size: 0;\n}\n.demo-table-expand label {\n  width: 120px;\n  color: #99a9bf;\n}\n.demo-table-expand .el-form-item {\n  margin-right: 0;\n  margin-bottom: 0;\n  width: 50%;\n}\n",""])},fL1N:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={data:function(){return{deptName:[],dataForm:{id:"",exhibitionDbDept:"",dbName:"",tableCnName:"",dbTable:"",dbCnName:"",updateFrequency:"",updateFrequencyValue:"",updateFrequencyUnit:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1,dataListSelections:[],permission:[],permissionVisible:{add:!1,update:!1,delete:!1},addOrUpdateVisible:!1}},computed:{},components:{addOrUpdate:a("5qfT").default},activated:function(){this.getDataList()},mounted:function(){this.getPermission(),this.getDeptData()},methods:{getDeptData:function(){var e=this;this.$http({url:this.$http.adornUrl("/exhibition_layer/modules"),method:"get",params:this.$http.adornParams({page:this.pageIndex,limit:this.pageSize})}).then(function(t){var a=t.data;a&&a.successful?e.deptName=a.data:(console.log("ERROR",a),e.$message.error("操作失败"))})},getPermission:function(){var e=this;this.$http({url:this.$http.adornUrl("/sys/menuPermission"),method:"get",params:this.$http.adornParams({menuId:this.$route.meta.menuId})}).then(function(t){var a=t.data;e.permission=a;for(var i=0;i<a.length;i++)switch(a[i].split(":")[1]){case"add":e.permissionVisible.add=!0;break;case"update":e.permissionVisible.update=!0;break;case"delete":e.permissionVisible.delete=!0}})},hasPermission:function(e){switch(e){case"add":return this.permissionVisible.add;case"update":return this.permissionVisible.update;case"delete":return this.permissionVisible.delete;default:return!1}},getDataList:function(){var e=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/exhibition_db/tables"),method:"get",params:this.$http.adornParams({page:this.pageIndex,limit:this.pageSize,exhibitionDbDept:this.dataForm.exhibitionDbDept,dbName:this.dataForm.dbName,dbCnName:this.dataForm.dbCnName,dbTable:this.dataForm.dbTable,tableCnName:this.dataForm.tableCnName,updateFrequencyValue:this.dataForm.updateFrequencyValue,updateFrequencyUnit:this.dataForm.updateFrequencyUnit})}).then(function(t){var a=t.data;a&&a.successful?(e.dataList=a.data.list,e.totalPage=a.data.total,e.dataListLoading=!1):(console.log("ERROR",a),e.$message.error("操作失败"))})},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},selectionChangeHandle:function(e){this.dataListSelections=e},addOrUpdateHandle:function(e,t){var a=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){a.$refs.addOrUpdate.initializing(e,t),a.$refs.addOrUpdate.getDept(a.deptName)})},deleteHandle:function(e){var t=this,a=e?[e]:this.dataListSelections.map(function(e){return e.id});null!=a&&""!==a?this.$confirm("确定进行["+(a?"删除":"批量删除")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http({url:t.$http.adornUrl("/exhibition_db/table"),method:"delete",params:t.$http.adornParams({id:a.join(",")},!1)}).then(function(e){var a=e.data;a&&a.successful?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.getDataList()}}):t.$message.error(a.message)})}).catch(function(){}):this.$message.error("请选择要删除的数据")}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-mssq-rcfx"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.getDataList()}}},[a("el-row",[a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"数据库名称",clearable:""},model:{value:e.dataForm.dbName,callback:function(t){e.$set(e.dataForm,"dbName",t)},expression:"dataForm.dbName"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"库全称",clearable:""},model:{value:e.dataForm.dbCnName,callback:function(t){e.$set(e.dataForm,"dbCnName",t)},expression:"dataForm.dbCnName"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-select",{attrs:{"allow-create":"",filterable:"","default-first-option":"",placeholder:"请选择数据来源部门",clearable:""},model:{value:e.dataForm.exhibitionDbDept,callback:function(t){e.$set(e.dataForm,"exhibitionDbDept",t)},expression:"dataForm.exhibitionDbDept"}},e._l(e.deptName,function(t){return a("el-option",{key:t.moduleDept,attrs:{label:t.moduleDept,value:t.moduleDeptId}},[e._v("\n              "+e._s(t.moduleDept)+"\n            ")])}))],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"数据库表名称",clearable:""},model:{value:e.dataForm.dbTable,callback:function(t){e.$set(e.dataForm,"dbTable",t)},expression:"dataForm.dbTable"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"表全称",clearable:""},model:{value:e.dataForm.tableCnName,callback:function(t){e.$set(e.dataForm,"tableCnName",t)},expression:"dataForm.tableCnName"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:4}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"更新周期",clearable:""},model:{value:e.dataForm.updateFrequencyValue,callback:function(t){e.$set(e.dataForm,"updateFrequencyValue",t)},expression:"dataForm.updateFrequencyValue"}},[a("el-select",{staticStyle:{width:"75px"},attrs:{slot:"append",placeholder:"单位",clearable:""},slot:"append",model:{value:e.dataForm.updateFrequencyUnit,callback:function(t){e.$set(e.dataForm,"updateFrequencyUnit",t)},expression:"dataForm.updateFrequencyUnit"}},[a("el-option",{attrs:{label:"年",value:"年"}}),e._v(" "),a("el-option",{attrs:{label:"月",value:"月"}}),e._v(" "),a("el-option",{attrs:{label:"周",value:"周"}}),e._v(" "),a("el-option",{attrs:{label:"天",value:"天"}}),e._v(" "),a("el-option",{attrs:{label:"小时",value:"小时"}}),e._v(" "),a("el-option",{attrs:{label:"分",value:"分"}})],1)],1)],1)],1),e._v(" "),a("el-form-item",[a("el-button",{on:{click:function(t){e.getDataList()}}},[e._v("查询")])],1),e._v(" "),a("el-form-item",[e.hasPermission("add")?a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addOrUpdateHandle(e.dataForm.id,"add")}}},[e._v("新增")]):e._e()],1)],1)],1),e._v(" "),a("br"),a("br"),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{},attrs:{data:e.dataList,border:""},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{prop:"exhibitionDbDept","header-align":"center",align:"center",sortable:"",label:"部门"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dbName","header-align":"center",align:"center",sortable:"",label:"数据库名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dbCnName","header-align":"center",align:"center",sortable:"",label:"库全称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dbTable","header-align":"center",align:"center",sortable:"",label:"数据库表名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"tableCnName","header-align":"center",align:"center",sortable:"",label:"表全称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"updateFrequency","header-align":"center",align:"center",sortable:"",label:"更新周期"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"操作",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.addOrUpdateHandle(t.row.id,"view")}}},[e._v("查看\n        ")]):e._e(),e._v(" "),e.hasPermission("update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.addOrUpdateHandle(t.row.id,"update")}}},[e._v("修改\n        ")]):e._e(),e._v(" "),e.hasPermission("delete")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.deleteHandle(t.row.id)}}},[e._v("删除\n        ")]):e._e()]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var n=a("46Yf")(i,l,!1,function(e){a("tKHR")},null,null);t.default=n.exports},tKHR:function(e,t,a){var i=a("8Zud");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a("FIqI")("5139e2eb",i,!0,{})}});