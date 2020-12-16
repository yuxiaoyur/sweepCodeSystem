webpackJsonp([83],{"5qfT":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Ndwf"),i={computed:{isView:function(){return"查看"===this.whichType(this.dataForm.type)}},components:{ElInput:a("4lon").a,ElFormItem:r.a},data:function(){return{visible:!1,deptName:[],dataForm:{id:"",dbName:"",dbTable:"",dbCnName:"",exhibitionDbDept:"",tableCnName:"",updateFrequencyValue:"",updateFrequencyUnit:"",type:""},rules:{dbName:[{required:!0,message:"请输入数据库名称",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],dbTable:[{required:!0,message:"请输入数据库表名称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],dbCnName:[{required:!0,message:"请输入库全称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],tableCnName:[{required:!0,message:"请输入表全称",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],updateFrequencyValue:[{required:!0,message:"请输入更新周期",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}],updateFrequencyUnit:[{required:!0,message:"请",trigger:"blur"},{min:2,max:66,message:"长度在 2 到 66 个字符",trigger:"blur"}]}}},methods:{whichType:function(e){return"add"===e?"新增":"update"===e?"修改":"view"===e?"查看":void 0},getDept:function(e){this.deptName=e},initializing:function(e,t){var a=this;this.visible=!0,this.$nextTick(function(){if(a.$refs.dataForm.resetFields(),"number"==typeof e)a.$http({url:a.$http.adornUrl("/exhibition_db/table"),method:"get",params:a.$http.adornParams({id:e})}).then(function(r){var i=r.data;i&&i.successful?(a.dataForm=i.data,a.dataForm.type=t,a.dataForm.id=e):(console.log("ERROR",i),a.$message.error("操作失败"))});else{for(var r in a.dataForm)a.dataForm[r]="";a.dataForm.provideWay="库表"}a.dataForm.type=t})},dataFormSubmit:function(){var e=this;this.$refs.dataForm.validate(function(t){if(!t)return!1;e.$http({url:e.$http.adornUrl("/exhibition_db/table"),method:"add"===e.dataForm.type?"post":"put",data:e.$http.adornData({id:e.dataForm.id||void 0,exhibitionDbDeptId:e.dataForm.exhibitionDbDept,dbName:e.dataForm.dbName,dbTable:e.dataForm.dbTable,updateFrequencyValue:e.dataForm.updateFrequencyValue,updateFrequencyUnit:e.dataForm.updateFrequencyUnit,deleteFlag:"1"})}).then(function(t){var a=t.data;a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):(console.log("ERROR",a),e.$message.error("操作失败"))})})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.whichType(e.dataForm.type),"modal-append-to-body":!1,"close-on-click-modal":!1,visible:e.visible,width:"60%"},on:{"update:visible":function(t){e.visible=t}}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,"label-width":"20%",rules:e.rules}},[a("el-form-item",{attrs:{label:"数据库名称",prop:"dbName"}},[a("el-input",{attrs:{disabled:e.isView},model:{value:e.dataForm.dbName,callback:function(t){e.$set(e.dataForm,"dbName",t)},expression:"dataForm.dbName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"部门"}},[a("el-select",{attrs:{"allow-create":"",filterable:"","default-first-option":"",placeholder:"请选择部门",clearable:"",disabled:e.isView},model:{value:e.dataForm.exhibitionDbDept,callback:function(t){e.$set(e.dataForm,"exhibitionDbDept",t)},expression:"dataForm.exhibitionDbDept"}},e._l(e.deptName,function(t){return a("el-option",{key:t.moduleDept,attrs:{label:t.moduleDept,value:t.moduleDeptId}},[e._v("\n          "+e._s(t.moduleDept)+"\n        ")])}))],1),e._v(" "),a("el-form-item",{attrs:{label:"数据库表名称",prop:"dbTable"}},[a("el-input",{attrs:{disabled:e.isView},model:{value:e.dataForm.dbTable,callback:function(t){e.$set(e.dataForm,"dbTable",t)},expression:"dataForm.dbTable"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"更新周期",prop:"updateFrequencyValue"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{disabled:e.isView},model:{value:e.dataForm.updateFrequencyValue,callback:function(t){e.$set(e.dataForm,"updateFrequencyValue",t)},expression:"dataForm.updateFrequencyValue"}},[a("el-select",{staticStyle:{width:"120px"},attrs:{slot:"append",prop:"updateFrequencyUnit",placeholder:"请选择单位",disabled:e.isView},slot:"append",model:{value:e.dataForm.updateFrequencyUnit,callback:function(t){e.$set(e.dataForm,"updateFrequencyUnit",t)},expression:"dataForm.updateFrequencyUnit"}},[a("el-option",{attrs:{label:"年",value:"年"}}),e._v(" "),a("el-option",{attrs:{label:"月",value:"月"}}),e._v(" "),a("el-option",{attrs:{label:"周",value:"周"}}),e._v(" "),a("el-option",{attrs:{label:"天",value:"天",name:"1"}}),e._v(" "),a("el-option",{attrs:{label:"小时",value:"小时",name:"2"}}),e._v(" "),a("el-option",{attrs:{label:"分",value:"分",name:"3"}})],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.isView},on:{click:function(t){e.dataFormSubmit()}}},[e._v("保存")])],1)],1)},staticRenderFns:[]},o=a("46Yf")(i,l,!1,null,null,null);t.default=o.exports}});