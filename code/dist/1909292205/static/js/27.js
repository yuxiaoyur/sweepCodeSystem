webpackJsonp([27],{DAgR:function(t,e,a){var r=a("JRvJ");"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a("FIqI")("a4ad1d16",r,!0,{})},JRvJ:function(t,e,a){(t.exports=a("UTlt")(!1)).push([t.i,"\n.mod-menu .menu-list__input > .el-input__inner,\n.mod-menu .icon-list__input > .el-input__inner {\n  cursor: pointer;\n}\n.mod-menu__icon-popover {\n  max-width: 370px;\n}\n.mod-menu__icon-list {\n  max-height: 180px;\n  padding: 0;\n  margin: -8px 0 0 -8px;\n}\n.mod-menu__icon-list > .el-button {\n    padding: 8px;\n    margin: 8px 0 0 8px;\n}\n.mod-menu__icon-list > .el-button > span {\n      display: inline-block;\n      vertical-align: middle;\n      width: 18px;\n      height: 18px;\n      font-size: 18px;\n}\n.mod-menu .icon-list__tips {\n  font-size: 18px;\n  text-align: center;\n  color: #e6a23c;\n  cursor: pointer;\n}\n",""])},QowZ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("0xDb"),o=(a("Q7M0"),{data:function(){return{visible:!1,dataForm:{id:0,parentType:1,deptName:"",parentId:-1,name:"",deptOrder:0,province:"",city:"",area:"",street:"",region:[],proList:[],cityList:[],areaList:[]},dataRule:{deptName:[{required:!0,message:"部门名称不能为空",trigger:"blur"},{max:10,message:"长度不能超过10个字",trigger:"blur"}],province:[{required:!0,message:"省份不能为空",trigger:"blur"},{max:20,message:"长度有误",trigger:"blur"}],city:[{max:20,message:"长度有误",trigger:"blur\t"}],area:[{max:20,message:"长度有误",trigger:"blur\t"}],street:[{max:25,message:"长度不能超过25个字",trigger:"blur\t"}],deptOrder:[{required:!0,message:"排序号不能为空",trigger:"change"}],parentType:[{required:!0,message:"类型不能为空",trigger:"change"}]},deptList:[],deptListTreeProps:{label:"deptName",children:"children"}}},created:function(){this.getPro()},methods:{init:function(t){var e=this;this.dataForm.id=t||0,this.dataForm.cityList=[],this.dataForm.areaList=[],this.$http({url:this.$http.adornUrl("/dept/list"),method:"get",params:this.$http.adornParams()}).then(function(t){var a=t.data;a.successful?e.deptList=Object(r.c)(a.data,"id","parentId"):(console.log("ERROR",a),e.$message.error("操作失败"))}).then(function(){e.dataForm.parentId=-1,e.dataForm.deptOrder=0,e.visible=!0,e.$nextTick(function(){e.$refs.dataForm.resetFields()})}).then(function(){e.dataForm.id&&e.$http({url:e.$http.adornUrl("/dept/getDeptById"),method:"get",params:e.$http.adornParams({id:e.dataForm.id},!1)}).then(function(t){var a=t.data;a&&a.successful&&(e.dataForm.id=a.data.id,e.dataForm.parentType=parseInt(a.data.parentType),e.dataForm.deptName=a.data.deptName,e.dataForm.parentId=a.data.parentId,e.dataForm.deptOrder=a.data.deptOrder,e.dataForm.province=a.data.province,e.dataForm.city=a.data.city,e.dataForm.area=a.data.area,e.dataForm.street=a.data.street,e.proChange(e.dataForm.province),e.cityChange(e.dataForm.city),e.deptListTreeSetCurrentNode())})})},deptListTreeCurrentChangeHandle:function(t,e){this.dataForm.parentId=t.id,this.dataForm.name=t.deptName},deptListTreeSetCurrentNode:function(){this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId),this.dataForm.name=(this.$refs.deptListTree.getCurrentNode()||{}).deptName},getPro:function(){var t=this;this.$http({url:this.$http.adornUrl("/meta/getMetaByTypeCode"),method:"get",params:this.$http.adornParams({typeCode:"region"},!1)}).then(function(e){var a=e.data;if(a.successful){var r=[];t.dataForm.region=a.data;for(var o=0;o<t.dataForm.region.length;o++)"-1"==t.dataForm.region[o].parentCode&&r.push(t.dataForm.region[o]);t.dataForm.proList=r}else console.log("ERROR",a)})},proChange:function(t){for(var e=[],a="",r=0;r<this.dataForm.region.length;r++)if(t==this.dataForm.region[r].dataCode){a=this.dataForm.region[r].id;break}for(r=0;r<this.dataForm.region.length;r++)a==this.dataForm.region[r].parentCode&&e.push(this.dataForm.region[r]);this.dataForm.cityList=e},cityChange:function(t){for(var e=[],a="",r=0;r<this.dataForm.region.length;r++)if(t==this.dataForm.region[r].dataCode){a=this.dataForm.region[r].id;break}console.log(a);for(r=0;r<this.dataForm.region.length;r++)a==this.dataForm.region[r].parentCode&&e.push(this.dataForm.region[r]);this.dataForm.areaList=e},dataFormSubmit:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&t.$http({url:t.$http.adornUrl("/dept/"+(t.dataForm.id?"update":"save")),method:"post",data:{id:t.dataForm.id||void 0,parentType:t.dataForm.parentType,deptName:t.dataForm.deptName,parentId:t.dataForm.parentId,province:t.dataForm.province,city:t.dataForm.city,area:t.dataForm.area,street:t.dataForm.street,deptOrder:t.dataForm.deptOrder}}).then(function(e){var a=e.data;a&&a.successful?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.visible=!1,t.$emit("refreshDataList")}}):t.$message.error(a.message)})})}}}),n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:t.dataForm.id?"修改":"新增","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-form",{ref:"dataForm",attrs:{model:t.dataForm,rules:t.dataRule,"label-width":"120px"},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.dataFormSubmit()}}},[a("el-form-item",{attrs:{label:"上级部门",prop:"name"}},[a("el-popover",{ref:"menuListPopover",attrs:{placement:"bottom-start",trigger:"click"}},[a("el-tree",{ref:"deptListTree",attrs:{data:t.deptList,props:t.deptListTreeProps,"node-key":"id","default-expand-all":!0,"highlight-current":!0,"expand-on-click-node":!1},on:{"current-change":t.deptListTreeCurrentChangeHandle}})],1),t._v(" "),a("el-input",{directives:[{name:"popover",rawName:"v-popover:menuListPopover",arg:"menuListPopover"}],staticClass:"menu-list__input",attrs:{readonly:!0,placeholder:"点击选择上级部门，默认根目录下添加"},model:{value:t.dataForm.name,callback:function(e){t.$set(t.dataForm,"name",e)},expression:"dataForm.name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"部门名称",prop:"deptName"}},[a("el-input",{attrs:{placeholder:"部门名称，长度不超过10个字"},model:{value:t.dataForm.deptName,callback:function(e){t.$set(t.dataForm,"deptName",e)},expression:"dataForm.deptName"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"省/直辖市",prop:"province"}},[a("el-select",{staticStyle:{width:"50%"},attrs:{placeholder:""},on:{change:t.proChange},model:{value:t.dataForm.province,callback:function(e){t.$set(t.dataForm,"province",e)},expression:"dataForm.province"}},t._l(t.dataForm.proList,function(t){return a("el-option",{attrs:{label:t.dataName,value:t.dataCode}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"市/直辖市区",prop:"city"}},[a("el-select",{staticStyle:{width:"50%"},attrs:{placeholder:""},on:{change:t.cityChange},model:{value:t.dataForm.city,callback:function(e){t.$set(t.dataForm,"city",e)},expression:"dataForm.city"}},t._l(t.dataForm.cityList,function(t){return a("el-option",{attrs:{label:t.dataName,value:t.dataCode}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"区/县",prop:"area"}},[a("el-select",{staticStyle:{width:"50%"},attrs:{placeholder:""},model:{value:t.dataForm.area,callback:function(e){t.$set(t.dataForm,"area",e)},expression:"dataForm.area"}},t._l(t.dataForm.areaList,function(t){return a("el-option",{attrs:{label:t.dataName,value:t.dataCode}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"详细地址",prop:"street"}},[a("el-input",{attrs:{placeholder:"街道"},model:{value:t.dataForm.street,callback:function(e){t.$set(t.dataForm,"street",e)},expression:"dataForm.street"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"排序号",prop:"deptOrder"}},[a("el-input-number",{attrs:{"controls-position":"right",min:0,label:"排序号"},model:{value:t.dataForm.deptOrder,callback:function(e){t.$set(t.dataForm,"deptOrder",e)},expression:"dataForm.deptOrder"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"类型",size:"mini",prop:"parentType"}},[a("el-radio-group",{model:{value:t.dataForm.parentType,callback:function(e){t.$set(t.dataForm,"parentType",e)},expression:"dataForm.parentType"}},[a("el-radio",{attrs:{label:1}},[t._v("地区监管部门")]),t._v(" "),a("el-radio",{attrs:{label:2}},[t._v("行业监管部门")])],1)],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.visible=!1}}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dataFormSubmit()}}},[t._v("确定")])],1)],1)},staticRenderFns:[]};var i=a("46Yf")(o,n,!1,function(t){a("DAgR")},null,null);e.default=i.exports}});