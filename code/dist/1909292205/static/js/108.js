webpackJsonp([108],{X7WV:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("Pg0u"),r={name:"dataSourcePie",data:function(){return{}},mounted:function(){this.$nextTick(function(){var e=n.init(document.getElementById("data_source_con"));e.setOption({tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"right",data:["ios","android","pc","web","others"]},series:[{name:"访问来源",type:"pie",radius:"66%",center:["50%","60%"],data:[{value:2103456,name:"ios",itemStyle:{normal:{color:"#9bd598"}}},{value:1305923,name:"android",itemStyle:{normal:{color:"#ffd58f"}}},{value:543250,name:"pc",itemStyle:{normal:{color:"#abd5f2"}}},{value:798403,name:"web",itemStyle:{normal:{color:"#ab8df2"}}},{value:302340,name:"others",itemStyle:{normal:{color:"#e14f60"}}}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}),window.addEventListener("resize",function(){e.resize()})})}},o={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"data_source_con"}})},staticRenderFns:[]},i=a("46Yf")(r,o,!1,null,null,null);t.default=i.exports}});