<template>
    <div class="jueseguanli-home-container">
    <!-- 角色列表 -->
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
            prop="id"
            label="ID"
            width="200" 
            align="center">
            </el-table-column>
            <el-table-column
            prop="name"
            label="姓名"
            min-width="120" 
            align="center">
            </el-table-column>
            <el-table-column
            prop="miaosu"
            label="描述"
            min-width="120" 
            align="center">
            </el-table-column>
            <el-table-column
            label="操作"
            min-width="120" 
            align="center">
            <template slot-scope="scope">
                <el-button @click="handleClickSjqx(scope.row)" type="text" size="small">数据权限</el-button>
                <el-button @click="handleClickSxqx(scope.row)" type="text" size="small">属性权限</el-button>
            </template>
            </el-table-column>
        </el-table>
        <!-- 分页 --> 
        <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination> 
        <!-- 属性权限 -->
        <el-dialog
            title="属性权限配置"
            :visible.sync="issxqxDlog"
            width="860px"
            align="left"
            >
                <el-table
                ref="multipleTable"
                :data="sxqxTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="id"
                label="ID"
                width="55" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                min-width="120" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="zhushi"
                label="注释"
                min-width="120" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="zhushi"
                label="注释"
                min-width="120" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="leixing"
                label="类型"
                min-width="120" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="tuomin"
                label="脱敏"
                min-width="120" 
                align="center">
                <template slot-scope='scope'>
                  <el-switch
                        v-model='scope.row.tuomin'
                        @change='onChangeSxqxTuomin(scope.row)'
                        active-text='开'
                        inactive-text='关'
                    >
                    </el-switch>
                </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="issxqxDlog = false">取 消</el-button>
                <el-button type="primary" @click="issxqxDlog = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 数据权限 -->
        <el-dialog
            title="数据权限配置"
            :visible.sync="issjqxDlog"
            width="860px"
            align="left"
            >
            <div>
                <el-form :inline="true" :model="sjqxruleForm" :rules="sjqxRules" ref="sjqxruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="sjqxruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色编码" prop="code">
                        <el-input v-model="sjqxruleForm.code"></el-input>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="sjfw">
                        <el-radio-group v-model="sjqxruleForm.sjfw" @change="sjqxRadioChange">
                            <el-radio label="未设置"></el-radio>
                            <el-radio label="全部数据"></el-radio>
                            <el-radio label="自定义数据"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type="primary" @click="sjqxSubmitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="sjqxResetForm('ruleForm')">重置</el-button>
                    </el-form-item> -->
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
                                    node-key="id"
                                    :default-expand-all="isZzjgExpand"
                                    ref="treeZzjg"
                                    :props="sjqxZzjgdefProps"
                                    @check="getZzjgCheckData"
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
                                    node-key="id"
                                    :default-expand-all="isXzqyExpand"
                                    ref="treeXzqy"
                                    :props="sjqxXzqyqxdefProps"
                                    @check="getXzqyCheckData"
                                    >
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            
                
            <span slot="footer" class="dialog-footer">
                <el-button @click="issjqxDlog = false">取 消</el-button>
                <el-button type="primary" @click="issjqxDlog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'jueseguanlihome',
    data() {
      return {
        tableData:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,

        issxqxDlog:false,//属性权限
        sxqxTableData:[],//属性权限列表
        sxqxSelection: [],//选中的项

        issjqxDlog:false,//数据权限
        isSqsjqxShow:false,//授权数据权限
        isZzjgqxchecked:false,//组织机构权限
        sjqxZzjgData:[],//数据权限组织机构
        sjqxZzjgdefProps: {
          children: 'children',
          label: 'label'
        },
        isZzjgExpand:false,
        isZzjgZk:false,//是否展开
        zzjgCheckData:[],//选中的数据
        isXzqyqxchecked:false,//行政区域权限
        sjqxXzqyqxData:[],//数据权限行政区域权限
        sjqxXzqyqxdefProps: {
          children: 'children',
          label: 'label'
        },
        isXzqyExpand:false,
        isXzqyZk:false,//是否展开
        xzqyCheckData:[],//选中的数据
        sjqxruleForm:{
            name:"",
            code:"",
            sjfw:""
        },
        sjqxRules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入角色编码', trigger: 'blur' }
          ],
          sjfw: [
            { required: true, message: '请选择数据范围', trigger: 'change' }
          ],
        }
      }
    },
    mounted () {
        this.getDataList()
    },
    methods:{
        getDataList () {
          this.$http({
            url: window.location.origin+"/src/data/" +"jsqx/home"+".json",
            method: 'get'
          }).then(({data}) => {
            this.tableData=data
            this.totalPage=data.length
          })
        },
        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 页码变更
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        //属性权限
        handleClickSxqx () {
            this.getSxqxDataList();
            this.issxqxDlog=true;
        },
        //属性权限的列表
        getSxqxDataList () {
          this.$http({
            url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
            method: 'get'
          }).then(({data}) => {
            this.sxqxTableData=data
          })
        },
        //属性权限列表选择
        handleSelectionChange(val) {
            this.sxqxSelection = val;
            console.log(this.sxqxSelection)
        },
        //属性权限脱敏开关
        onChangeSxqxTuomin(data){
            console.log(data)
            console.log(this.sxqxTableData)
        },
        //数据权限列表
        handleClickSjqx(){
            this.issjqxDlog=true;
        },
        sjqxSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        sjqxResetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //数据范围选择变化
        sjqxRadioChange(val) {
            console.log(val)
            if(val==="自定义数据"){
                this.isSqsjqxShow=true
                this.getsjqxZzjgData()
                this.getsjqxXzqyqxData()
            }else{
                this.isSqsjqxShow=false
            }
        },
        //获取组织机构list
        getsjqxZzjgData(){
            this.$http({
                url: window.location.origin+"/src/data/" +"jsqx/sjqxzzjg"+".json",
                method: 'get'
            }).then(({data}) => {
                this.sjqxZzjgData=data
            })
        },
        //树是否展开
        handleChangeZzjgExpand(){
            this.isZzjgZk=!this.isZzjgZk
            this.isZzjgExpand=!this.isZzjgExpand
            for(var i=0;i<this.$refs.treeZzjg.store._getAllNodes().length;i++){
                this.$refs.treeZzjg.store._getAllNodes()[i].expanded=this.isZzjgExpand;
            }
        },
        //组织机构权限勾选
        zzjgqxcheckedChange(){
            // if(this.isZzjgqxchecked===true){//全选
            //     this.$refs.treeZzjg.setCheckedNodes(this.sjqxZzjgData);
            //     this.zzjgCheckData=this.sjqxZzjgData
            // }else{//清空
            //     this.$refs.treeZzjg.setCheckedKeys([]);
            //      this.zzjgCheckData=[]
            // }
            console.log(this.zzjgCheckData)
        },
        //获取选中的数据
        getZzjgCheckData(data){
            this.zzjgCheckData.push(data)
            console.log(this.zzjgCheckData)
        },
        //获取行政区域权限list
        getsjqxXzqyqxData(){
            this.$http({
                url: window.location.origin+"/src/data/" +"jsqx/sjqxzzjg"+".json",
                method: 'get'
            }).then(({data}) => {
                this.sjqxXzqyqxData=data
            })
        },
        //树是否展开
        handleChangeXzqyExpand(){
            this.isXzqyZk=!this.isXzqyZk
            this.isXzqyExpand=!this.isXzqyExpand
            for(var i=0;i<this.$refs.treeXzqy.store._getAllNodes().length;i++){
                this.$refs.treeXzqy.store._getAllNodes()[i].expanded=this.isXzqyExpand;
            }
        },
        //行政区域权限勾选
        xzqyqxcheckedChange(){
            // if(this.isXzqyqxchecked===true){//全选
            //     this.$refs.treeXzqy.setCheckedNodes(this.sjqxZzjgData);
            //     this.xzqyCheckData=this.sjqxZzjgData
            // }else{//清空
            //     this.$refs.treeXzqy.setCheckedKeys([]);
            //     this.xzqyCheckData=[]
            // }
            // console.log(this.xzqyCheckData)
        },
        //获取选中的数据
        getXzqyCheckData(data){
            console.log(data)
            let checkdata=[]
            function checkData(data){
                if(data.children){
                    data.children.map((item,index)=>{
                        checkData(item);
                    })
                }else{
                    checkdata.push(data)
                    console.log(checkdata)
                    return checkdata
                }
                
            }
            checkData(data)
            console.log(checkdata)
        },


    }
  }
</script>

<style lang="scss" scoped>
    .jueseguanli-home-container {

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
            height: auto;
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
