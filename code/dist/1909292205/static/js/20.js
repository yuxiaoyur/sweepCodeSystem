webpackJsonp([20,101,102,103],{TdIe:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={data:function(){return{updatePassowrdVisible:!1,showFullScreenBtn:window.navigator.userAgent.indexOf("MSIE")<0,messageCount:0,lockScreenSize:0}},components:{UpdatePassword:n("cdA+").default},computed:{navbarLayoutType:{get:function(){return this.$store.state.common.navbarLayoutType}},sidebarFold:{get:function(){return this.$store.state.common.sidebarFold},set:function(t){this.$store.commit("common/updateSidebarFold",t)}},mainTabs:{get:function(){return this.$store.state.common.mainTabs},set:function(t){this.$store.commit("common/updateMainTabs",t)}},userName:{get:function(){return this.$store.state.user.name}},avatorPath:function(){return this.$store.state.user.avator}},methods:{init:function(){this.messageCount=3..toString()},showMessage:function(){this.$router.push({name:"message"})},lockScreen:function(){var t=this;this.$http({url:this.$http.adornUrl("/lock"),method:"get",params:this.$http.adornParams()}).then(function(e){if("lock"==e.data){var n=document.getElementById("lock_screen_back");n.style.transition="all 3s",n.style.zIndex=1900,n.style.boxShadow="0 0 0 "+t.lockScreenSize+"px #667aa6 inset",t.showUnlock=!0,sessionStorage.setItem("lock","lock"),t.$cookie.set("last_page_name",t.$route.name),setTimeout(function(){n.style.transition="all 0s",t.$router.push({name:"locking"})},800)}else t.$message.error("锁屏失败")})},handleClickUserDropdown:function(t){var e=this;"ownSpace"===t?this.$router.push({name:"theme"}):"changePwd"===t?(this.updatePassowrdVisible=!0,this.$nextTick(function(){e.$refs.updatePassowrd.init()})):"loginout"===t&&this.logoutHandle()},logoutHandle:function(){var t=this;this.$confirm("确定进行[退出]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http({url:t.$http.adornUrl("/logout"),method:"get",params:t.$http.adornParams()}).then(function(e){var n=e.data;n&&"logout"==n&&(t.$cookie.delete("token"),t.$router.options.isAddDynamicMenuRoutes=!1,t.$router.push({name:"login"}))})}).catch(function(){})}},watch:{},mounted:function(){var t=this;this.init();var e=document.getElementById("lock_screen_back"),n=document.body.clientWidth,a=document.body.clientHeight,s=Math.sqrt(n*n+a*a),i=parseInt(s);this.lockScreenSize=i,window.addEventListener("resize",function(){var n=document.body.clientWidth,a=document.body.clientHeight,s=Math.sqrt(n*n+a*a),i=parseInt(s);t.lockScreenSize=i,e.style.transition="all 0s",e.style.width=e.style.height=i+"px"}),e.style.width=e.style.height=i+"px"}},s={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",{staticClass:"site-navbar",class:"site-navbar--"+t.navbarLayoutType},[n("div",{staticClass:"site-navbar__header"},[n("h1",{staticClass:"site-navbar__brand",on:{click:function(e){t.$router.push({name:"home"})}}},[n("a",{staticClass:"site-navbar__brand-lg",attrs:{href:"javascript:;"}},[t._v("成都智慧治理")]),t._v(" "),n("a",{staticClass:"site-navbar__brand-mini",attrs:{href:"javascript:;"}},[t._v("智慧")])])]),t._v(" "),n("div",{staticClass:"site-navbar__body clearfix"},[n("el-menu",{staticClass:"site-navbar__menu",attrs:{mode:"horizontal"}},[n("el-menu-item",{staticClass:"site-navbar__switch",attrs:{index:"0"},on:{click:function(e){t.sidebarFold=!t.sidebarFold}}},[n("icon-svg",{attrs:{name:"zhedie"}})],1)],1),t._v(" "),n("div",{staticClass:"header-avator-con"},[n("div",{staticClass:"message-con",on:{click:t.showMessage}},[n("Tooltip",{attrs:{content:t.messageCount>0?"有"+t.messageCount+"条未读消息":"无未读消息",placement:"bottom"}},[n("Badge",{attrs:{count:t.messageCount,dot:""}},[n("Icon",{attrs:{type:"ios-bell",size:22}})],1)],1)],1),t._v(" "),n("div",{staticClass:"user-dropdown-menu-con"},[n("Row",{staticClass:"user-dropdown-innercon",attrs:{type:"flex",justify:"end",align:"middle"}},[n("Dropdown",{attrs:{trigger:"click"},on:{"on-click":t.handleClickUserDropdown}},[n("a",{attrs:{href:"javascript:void(0)"}},[n("span",{staticClass:"main-user-name"},[t._v(t._s(t.userName))]),t._v(" "),n("Icon",{attrs:{type:"arrow-down-b"}})],1),t._v(" "),n("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[n("DropdownItem",{attrs:{name:"changePwd"}},[t._v("修改密码")]),t._v(" "),n("DropdownItem",{attrs:{name:"loginout",divided:""}},[t._v("退出登录")])],1)],1),t._v(" "),n("Avatar",{staticStyle:{background:"#619fe7","margin-left":"10px"},attrs:{src:t.avatorPath}})],1)],1)])],1),t._v(" "),t.updatePassowrdVisible?n("update-password",{ref:"updatePassowrd"}):t._e()],1)},staticRenderFns:[]},i=n("46Yf")(a,s,!1,null,null,null);e.default=i.exports},YbVU:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("oZaA"),s=n("E4LH"),i={data:function(){return{dynamicMenuRoutes:[]}},components:{SubMenu:a.default},computed:{sidebarLayoutSkin:{get:function(){return this.$store.state.common.sidebarLayoutSkin}},sidebarFold:{get:function(){return this.$store.state.common.sidebarFold}},menuList:{get:function(){return this.$store.state.common.menuList},set:function(t){this.$store.commit("common/updateMenuList",t)}},menuActiveName:{get:function(){return this.$store.state.common.menuActiveName},set:function(t){this.$store.commit("common/updateMenuActiveName",t)}},mainTabs:{get:function(){return this.$store.state.common.mainTabs},set:function(t){this.$store.commit("common/updateMainTabs",t)}},mainTabsActiveName:{get:function(){return this.$store.state.common.mainTabsActiveName},set:function(t){this.$store.commit("common/updateMainTabsActiveName",t)}}},watch:{$route:"routeHandle"},created:function(){this.menuList=JSON.parse(sessionStorage.getItem("menuList")||"[]"),this.dynamicMenuRoutes=JSON.parse(sessionStorage.getItem("dynamicMenuRoutes")||"[]"),this.routeHandle(this.$route)},mounted:function(){},methods:{routeHandle:function(t){if(t.meta.isTab){var e=this.mainTabs.filter(function(e){return e.name===t.name})[0];if(!e){if(t.meta.isDynamic&&!(t=this.dynamicMenuRoutes.filter(function(e){return e.name===t.name})[0]))return console.error("未能找到可用标签页!");e={menuId:t.meta.menuId||t.name,name:t.name,title:t.meta.title,type:Object(s.f)(t.meta.iframeUrl)?"iframe":"module",iframeUrl:t.meta.iframeUrl||"",closable:t.meta.closable},this.mainTabs=this.mainTabs.concat(e)}this.menuActiveName=e.menuId+"",this.mainTabsActiveName=e.name}}}},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("aside",{staticClass:"site-sidebar",class:"site-sidebar--"+t.sidebarLayoutSkin},[n("div",{staticClass:"site-sidebar__inner"},[n("el-menu",{staticClass:"site-sidebar__menu",attrs:{"default-active":t.menuActiveName||"home",collapse:t.sidebarFold,collapseTransition:!1}},[n("el-menu-item",{attrs:{index:"home"},on:{click:function(e){t.$router.push({name:"home"})}}},[n("icon-svg",{staticClass:"site-sidebar__menu-icon",attrs:{name:"shouye"}}),t._v(" "),n("span",{attrs:{slot:"title"},slot:"title"},[t._v("首页")])],1),t._v(" "),t._l(t.menuList,function(e){return n("sub-menu",{key:e.menuId,attrs:{menu:e,dynamicMenuRoutes:t.dynamicMenuRoutes}})})],2)],1)])},staticRenderFns:[]},r=n("46Yf")(i,o,!1,null,null,null);e.default=r.exports},"sRz/":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("TdIe"),s=n("YbVU"),i=n("xzNW"),o={data:function(){return{loading:!0}},components:{MainNavbar:a.default,MainSidebar:s.default,MainContent:i.default},computed:{documentClientHeight:{get:function(){return this.$store.state.common.documentClientHeight},set:function(t){this.$store.commit("common/updateDocumentClientHeight",t)}},sidebarFold:{get:function(){return this.$store.state.common.sidebarFold}},userId:{get:function(){return this.$store.state.user.id},set:function(t){this.$store.commit("user/updateId",t)}},userName:{get:function(){return this.$store.state.user.name},set:function(t){this.$store.commit("user/updateName",t)}}},created:function(){this.getUserInfo()},mounted:function(){this.resetDocumentClientHeight(),this.checkLock()},methods:{resetDocumentClientHeight:function(){var t=this;this.documentClientHeight=document.documentElement.clientHeight,window.onresize=function(){t.documentClientHeight=document.documentElement.clientHeight}},getUserInfo:function(){var t=this;this.$http({url:this.$http.adornUrl("/user/getUserInfo"),method:"get",params:this.$http.adornParams()}).then(function(e){var n=e.data;n.successful&&(t.loading=!1,t.userName=n.data.realname,localStorage.setItem("user",n.data.id))})},checkLock:function(){sessionStorage.getItem("lock")&&"lock"==sessionStorage.getItem("lock")&&this.$router.push({name:"locking"})}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:this.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"site-wrapper",class:{"site-sidebar--fold":this.sidebarFold},attrs:{id:"main","element-loading-text":"拼命加载中"}},[this.loading?this._e():[e("main-navbar"),this._v(" "),e("main-sidebar"),this._v(" "),e("div",{staticClass:"site-content__wrapper",style:{"min-height":this.documentClientHeight+"px"}},[e("main-content")],1)]],2)},staticRenderFns:[]},c=n("46Yf")(o,r,!1,null,null,null);e.default=c.exports},xzNW:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("E4LH"),s={data:function(){return{}},computed:{documentClientHeight:{get:function(){return this.$store.state.common.documentClientHeight}},menuActiveName:{get:function(){return this.$store.state.common.menuActiveName},set:function(t){this.$store.commit("common/updateMenuActiveName",t)}},mainTabs:{get:function(){return this.$store.state.common.mainTabs},set:function(t){this.$store.commit("common/updateMainTabs",t)}},mainTabsActiveName:{get:function(){return this.$store.state.common.mainTabsActiveName},set:function(t){this.$store.commit("common/updateMainTabsActiveName",t)}},siteContentViewHeight:function(){var t=this.documentClientHeight-50-30-2;return this.$route.meta.isTab?(t-=40,Object(a.f)(this.$route.meta.iframeUrl)?{height:t+"px"}:{minHeight:t+"px"}):{minHeight:t+"px"}}},methods:{test:function(){alert(1)},selectedTabHandle:function(t){(t=this.mainTabs.filter(function(e){return e.name===t.name})).length>=1&&this.$router.push({name:t[0].name})},removeTabHandle:function(t){var e=this;this.mainTabs=this.mainTabs.filter(function(e){return e.name!==t}),this.mainTabs.length>=1?t===this.mainTabsActiveName&&this.$router.push({name:this.mainTabs[this.mainTabs.length-1].name},function(){e.mainTabsActiveName=e.$route.name}):this.menuActiveName=""},tabsCloseCurrentHandle:function(){this.removeTabHandle(this.mainTabsActiveName)},tabsCloseOtherHandle:function(){var t=this,e=this.mainTabs.filter(function(t){return"home"==t.name}),n=this.mainTabs.filter(function(e){return e.name===t.mainTabsActiveName});e.push(n[0]),this.mainTabs=e},tabsCloseAllHandle:function(){this.mainTabs=[],this.menuActiveName="",this.$router.push({name:"home"})},tabsRefreshCurrentHandle:function(){var t=this,e=this.mainTabsActiveName;this.removeTabHandle(e),this.$nextTick(function(){t.$router.push({name:e})})}}},i={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"site-content",class:{"site-content--tabs":t.$route.meta.isTab}},[t.$route.meta.isTab?n("el-tabs",{on:{"tab-click":t.selectedTabHandle,"tab-remove":t.removeTabHandle},model:{value:t.mainTabsActiveName,callback:function(e){t.mainTabsActiveName=e},expression:"mainTabsActiveName"}},[n("el-dropdown",{staticClass:"site-tabs__tools",attrs:{"show-timeout":0}},[n("i",{staticClass:"el-icon-arrow-down el-icon--right"}),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{nativeOn:{click:function(e){t.tabsCloseCurrentHandle(e)}}},[t._v("关闭当前标签页")]),t._v(" "),n("el-dropdown-item",{nativeOn:{click:function(e){t.tabsCloseOtherHandle(e)}}},[t._v("关闭其它标签页")]),t._v(" "),n("el-dropdown-item",{nativeOn:{click:function(e){t.tabsCloseAllHandle(e)}}},[t._v("关闭全部标签页")]),t._v(" "),n("el-dropdown-item",{nativeOn:{click:function(e){t.tabsRefreshCurrentHandle(e)}}},[t._v("刷新当前标签页")])],1)],1),t._v(" "),t._l(t.mainTabs,function(e){return n("el-tab-pane",{key:e.name,attrs:{label:e.title,closable:e.closable,name:e.name}},[n("el-card",{attrs:{"body-style":t.siteContentViewHeight}},["iframe"===e.type?n("iframe",{attrs:{src:e.iframeUrl,width:"100%",height:"100%",frameborder:"0",scrolling:"yes"}}):n("keep-alive",[e.name===t.mainTabsActiveName?n("router-view"):t._e()],1)],1)],1)})],2):n("el-card",{attrs:{"body-style":t.siteContentViewHeight}},[n("keep-alive",[n("router-view",{attrs:{to:"mainTabsActiveName"}})],1)],1)],1)},staticRenderFns:[]},o=n("46Yf")(s,i,!1,null,null,null);e.default=o.exports}});