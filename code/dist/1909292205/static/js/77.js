webpackJsonp([77],{"9k0C":function(a,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t("E4LH"),l={data:function(){return{visible:!1,dataForm:{id:"",linkurl:"",linkcode:"",yipage:"",eipage:"",sipage:"",sysname:"",managername:"",width:"",height:"",paramtype:"0",linkstatus:"0",isvalidate:"0",waytype:"",type:"",codereadonly:!1,waytypeRadio:!1},dataRule:{linkcode:[{required:!0,message:"标识码不能为空",trigger:"blur"}],linkurl:[{required:!0,message:"链接地址不能为空",trigger:"blur"},{validator:function(a,e,t){Object(r.f)(e)?t():t(new Error("必须以http,https开头,且需符合URL规范,检查格式是否正确"))},trigger:"blur"}],yjpage:[{required:!0,message:"页面名称不能为空",trigger:"blur"}]}}},created:function(){},methods:{init:function(a,e){var t=this;this.visible=!0,this.$nextTick(function(){t.$refs.dataForm.resetFields(),a.length>0&&t.$http({url:t.$http.adornUrl("/link/findidtolink"),method:"get",params:t.$http.adornParams({id:a})}).then(function(a){var e=a.data;e&&e.successful?t.dataForm=e.data:(console.log("ERROR",e),t.$message.error("操作失败")),t.codereadonly=!0,t.isvalidateChange(e.data.isvalidate)}),t.dataForm.type=e,t.codereadonly=!1,t.isvalidateChange(t.dataForm.isvalidate)})},isvalidateChange:function(a){"0"==a?(this.dataForm.waytype="",this.waytypeRadio=!0):(this.dataForm.waytype="0",this.waytypeRadio=!1)},validateSame:function(){var a=this;"add"===this.dataForm.type?this.$http({url:this.$http.adornUrl("/link/isSamecCode"),method:"get",params:this.$http.adornParams({linkcode:this.dataForm.linkcode})}).then(function(e){e.data.successful?a.messageHint(a.dataForm.linkcode):a.dataFormSubmit()}):this.dataFormSubmit()},messageHint:function(a){this.$message({dangerouslyUseHTMLString:!0,message:'<strong style="color: #ff2222">标识码'+a+"已存在!</strong>"})},dataFormSubmit:function(){var a=this;this.$refs.dataForm.validate(function(e){e&&a.$http({url:a.$http.adornUrl("/link/"+("add"===a.dataForm.type?"addLink":"updateLink")),method:"post",data:a.$http.adornData({id:a.dataForm.id||void 0,linkurl:a.dataForm.linkurl,linkcode:a.dataForm.linkcode,yjpage:a.dataForm.yjpage,ejpage:a.dataForm.ejpage,sjpage:a.dataForm.sjpage,sysname:a.dataForm.sysname,managername:a.dataForm.managername,width:a.dataForm.width,height:a.dataForm.height,paramtype:a.dataForm.paramtype,linkstatus:a.dataForm.linkstatus,isvalidate:a.dataForm.isvalidate,waytype:a.dataForm.waytype})}).then(function(e){var t=e.data;t.successful?a.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){a.visible=!1,a.$emit("refreshDataList")}}):(console.log("ERROR",t),a.$message.error("操作失败"))})})}}},o={render:function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("el-dialog",{attrs:{title:"add"==a.dataForm.type?"新增":"修改","modal-append-to-body":!1,"close-on-click-modal":!1,visible:a.visible,width:"50%"},on:{"update:visible":function(e){a.visible=e}}},[t("el-form",{ref:"dataForm",attrs:{model:a.dataForm,rules:a.dataRule,"label-width":"15%"},nativeOn:{keyup:function(e){if(!("button"in e)&&a._k(e.keyCode,"enter",13,e.key))return null;a.validateSame()}}},[t("el-form-item",{attrs:{label:"链接地址",prop:"linkurl"}},[t("el-input",{attrs:{placeholder:"请输入链接地址..."},model:{value:a.dataForm.linkurl,callback:function(e){a.$set(a.dataForm,"linkurl",e)},expression:"dataForm.linkurl"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"标识码",prop:"linkcode"}},[t("el-input",{attrs:{disabled:a.codereadonly,placeholder:"链接标识码"},model:{value:a.dataForm.linkcode,callback:function(e){a.$set(a.dataForm,"linkcode",e)},expression:"dataForm.linkcode"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"一级页面",prop:"yjpage"}},[t("el-input",{attrs:{placeholder:"一级页面名称"},model:{value:a.dataForm.yjpage,callback:function(e){a.$set(a.dataForm,"yjpage",e)},expression:"dataForm.yjpage"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"二级页面",prop:"ejpage"}},[t("el-input",{attrs:{placeholder:"二级页面名称"},model:{value:a.dataForm.ejpage,callback:function(e){a.$set(a.dataForm,"ejpage",e)},expression:"dataForm.ejpage"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"三级页面",prop:"sjpage"}},[t("el-input",{attrs:{placeholder:"三级页面名称"},model:{value:a.dataForm.sjpage,callback:function(e){a.$set(a.dataForm,"sjpage",e)},expression:"dataForm.sjpage"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"所属系统",prop:"sysname"}},[t("el-input",{attrs:{placeholder:"系统名称"},model:{value:a.dataForm.sysname,callback:function(e){a.$set(a.dataForm,"sysname",e)},expression:"dataForm.sysname"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"所属部门",prop:"managername"}},[t("el-input",{attrs:{placeholder:"部门名称"},model:{value:a.dataForm.managername,callback:function(e){a.$set(a.dataForm,"managername",e)},expression:"dataForm.managername"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"窗口宽",prop:"width"}},[t("el-input",{attrs:{placeholder:"px"},model:{value:a.dataForm.width,callback:function(e){a.$set(a.dataForm,"width",e)},expression:"dataForm.width"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"窗口高",prop:"height"}},[t("el-input",{attrs:{placeholder:"px"},model:{value:a.dataForm.height,callback:function(e){a.$set(a.dataForm,"height",e)},expression:"dataForm.height"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"参数动静态类型",size:"mini",prop:"status"}},[t("el-radio-group",{model:{value:a.dataForm.paramtype,callback:function(e){a.$set(a.dataForm,"paramtype",e)},expression:"dataForm.paramtype"}},[t("el-radio",{attrs:{label:"0"}},[a._v("静态值")]),a._v(" "),t("el-radio",{attrs:{label:"1"}},[a._v("动态值")])],1)],1),a._v(" "),t("el-form-item",{attrs:{label:"是否验证",size:"mini",prop:"status"}},[t("el-radio-group",{on:{change:function(e){a.isvalidateChange(a.dataForm.isvalidate)}},model:{value:a.dataForm.isvalidate,callback:function(e){a.$set(a.dataForm,"isvalidate",e)},expression:"dataForm.isvalidate"}},[t("el-radio",{attrs:{label:"0"}},[a._v("否")]),a._v(" "),t("el-radio",{attrs:{label:"1"}},[a._v("是")])],1)],1),a._v(" "),t("el-form-item",{attrs:{label:"拼接方式",size:"mini",prop:"status"}},[t("el-radio-group",{attrs:{disabled:a.waytypeRadio},model:{value:a.dataForm.waytype,callback:function(e){a.$set(a.dataForm,"waytype",e)},expression:"dataForm.waytype"}},[t("el-radio",{attrs:{label:"0"}},[a._v("url拼接")]),a._v(" "),t("el-radio",{attrs:{label:"1"}},[a._v("header隐藏")])],1)],1),a._v(" "),t("el-form-item",{attrs:{label:"链接状态",size:"mini",prop:"status"}},[t("el-radio-group",{model:{value:a.dataForm.linkstatus,callback:function(e){a.$set(a.dataForm,"linkstatus",e)},expression:"dataForm.linkstatus"}},[t("el-radio",{attrs:{label:"0"}},[a._v("正常")]),a._v(" "),t("el-radio",{attrs:{label:"1"}},[a._v("异常")])],1)],1)],1),a._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(e){a.visible=!1}}},[a._v("取消")]),a._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.validateSame()}}},[a._v("保存")])],1)],1)},staticRenderFns:[]},i=t("46Yf")(l,o,!1,null,null,null);e.default=i.exports}});