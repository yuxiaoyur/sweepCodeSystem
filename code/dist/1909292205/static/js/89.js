webpackJsonp([89],{v5Me:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("Ndwf"),s=a("4lon"),l=a("6eIc"),d=a("ca4s"),r=a("WlHt"),n=a("azzx"),o={components:{ElCollapse:l.a,ElInput:s.a,ElFormItem:i.a,bindClassDeptFile:d.default,bindClassDeptOther:r.default,bindClassDeptDb:n.default},data:function(){return{currentOpt:"",viewDisable:!1,activeNames:["1"],bindClassDeptFileVisible:!1,bindClassDeptOtherVisible:!1,bindClassDeptDbVisible:!1,visible:!1,dictFileType:[],deptName:[],provideWayId:"",classId:"",dataForm:{id:"",className:"",dataClassDept:"",provideWayId:"",type:"",srcId:"",deleteFlag:!1,deleteSrcId:"",deleteProvideWay:""},rules:{className:[{required:!0,message:"请输入数据类名称",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],dataClassDept:[{required:!0,message:"请输入数据类提供部门",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],provideWayId:[{required:!0,message:"请选择提供方式",trigger:"change"}]}}},methods:{bindUpdate:function(e,t){this.dataForm.srcId=e,this.dataForm.deleteFlag=t},bindDelete:function(e,t,a){this.dataForm.deleteFlag=e,this.dataForm.deleteSrcId=t,this.dataForm.deleteProvideWay=a},getActivet:function(e){return"add"==e?(this.viewDisable=!1,"新增"):"update"==e?(this.viewDisable=!1,"修改"):"view"==e?(this.viewDisable=!0,"查看"):void 0},onRadioChange:function(e){1==e?(this.provideWayId="1",this.bindClassDb(this.classId,e)):2==e?(this.provideWayId="2",this.bindClassFile(this.classId,e)):3==e&&(this.provideWayId="3",this.bindClassOther(this.classId,e))},bindClassDb:function(e,t){var a=this;this.bindClassDeptDbVisible=!0,this.$nextTick(function(){a.$refs.bindClassDeptDb.init(e,t),a.$refs.bindClassDeptDb.getViewDisable(a.viewDisable)})},bindClassFile:function(e,t){var a=this;this.bindClassDeptFileVisible=!0,this.$nextTick(function(){a.$refs.bindClassDeptFile.init(e,t),a.$refs.bindClassDeptFile.getViewDisable(a.viewDisable)})},bindClassOther:function(e,t){var a=this;this.bindClassDeptOtherVisible=!0,this.$nextTick(function(){a.$refs.bindClassDeptOther.init(e,t),a.$refs.bindClassDeptOther.getViewDisable(a.viewDisable)})},getClassType:function(e){this.dictFileType=e},getDept:function(e){this.deptName=e},initializing:function(e,t,a){var i=this;this.visible=!0,this.classId=e,this.provideWayId=a,this.dataForm.type=t,this.currentOpt=t,this.$nextTick(function(){if(i.$refs.dataForm.resetFields(),"number"==typeof e)i.$http({url:i.$http.adornUrl("/data_class/class"),method:"get",params:i.$http.adornParams({id:e})}).then(function(e){var a=e.data;a&&a.successful?(i.dataForm=a.data,0==i.dataForm.dataClassDeptId&&(i.dataForm.dataClassDeptId=null),i.dataForm.type=t):(console.log("ERROR",a),i.$message.error("操作失败"))});else for(var a in i.dataForm)i.dataForm[a]=""}),"1"==a?this.bindClassDb(e,a):"2"==a?this.bindClassFile(e,a):"3"==a&&this.bindClassOther(e,a)},dataFormSubmit:function(){var e=this;this.$refs.dataForm.validate(function(t){if(!t)return!1;e.$http({url:e.$http.adornUrl("/data_class/class"),method:"add"===e.currentOpt?"post":"put",data:e.$http.adornData({id:e.dataForm.id||void 0,className:e.dataForm.className,dataClassDeptId:e.dataForm.dataClassDeptId,provideWayId:e.dataForm.provideWayId,srcId:e.dataForm.srcId||void 0,srcDeleteFlag:e.dataForm.deleteFlag,deleteSrcId:e.dataForm.deleteSrcId,deleteProvideWay:e.dataForm.deleteProvideWay})}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):(console.log("ERROR",a),e.$message.error("操作失败"))})})}}},b={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.getActivet(e.dataForm.type),"modal-append-to-body":!1,"close-on-click-modal":!1,visible:e.visible,width:"60%"},on:{"update:visible":function(t){e.visible=t}}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,"label-width":"20%",rules:e.rules}},[a("el-form-item",{attrs:{label:"数据类名称",prop:"className"}},[a("el-input",{attrs:{disabled:e.viewDisable},model:{value:e.dataForm.className,callback:function(t){e.$set(e.dataForm,"className",t)},expression:"dataForm.className"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"数据类提供部门"}},[a("el-select",{attrs:{filterable:"",placeholder:"请选择部门",clearable:"",disabled:e.viewDisable},model:{value:e.dataForm.dataClassDeptId,callback:function(t){e.$set(e.dataForm,"dataClassDeptId",t)},expression:"dataForm.dataClassDeptId"}},e._l(e.deptName,function(t){return a("el-option",{key:t.value,attrs:{label:t.value,value:t.label}},[e._v("\n          "+e._s(t.value)+"\n        ")])}))],1),e._v(" "),a("el-form-item",{attrs:{label:"提供方式",prop:"provideWayId"}},[a("el-radio-group",{attrs:{disabled:e.viewDisable},on:{change:e.onRadioChange},model:{value:e.dataForm.provideWayId,callback:function(t){e.$set(e.dataForm,"provideWayId",t)},expression:"dataForm.provideWayId"}},e._l(e.dictFileType,function(t){return a("el-radio",{key:t.value,attrs:{label:t.label,value:t.value}},[e._v("\n          "+e._s(t.value)+"\n        ")])}))],1),e._v(" "),a("div",[e.bindClassDeptDbVisible&&"1"==this.provideWayId?a("bind-class-dept-db",{ref:"bindClassDeptDb",on:{bindDeleteEvent:e.bindDelete,bindUpdateEvent:e.bindUpdate}}):e._e(),e._v(" "),e.bindClassDeptFileVisible&&"2"===this.provideWayId?a("bind-class-dept-file",{ref:"bindClassDeptFile",on:{bindDeleteEvent:e.bindDelete,bindUpdateEvent:e.bindUpdate}}):e._e(),e._v(" "),e.bindClassDeptOtherVisible&&"3"==this.provideWayId?a("bind-class-dept-other",{ref:"bindClassDeptOther",on:{bindDeleteEvent:e.bindDelete,bindUpdateEvent:e.bindUpdate}}):e._e()],1)],1),e._v(" "),this.viewDisable?e._e():a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("保存")])],1)],1)},staticRenderFns:[]},c=a("46Yf")(o,b,!1,null,null,null);t.default=c.exports}});