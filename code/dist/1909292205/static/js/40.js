webpackJsonp([40,58],{bTvp:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("E4LH");var r={data:function(){return{visible:!1,dataForm:{id:0,sj:"",xtmc:"",ly:"",code:"",bfb:"",panel:"",width:"",height:"",zt:1,lylx:1,isvalidate:1,issubsystem:1,szwl:"",url:""},dataRule:{xtmc:[{required:!0,message:"系统名称不能为空",trigger:"blur"}],ly:[{required:!0,message:"部门名称不能为空",trigger:"blur"},{max:10,message:"长度不超过10个字",trigger:"blur"}],code:[{required:!0,message:"系统代码不能为空",trigger:"blur"}],width:[{required:!0,message:"展示宽度不能为空",trigger:"blur"},{type:"string",pattern:/^(([1-9]\d{0,3})|0)(\d{0,2})?$/,message:"展示高度，输入为数字类型，且数字长度≤6",trigger:"blur"}],height:[{required:!0,message:"展示高度不能为空",trigger:"blur"},{type:"string",pattern:/^(([1-9]\d{0,3})|0)(\d{0,2})?$/,message:"展示高度，输入为数字类型，且数字长度≤6",trigger:"blur"}]}}},methods:{init:function(t){var e=this;this.visible=!0,this.$nextTick(function(){e.$refs.dataForm.resetFields(),e.dataForm.id=t,e.dataForm.id&&e.$http({url:e.$http.adornUrl("/stjr/xtjrgljk/detail?id="+e.dataForm.id),method:"get"}).then(function(t){var a=t.data;a&&a.successful?(e.dataForm.sj=a.data.sj,e.dataForm.xtmc=a.data.xtmc,e.dataForm.ly=a.data.ly,e.dataForm.code=a.data.code,e.dataForm.bfb=a.data.bfb,e.dataForm.panel=a.data.panel,e.dataForm.width=String(a.data.width),e.dataForm.height=String(a.data.height),e.dataForm.zt=a.data.zt,e.dataForm.lylx=a.data.lylx,e.dataForm.isvalidate=a.data.isvalidate,e.dataForm.issubsystem=a.data.issubsystem,e.dataForm.szwl=a.data.szwl,e.dataForm.url=a.data.url):(console.log("ERROR",a),e.$message.error("操作失败"))})})},dataFormSubmit:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&t.$http({url:t.$http.adornUrl("/stjr/xtjrgljk/"+(t.dataForm.id?"update":"save")),method:"post",params:t.$http.adornParams({id:t.dataForm.id||void 0,sj:t.dataForm.sj,xtmc:t.dataForm.xtmc,ly:t.dataForm.ly,code:t.dataForm.code,bfb:t.dataForm.bfb,panel:t.dataForm.panel,width:t.dataForm.width,height:t.dataForm.height,zt:t.dataForm.zt,lylx:t.dataForm.lylx,isvalidate:t.dataForm.isvalidate,issubsystem:t.dataForm.issubsystem,szwl:t.dataForm.szwl,url:t.dataForm.url})}).then(function(e){var a=e.data;a&&a.successful?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.visible=!1,t.$emit("refreshDataList")}}):t.$message.error(a.message)})})}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:t.dataForm.id?"修改":"新增","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-form",{ref:"dataForm",attrs:{model:t.dataForm,rules:t.dataRule,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"系统名称",prop:"xtmc"}},[a("el-input",{attrs:{placeholder:"系统名称"},model:{value:t.dataForm.xtmc,callback:function(e){t.$set(t.dataForm,"xtmc",e)},expression:"dataForm.xtmc"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"来源",prop:"ly"}},[a("el-input",{attrs:{placeholder:"部门名称，长度不超过10个字"},model:{value:t.dataForm.ly,callback:function(e){t.$set(t.dataForm,"ly",e)},expression:"dataForm.ly"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"系统代码",prop:"code"}},[a("el-input",{model:{value:t.dataForm.code,callback:function(e){t.$set(t.dataForm,"code",e)},expression:"dataForm.code"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"百分比",prop:"bfb"}},[a("el-input",{model:{value:t.dataForm.bfb,callback:function(e){t.$set(t.dataForm,"bfb",e)},expression:"dataForm.bfb"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"主题",prop:"panel"}},[a("el-input",{model:{value:t.dataForm.panel,callback:function(e){t.$set(t.dataForm,"panel",e)},expression:"dataForm.panel"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"展示宽度",prop:"width"}},[a("el-input",{attrs:{placeholder:"展示宽度，输入为数字类型"},model:{value:t.dataForm.width,callback:function(e){t.$set(t.dataForm,"width",e)},expression:"dataForm.width"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"展示高度",prop:"height"}},[a("el-input",{attrs:{placeholder:"展示高度，输入为数字类型"},model:{value:t.dataForm.height,callback:function(e){t.$set(t.dataForm,"height",e)},expression:"dataForm.height"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"访问地址",prop:"url"}},[a("el-input",{model:{value:t.dataForm.url,callback:function(e){t.$set(t.dataForm,"url",e)},expression:"dataForm.url"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"状态",size:"mini",prop:"zt"}},[a("el-radio-group",{model:{value:t.dataForm.zt,callback:function(e){t.$set(t.dataForm,"zt",e)},expression:"dataForm.zt"}},[a("el-radio",{attrs:{label:0}},[t._v("正常")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("异常")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"来源类型",size:"mini",prop:"lylx"}},[a("el-radio-group",{model:{value:t.dataForm.lylx,callback:function(e){t.$set(t.dataForm,"lylx",e)},expression:"dataForm.lylx"}},[a("el-radio",{attrs:{label:0}},[t._v("部门系统")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("区县系统")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"是否验证",size:"mini",prop:"isvalidate"}},[a("el-radio-group",{model:{value:t.dataForm.isvalidate,callback:function(e){t.$set(t.dataForm,"isvalidate",e)},expression:"dataForm.isvalidate"}},[a("el-radio",{attrs:{label:0}},[t._v("否")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("是")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"子系统",size:"mini",prop:"issubsystem"}},[a("el-radio-group",{model:{value:t.dataForm.issubsystem,callback:function(e){t.$set(t.dataForm,"issubsystem",e)},expression:"dataForm.issubsystem"}},[a("el-radio",{attrs:{label:0}},[t._v("是子系统")]),t._v(" "),a("el-radio",{attrs:{label:1}},[t._v("否子系统")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"描述",prop:"szwl"}},[a("el-input",{attrs:{placeholder:"请描述系统所在网络情况"},model:{value:t.dataForm.szwl,callback:function(e){t.$set(t.dataForm,"szwl",e)},expression:"dataForm.szwl"}})],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.visible=!1}}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dataFormSubmit()}}},[t._v("确定")])],1)],1)},staticRenderFns:[]},i=a("46Yf")(r,l,!1,null,null,null);e.default=i.exports},lJZo:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={data:function(){return{dataForm:{gjc:"",date:""},dataList:[],pageIndex:1,pageSize:10,totalPage:0,dataListLoading:!1,dataListSelections:[],permission:[],permissionVisible:{add:!1,update:!1,delete:!1},addOrUpdateVisible:!1}},components:{AddOrUpdate:a("bTvp").default},activated:function(){this.getDataList()},mounted:function(){this.getPermission()},methods:{getPermission:function(){var t=this;this.$http({url:this.$http.adornUrl("/sys/menuPermission"),method:"get",params:this.$http.adornParams({menuId:this.$route.meta.menuId})}).then(function(e){var a=e.data;t.permission=a;for(var r=0;r<a.length;r++)switch(a[r].split(":")[1]){case"add":t.permissionVisible.add=!0;break;case"update":t.permissionVisible.update=!0;break;case"delete":t.permissionVisible.delete=!0}})},hasPermission:function(t){switch(t){case"add":return this.permissionVisible.add;case"update":return this.permissionVisible.update;case"delete":return this.permissionVisible.delete;default:return!1}},getDataList:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/stjr/xtjrgljk"),method:"get",params:this.$http.adornParams({page:this.pageIndex,limit:this.pageSize,gjc:this.dataForm.gjc,date:this.dataForm.date})}).then(function(e){var a=e.data;a&&a.successful?(t.dataList=a.data.list,t.totalPage=a.data.total,t.dataListLoading=!1):(console.log("ERROR",a),t.$message.error("操作失败"))})},sizeChangeHandle:function(t){this.pageSize=t,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(t){this.pageIndex=t,this.getDataList()},selectionChangeHandle:function(t){this.dataListSelections=t},addOrUpdateHandle:function(t){var e=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){e.$refs.addOrUpdate.init(t)})},deleteHandle:function(t){var e=this,a=t?[t]:this.dataListSelections.map(function(t){return t.id});null!=a&&""!=a?this.$confirm("确定进行["+(t?"删除":"批量删除")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http({url:e.$http.adornUrl("/stjr/xtjrgljk/remove"),method:"post",params:e.$http.adornParams({id:a.join(",")},!1)}).then(function(t){var a=t.data;a&&a.successful?e.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){e.getDataList()}}):e.$message.error(a.message)})}).catch(function(){}):this.$message.error("请选择要删除的数据")}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mod-stjrgl-rcjl"},[a("el-form",{attrs:{inline:!0,model:t.dataForm},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.getDataList()}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"系统名称",clearable:""},model:{value:t.dataForm.gjc,callback:function(e){t.$set(t.dataForm,"gjc",e)},expression:"dataForm.gjc"}})],1),t._v(" "),a("el-form-item",[a("el-input",{attrs:{placeholder:"时间(yyyy-MM-dd)",clearable:""},model:{value:t.dataForm.date,callback:function(e){t.$set(t.dataForm,"date",e)},expression:"dataForm.date"}})],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.getDataList()}}},[t._v("查询")]),t._v(" "),t.hasPermission("add")?a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addOrUpdateHandle()}}},[t._v("新增")]):t._e(),t._v(" "),t.hasPermission("delete")?a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.deleteHandle()}}},[t._v("批量删除")]):t._e()],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataList,border:""},on:{"selection-change":t.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:"center",width:"50"}}),t._v(" "),a("el-table-column",{attrs:{prop:"sj","header-align":"center",align:"center",width:"160",label:"统计时间"}}),t._v(" "),a("el-table-column",{attrs:{prop:"xtmc","header-align":"center",align:"center",width:"80",label:"系统名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"ly","header-align":"center",align:"center",width:"80",label:"来源"}}),t._v(" "),a("el-table-column",{attrs:{prop:"zt","header-align":"center",align:"center",width:"80",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[1==e.row.zt?a("el-tag",{attrs:{size:"small",type:"danger"}},[t._v("异常")]):a("el-tag",{attrs:{size:"small"}},[t._v("正常")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"code","header-align":"center",align:"center",width:"120",label:"系统代码"}}),t._v(" "),a("el-table-column",{attrs:{prop:"panel","header-align":"center",align:"center",width:"80",label:"主题"}}),t._v(" "),a("el-table-column",{attrs:{prop:"width","header-align":"center",align:"center",width:"80",label:"展示宽度"}}),t._v(" "),a("el-table-column",{attrs:{prop:"height","header-align":"center",align:"center",width:"80",label:"展示高度"}}),t._v(" "),a("el-table-column",{attrs:{prop:"url","header-align":"center",align:"center",label:"访问地址"}}),t._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",width:"100",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.hasPermission("update")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.addOrUpdateHandle(e.row.id)}}},[t._v("修改")]):t._e(),t._v(" "),t.hasPermission("delete")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.deleteHandle(e.row.id)}}},[t._v("删除")]):t._e()]}}])})],1),t._v(" "),a("el-pagination",{attrs:{"current-page":t.pageIndex,"page-sizes":[10,20,50,100],"page-size":t.pageSize,total:t.totalPage,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":t.sizeChangeHandle,"current-change":t.currentChangeHandle}}),t._v(" "),t.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:t.getDataList}}):t._e()],1)},staticRenderFns:[]},i=a("46Yf")(r,l,!1,null,null,null);e.default=i.exports}});