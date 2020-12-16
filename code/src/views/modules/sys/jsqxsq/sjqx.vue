<template>
    <div class="jsqxsqsjqx-dialog-container">
        <!-- 数据权限 -->
        <el-dialog
            title="数据权限配置"
            :close-on-click-modal="false"
            :before-close='handleDialogClose'
            :visible.sync="isShowSjqxDialog"
            width="860px"
            align="left"
            >
            <div>
                <el-form :model="sjqxruleForm" :rules="sjqxRules" ref="sjqxruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input style="width:300px" v-model.trim="sjqxruleForm.name" disabled></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="角色编码" prop="code">
                        <el-input v-model.trim="sjqxruleForm.code"></el-input>
                    </el-form-item> -->
                    <el-form-item label="数据范围" prop="sjfw">
                        <el-radio-group v-model="sjqxruleForm.sjfw" @change="sjqxRadioChange">
                            <el-radio label="未设置"></el-radio>
                            <el-radio label="全部数据"></el-radio>
                            <el-radio label="自定义数据"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="jsgl_sjqxsq_box"  v-if="isSqsjqxShow">
                        <p class="jsgl_sjqxsq_title">授权数据权限</p>
                        <div class="jsgl_sjqxsq_content">
                            <div class="jsgl_sjqxsq_tree">
                                <div class="jsgl_sjqxsq_tree_top">
                                    <el-checkbox v-model="isZzjgqxchecked" @change="zzjgqxcheckedChange">组织机构权限</el-checkbox>
                                    <span @click="handleChangeZzjgExpand" :style="{color:isZzjgZk===false?'#c1c1c1':'#03A9F4'}">展开</span>
                                </div>
                                <el-tree
                                    :data="sjqxZzjgData"
                                    show-checkbox
                                    node-key="code"
                                    :default-expand-all="isZzjgExpand"
                                    ref="treeZzjg"
                                    :props="sjqxZzjgdefProps"
                                    @check-change="getZzjgCheckData"
                                    >
                                </el-tree>
                            </div>
                            <div class="jsgl_sjqxsq_tree">
                                <div class="jsgl_sjqxsq_tree_top">
                                    <el-checkbox v-model="isXzqyqxchecked" @change="xzqyqxcheckedChange">行政区域权限</el-checkbox>
                                    <span @click="handleChangeXzqyExpand" :style="{color:isXzqyZk===false?'#c1c1c1':'#03A9F4'}">展开</span>
                                </div>
                                <el-tree
                                    :data="sjqxXzqyqxData"
                                    show-checkbox
                                    node-key="code"
                                    :default-expand-all="isXzqyExpand"
                                    ref="treeXzqy"
                                    :props="sjqxXzqyqxdefProps"
                                    @check-change="getXzqyCheckData"
                                    >
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            
                
            <span slot="footer" class="dialog-footer">
                <el-button  @click='handleDialogClose'>取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'jsqxsqsjqx',
    props:{
		isShowSjqxDialog:{
			type:[Boolean],
			required:true
        }
    },
    data() {
      return {
        type:"",
        sjqxruleForm:{
            name:"",
            code:"",
            sjfw:'未设置',
            zzjgqx:[],//选中的组织机构树值
            xzqyqx:[]//选中的行政机构树值
        },
        sjqxRules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
        //   code: [
        //     { required: true, message: '请输入角色编码', trigger: 'blur' }
        //   ],
          sjfw: [
            { required: true, message: '请选择数据范围', trigger: 'change' }
          ],
        },
        isSqsjqxShow:false,//授权数据权限
        isZzjgqxchecked:false,//组织机构权限
        sjqxZzjgData:[],//数据权限组织机构
        zzjgTreeLength:0,
        sjqxZzjgdefProps: {
          children: 'children',
          label: 'label'
        },
        isZzjgExpand:false,
        isZzjgZk:false,//是否展开
        isXzqyqxchecked:false,//行政区域权限
        sjqxXzqyqxData:[],//数据权限行政区域权限
        xzqyTreeLength:0,
        sjqxXzqyqxdefProps: {
          children: 'children',
          label: 'label'
        },
        isXzqyExpand:false,
        isXzqyZk:false,//是否展开
        
      }
    },
    mounted () {
        
    },
    created() {
    },
    methods:{
        //数据过滤
        formatTypeWord (type) {
            switch (type) {
                case "0":
                return '未设置'
                case "1":
                return '全部数据'
                case "2":
                return '自定义数据'
            }
        },
        formatTypeNum (word) {
            switch (word) {
                case '未设置':
                return 0
                case '全部数据':
                return 1
                case '自定义数据':
                return 2
            }
        },
        // 初始化获取修改数据权限信息
        handleClickSjqx (row) {
            this.sjqxruleForm={
                name:row.name,
                code:row.id,
                sjfw:'未设置',
                zzjgqx:[],
                xzqyqx:[]
            },
            // console.log(this.isSqsjqxShow)
            this.type=row.type
            let page = ""
            let params = {}
            if(row.type==="user"){
                page="/dataPermission/getUserData",
                params={
                    "user_code":row.id
                }
            }else if(row.type==="juese"){
                page="/dataPermission/getRoleData",
                params={
                    "role_code":row.id
                }
            }
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sjqxform"+".json",
               url:this.$http.adornUrl(page),
               method: 'get',
               params: this.$http.adornParams(params)
            }).then(({data}) => {
                if(data.successful===false){
                    this.$message({
                        message: '网络错误，清稍后再试',
                        type: 'warning'
                    });
                }else{
                    if(data.data.length!==0){
                        //后台返回ctrl_permi===1时是组织机构权限反显值
                        //后台返回ctrl_permi===2时是行政区域构权限反显值
                        // console.log(data.data[0])
                        this.sjqxruleForm.sjfw=this.formatTypeWord(data.data[0].ctrl_type)
                        // console.log(this.sjqxruleForm.sjfw)
                        this.sjqxRadioChange(this.sjqxruleForm.sjfw)
                        data.data.map((item,index)=>{
                            // console.log(item.ctrl_data)
                            if(item.ctrl_permi==="1"){
                                if(item.ctrl_data!==""){
                                    this.sjqxruleForm.zzjgqx.push(item.ctrl_data)
                                }
                            }else if(item.ctrl_permi==="2"){
                                if(item.ctrl_data!==""){
                                    this.sjqxruleForm.xzqyqx.push(item.ctrl_data)
                                }
                            }
                        })
                        if(this.sjqxruleForm.zzjgqx.length===0){
                            this.isZzjgqxchecked=false
                        }
                        if(this.sjqxruleForm.xzqyqx.length===0){
                            this.isXzqyqxchecked=false
                        }
                        //  console.log(this.sjqxruleForm.zzjgqx,this.sjqxruleForm.xzqyqx)
                    }else{
                        this.sjqxRadioChange(this.sjqxruleForm.sjfw)
                    }
                    
                }

            })
        },
        // 关闭当前弹窗
        handleDialogClose () {
            this.sjqxZzjgData=[]
            this.sjqxXzqyqxData=[]
            this.$emit('onClose', 'close-sjqx')
        },
        //数据范围选择变化
        sjqxRadioChange(val) {
            // console.log(val)
            if(val==="自定义数据"){
                this.isSqsjqxShow=true
                this.getsjqxZzjgData()
                this.getsjqxXzqyqxData()
            }else{
                this.isSqsjqxShow=false
            }
        },
        //获取组织机构list-tree
        getsjqxZzjgData(){
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sjqxzzjg"+".json",
                // method: 'get'
               url:this.$http.adornUrl('/dataPermission/getDeptTree'),
               method: 'get',
            //    params: this.$http.adornParams(params)
            }).then(({data}) => {
                this.sjqxZzjgData=[]
                this.sjqxZzjgData.push(data.data)
                let treedata=this.getDiguiTreeData(data.data)
                this.zzjgTreeLength=treedata.data.length
                // console.log(this.zzjgTreeLength)
                if(this.sjqxruleForm.zzjgqx.length>0){//是否反显
                    let fxData=[]
                    this.sjqxruleForm.zzjgqx.map((item,index)=>{
                        fxData.push({"code":item})
                    })
                    setTimeout(() => {
                        this.$refs.treeZzjg.setCheckedNodes(fxData)
                        this.handleChangeZzjgExpand(true)
                    }, 200)
                }else{
                    this.$refs.treeZzjg.setCheckedNodes([])
                }
            })
        },
        //树是否展开
        handleChangeZzjgExpand(istrue){
            if(istrue===true){
                this.isZzjgZk=true
                this.isZzjgExpand=true
            }else{
                this.isZzjgZk=!this.isZzjgZk
                this.isZzjgExpand=!this.isZzjgExpand
            }
            
            for(var i=0;i<this.$refs.treeZzjg.store._getAllNodes().length;i++){
                this.$refs.treeZzjg.store._getAllNodes()[i].expanded=this.isZzjgExpand;
            }
        },
        //组织机构权限勾选
        zzjgqxcheckedChange(){
            if(this.isZzjgqxchecked===true){//全选
                this.$refs.treeZzjg.setCheckedNodes(this.sjqxZzjgData);
            }else{//清空
                this.$refs.treeZzjg.setCheckedKeys([]);
                this.sjqxruleForm.zzjgqx=[]
            }
        },
        //组织机构获取选中的数据
        getZzjgCheckData(data,check){
            let checkData=this.getDiguiTreeData(data,check)
            // console.log(checkData)
            if(checkData.ischeck===true){//选中
                checkData.data.map((item,index)=>{
                    // this.zzjgCheckData.push(item)
                    this.sjqxruleForm.zzjgqx.push(item.code)
                })
            }else{//取消选中
                if(this.sjqxruleForm.zzjgqx.length>0&&checkData.data.length!==this.zzjgTreeLength){
                    checkData.data.map((item,index)=>{
                        this.sjqxruleForm.zzjgqx.map((im,idx)=>{
                            if(im===item.code){
                                this.sjqxruleForm.zzjgqx.splice(idx,1)
                            }
                        })
                    })
                }
            }
            if(this.sjqxruleForm.zzjgqx.length===0){
                this.isZzjgqxchecked=false
            }
        },
        //获取行政区域权限list-tree
        getsjqxXzqyqxData(){
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sjqxzzjg"+".json",
                url:this.$http.adornUrl('/dataPermission/getRegionTree'),
                method: 'get'
            }).then(({data}) => {
                // console.log(this.sjqxruleForm.xzqyqx)
                this.sjqxXzqyqxData=[]
                this.sjqxXzqyqxData.push(data.data)
                let treedata=this.getDiguiTreeData(data.data)
                this.xzqyTreeLength=treedata.data.length
                // console.log(this.xzqyTreeLength)
                if(this.sjqxruleForm.xzqyqx.length>0){//是否反显
                    let fxData=[]
                    this.sjqxruleForm.xzqyqx.map((item,index)=>{
                        fxData.push({"code":item})
                    })
                    setTimeout(() => {
                        this.$refs.treeXzqy.setCheckedNodes(fxData)
                        this.handleChangeXzqyExpand(true)
                    }, 200)
                }else{
                    this.$refs.treeXzqy.setCheckedNodes([])
                }
            })
        },
        //树是否展开
        handleChangeXzqyExpand(istrue){
            if(istrue===true){
                this.isXzqyZk=true
                this.isXzqyExpand=true
            }else{
                this.isXzqyZk=!this.isXzqyZk
                this.isXzqyExpand=!this.isXzqyExpand
            }
            for(var i=0;i<this.$refs.treeXzqy.store._getAllNodes().length;i++){
                this.$refs.treeXzqy.store._getAllNodes()[i].expanded=this.isXzqyExpand;
            }
        },
        //行政区域权限勾选
        xzqyqxcheckedChange(){
            if(this.isXzqyqxchecked===true){//全选
                this.$refs.treeXzqy.setCheckedNodes(this.sjqxZzjgData);
            }else{//清空
                this.$refs.treeXzqy.setCheckedKeys([]);
                this.sjqxruleForm.xzqyqx=[]
            }
        },
        //行政区域获取选中的数据
        getXzqyCheckData(data,check){
            let checkData=this.getDiguiTreeData(data,check)
                        // console.log(checkData)
                        // console.log(this.sjqxruleForm.xzqyqx)
                        // console.log(checkData.ischeck)
            if(checkData.ischeck===true){//选中
                checkData.data.map((item,index)=>{
                    this.sjqxruleForm.xzqyqx.push(item.code)
                })
            }else{//取消选中
                //初始反显时会出现反显为false,长度为所有数据长度，会清零
                if(this.sjqxruleForm.xzqyqx.length>0&&checkData.data.length!==this.xzqyTreeLength){
                    checkData.data.map((item,index)=>{
                        this.sjqxruleForm.xzqyqx.map((im,idx)=>{
                            // console.log(im,item.code)
                            if(im===item.code){
                                this.sjqxruleForm.xzqyqx.splice(idx,1)
                            }
                        })
                    })
                }
            }      
            if(this.sjqxruleForm.xzqyqx.length===0){
                this.isXzqyqxchecked=false
            }
        },
        //递归函数获取选中的底层值
        getDiguiTreeData(data,check){
            let checkdatas={ischeck:check,data:[]}
            function checkData(data){
                if(data.children){
                    data.children.map((item,index)=>{
                        checkData(item);
                    })
                }else{
                    checkdatas.data.push(data)
                    return checkdatas
                }
                
            }
            checkData(data)
            return checkdatas
        },
        //用于树反显的递归函数
        getFanxanDiguiTreeId(data){
            let treeCheckID=[]
            function treeID(data){
                if(data.children){
                    data.children.map((item,index)=>{
                        treeID(item);
                    })
                }else{
                    treeCheckID.push(data.code)
                    return treeCheckID
                }
                
            }
            treeID(data)
            return treeCheckID
        },


        //提交设置
        handleSubmit(){
            let page = ""
            let params = {
                "ctrl_type":this.formatTypeNum(this.sjqxruleForm.sjfw),
                "ctrl_data":this.sjqxruleForm.zzjgqx.toString(),//组织机构权限树
                "ctrl_permi":this.sjqxruleForm.xzqyqx.toString()//行政区域权限
            }
            
            if(this.type==="user"){
                params.user_code=this.sjqxruleForm.code
                page="/dataPermission/insertUserDataPermission"
            }else if(this.type==="juese"){
                params.role_code=this.sjqxruleForm.code
                page="/dataPermission/insertRoleDataPermission"
            }
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
                url:this.$http.adornUrl(page),
                method: 'post',
                data: this.$http.adornData(params,false)
            }).then(({data}) => {
                if(data.successful===false){
                    this.$message({
                        message: '网络错误，清稍后再试',
                        type: 'warning'
                    });
                    this.handleDialogClose()
                }else{
                     this.$message({
                        message: '操作成功！',
                        type: 'success'
                     });
                     this.handleDialogClose()
                }
                //清空数据
                this.sjqxruleForm={
                    name:"",
                    code:"",
                    sjfw:'未设置',
                    zzjgqx:[],
                    xzqyqx:[]
                }
            })   
        }
    }
  }
</script>

<style lang="scss" scoped>
    .jsqxsqsjqx-dialog-container {
        .jsgl_sjqxsq_box {
            width: 100%;
            height: auto;
        }

        .jsgl_sjqxsq_title {
            font-size: 16px;
            color: #03A9F4;
            border-bottom: 2px solid #03A9F4;
        }

        .jsgl_sjqxsq_content {
            width: 100%;
            height: auto;
            display: flex;
            justify-content: space-between;
            align-content: center;
            padding-top: 20px;
        }

        .jsgl_sjqxsq_tree {
            width: 45%;
            max-height: 300px;
            overflow:auto;
            padding: 15px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            border-radius: 5px;
            

            .jsgl_sjqxsq_tree_top {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-content: center;
                font-size: 14px;
                span {
                    cursor: pointer;
                }
            }
        }
    }      
</style>