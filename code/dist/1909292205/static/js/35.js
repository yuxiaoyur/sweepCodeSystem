webpackJsonp([35],{"9blp":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o={name:"inforCard",components:{countUp:e("jPzZ").default},props:{idName:String,endVal:Number,color:String,iconType:String,introText:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},iconSize:{type:Number,default:40}}},i={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("Card",{attrs:{padding:0}},[e("div",{staticClass:"infor-card-con"},[e("Col",{staticClass:"infor-card-icon-con",style:{backgroundColor:t.color,color:"white"},attrs:{span:"8"}},[e("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[e("Icon",{attrs:{type:t.iconType,size:t.iconSize}})],1)],1),t._v(" "),e("Col",{staticClass:"height-100",attrs:{span:"16"}},[e("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[e("count-up",{staticClass:"infor-card-count user-created-count",attrs:{"id-name":t.idName,"end-val":t.endVal,color:t.color,countSize:t.countSize,countWeight:t.countWeight}},[e("p",{staticClass:"infor-intro-text",attrs:{slot:"intro"},slot:"intro"},[t._v(t._s(t.introText))])])],1)],1)],1)])},staticRenderFns:[]};var r=e("46Yf")(o,i,!1,function(t){e("XT2p")},null,null);n.default=r.exports},U6r1:function(t,n,e){(t.exports=e("UTlt")(!1)).push([t.i,"\n.infor-card-icon-con {\n  height: 100%;\n}\n.height-100 {\n  height: 100%;\n}\n.infor-card-con {\n  height: 100px;\n}\n.infor-intro-text {\n  font-size: 12px;\n  font-weight: 500;\n  color: #C8C8C8;\n}\n",""])},XT2p:function(t,n,e){var o=e("U6r1");"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);e("FIqI")("957bd9cc",o,!0,{})}});