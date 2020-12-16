webpackJsonp([99],{P3yk:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=e("E4LH"),s={data:function(){var a=function(a,t,e){Object(l.e)(t)?e(new Error("请不要输入英文逗号")):e()};return{visible:!1,dataForm:{id:0,slsj:"",sqzt:"",sqms:"",zbdw:"",blqk:"",area:"",address:"",path:"",bllc:[{lcmc:"",lcsj:"",lcms:""}]},dataRule:{slsj:[{required:!0,message:"受理时间不能为空",trigger:"blur"},{validator:function(a,t,e){Object(l.a)(t)?e():e(new Error("时间格式错误"))},trigger:"blur"}]},bllcRules:{lcmc:[{required:!0,message:"流程名称不能为空",trigger:"blur"},{max:8,message:"长度不能超过8个字",trigger:"blur"},{validator:a,trigger:"blur"}],lcsj:[{validator:a,trigger:"blur"}],lcms:[{validator:a,trigger:"blur"}]},fileUrl:this.$http.adornUrl("/mssq/jjcl/upload")}},methods:{init:function(a){var t=this;this.visible=!0,this.$nextTick(function(){t.dataForm.bllc=[{lcmc:"",lcsj:"",lcms:""}],t.$refs.dataForm.resetFields(),t.$refs.audio.src="",t.dataForm.id=a,t.dataForm.id&&t.$http({url:t.$http.adornUrl("/mssq/jjcl/detail?id="+t.dataForm.id),method:"get"}).then(function(a){var e=a.data;e&&e.successful?(t.dataForm.slsj=e.data.slsj,t.dataForm.sqzt=e.data.sqzt,t.dataForm.sqms=e.data.sqms,t.dataForm.zbdw=e.data.zbdw,t.dataForm.blqk=e.data.blqk,t.dataForm.area=e.data.area,t.dataForm.address=e.data.address,t.dataForm.path=e.data.path,t.$refs.audio.src=e.data.play,t.dataForm.bllc=e.data.bllc):(console.log("ERROR",e),t.$message.error("操作失败"))})})},dataFormSubmit:function(){for(var a=this,t=new Array,e=new Array,l=new Array,s=this.dataForm.bllc,r=0;r<s.length;r++)t.push(s[r].lcmc.length>0?s[r].lcmc:"--"),e.push(s[r].lcsj.length>0?s[r].lcsj:"--"),l.push(s[r].lcms.length>0?s[r].lcms:"--");this.$refs.dataForm.validate(function(s){s&&a.$http({url:a.$http.adornUrl("/mssq/jjcl/"+(a.dataForm.id?"update":"save")),method:"post",params:a.$http.adornParams({id:a.dataForm.id||void 0,slsj:a.dataForm.slsj,sqzt:a.dataForm.sqzt,sqms:a.dataForm.sqms,zbdw:a.dataForm.zbdw,blqk:a.dataForm.blqk,area:a.dataForm.area,address:a.dataForm.address,path:a.dataForm.path})}).then(function(s){var r=s.data;r&&r.successful?a.$http({url:a.$http.adornUrl("/mssq/jjcl/bllc"),method:"post",params:a.$http.adornParams({id:r.data,lcmc:t.toString(),lcsj:e.toString(),lcms:l.toString()})}).then(function(t){var e=t.data;e&&e.successful?a.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){a.visible=!1,a.$emit("refreshDataList")}}):a.$message.error(e.message)}):a.$message.error(r.message)})})},submitUpload:function(){this.$refs.upload.submit()},beforeAvatarUpload:function(a){var t=a.name.split(".");return"wav"===t[1].toLowerCase()||"mp3"===t[1].toLowerCase()?a.size/1024/1024>20?(this.$message.error("上传文件大小不能超过20M!"),!1):a:(this.$message.error("上传文件只能是 wav/mp3 格式!"),!1)},handleRemove:function(a){},handlePreview:function(a){},handleSuccess:function(a,t){a.flag?(this.dataForm.path=a.path,this.$refs.upload.clearFiles(),this.$refs.audio.src=a.play,this.$message({message:"上传成功！",type:"success"})):this.$message({message:"上传失败！",type:"error"})},closeDialog:function(){this.$refs.audio.src="",this.dataForm.bllc=[{lcmc:"",lcsj:"",lcms:""}],this.$refs.upload.clearFiles()},addLc:function(){this.dataForm.bllc.push({lcmc:"",lcsj:"",lcms:""})},deleteLc:function(a,t){this.index=this.dataForm.bllc.indexOf(a),-1!==t&&this.dataForm.bllc.splice(t,1)}}},r={render:function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("el-dialog",{attrs:{title:a.dataForm.id?"修改":"新增","close-on-click-modal":!1,visible:a.visible},on:{"update:visible":function(t){a.visible=t},close:a.closeDialog}},[e("el-form",{ref:"dataForm",attrs:{model:a.dataForm,rules:a.dataRule,"label-width":"80px"}},[e("el-form-item",{attrs:{label:"受理时间",prop:"slsj"}},[e("el-input",{attrs:{placeholder:"格式（yyyy-MM-dd HH:mm:ss）"},model:{value:a.dataForm.slsj,callback:function(t){a.$set(a.dataForm,"slsj",t)},expression:"dataForm.slsj"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"诉求主题",prop:"sqzt"}},[e("el-input",{model:{value:a.dataForm.sqzt,callback:function(t){a.$set(a.dataForm,"sqzt",t)},expression:"dataForm.sqzt"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"诉求描述",prop:"sqms"}},[e("el-input",{attrs:{type:"textarea",rows:4},model:{value:a.dataForm.sqms,callback:function(t){a.$set(a.dataForm,"sqms",t)},expression:"dataForm.sqms"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"转办单位",prop:"zbdw"}},[e("el-input",{model:{value:a.dataForm.zbdw,callback:function(t){a.$set(a.dataForm,"zbdw",t)},expression:"dataForm.zbdw"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"办理情况",prop:"blqk"}},[e("el-input",{attrs:{type:"textarea",rows:4},model:{value:a.dataForm.blqk,callback:function(t){a.$set(a.dataForm,"blqk",t)},expression:"dataForm.blqk"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"办理流程",prop:"bllc"}},a._l(a.dataForm.bllc,function(t,l){return e("div",[e("el-row",[e("el-col",{attrs:{span:6}},[e("el-form-item",{attrs:{prop:"bllc."+l+".lcmc",rules:a.bllcRules.lcmc}},[e("el-input",{staticStyle:{width:"150px"},attrs:{size:"small",placeholder:"流程名称"},model:{value:t.lcmc,callback:function(e){a.$set(t,"lcmc",e)},expression:"item.lcmc"}})],1)],1),a._v(" "),e("el-col",{attrs:{span:6}},[e("el-form-item",{attrs:{prop:"bllc."+l+".lcsj",rules:a.bllcRules.lcsj}},[e("el-input",{staticStyle:{width:"150px"},attrs:{size:"small",placeholder:"流程时间"},model:{value:t.lcsj,callback:function(e){a.$set(t,"lcsj",e)},expression:"item.lcsj"}})],1)],1),a._v(" "),e("el-col",{attrs:{span:11}},[e("el-form-item",{attrs:{prop:"bllc."+l+".lcms",rules:a.bllcRules.lcms}},[e("el-input",{staticStyle:{width:"280px"},attrs:{size:"small",placeholder:"流程描述"},model:{value:t.lcms,callback:function(e){a.$set(t,"lcms",e)},expression:"item.lcms"}})],1)],1),a._v(" "),e("el-col",{attrs:{span:1}},[e("el-form-item",[l>0?e("i",{staticClass:"el-icon-remove-outline",on:{click:function(e){a.deleteLc(t,l)}}}):a._e(),a._v(" "),0==l?e("i",{staticClass:"el-icon-circle-plus-outline",on:{click:a.addLc}}):a._e()])],1)],1)],1)})),a._v(" "),e("el-form-item",{attrs:{label:"区域",prop:"area"}},[e("el-input",{model:{value:a.dataForm.area,callback:function(t){a.$set(a.dataForm,"area",t)},expression:"dataForm.area"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"地址",prop:"address"}},[e("el-input",{model:{value:a.dataForm.address,callback:function(t){a.$set(a.dataForm,"address",t)},expression:"dataForm.address"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"文件名称",prop:"path"}},[e("el-input",{attrs:{readonly:"readonly"},model:{value:a.dataForm.path,callback:function(t){a.$set(a.dataForm,"path",t)},expression:"dataForm.path"}})],1),a._v(" "),e("el-form-item",{attrs:{label:"录音播放",prop:"path"}},[e("audio",{ref:"audio",attrs:{controls:""}})]),a._v(" "),e("el-form-item",[e("el-upload",{ref:"upload",staticClass:"upload-audio",attrs:{action:a.fileUrl,limit:1,"before-upload":a.beforeAvatarUpload,"auto-upload":!1,"on-success":a.handleSuccess,name:"uploadAudio"}},[e("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[a._v("选取文件")]),a._v(" "),e("el-button",{staticStyle:{"margin-left":"10px"},attrs:{size:"small",type:"success"},on:{click:a.submitUpload}},[a._v("上传到服务器")])],1)],1)],1),a._v(" "),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(t){a.visible=!1}}},[a._v("取消")]),a._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:function(t){a.dataFormSubmit()}}},[a._v("确定")])],1)],1)},staticRenderFns:[]},o=e("46Yf")(s,r,!1,null,null,null);t.default=o.exports}});