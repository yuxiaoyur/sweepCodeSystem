<template>
    <div class="jsqxsxsq-dialog-container">
        <!-- 属性权限 -->
        <el-dialog
            :close-on-click-modal="false"
            :before-close='handleDialogClose'
            :visible.sync="isShowSxqxDialog"
            width="960px"
            align="left"
            >
                <span slot="title">
                    <el-select v-model="tableName" placeholder="请选择" @change='onChangeTableName'>
                        <el-option
                        v-for="item in tableNameOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </span>
                <el-table
                ref="sxqxMpleTable"
                :data="sxqxTableData"
                tooltip-effect="dark"
                style="width: 100%"
                height="350"
                >
                <!-- @selection-change="handleSelectionChange" -->
                <!-- <el-table-column
                type="selection"
                width="55">
                </el-table-column> -->
                 <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                    align="center">
                </el-table-column>
                <el-table-column
                prop="name"
                label="属性列名"
                min-width="100" 
                align="center">
                </el-table-column>
                <el-table-column
                prop="comment"
                label="属性注释"
                min-width="100" 
                align="center">
                </el-table-column>
                <!-- <el-table-column
                prop="leixing"
                label="类型"
                min-width="100" 
                align="center">
                </el-table-column> -->
                <el-table-column
                prop="isSensitive"
                label="脱敏"
                min-width="100" 
                align="center">
                <template slot-scope='scope'>
                    <el-switch
                        v-model='scope.row.isSensitive'
                        @change='onChangeSxqxTuomin(scope.row)'
                    >
                    </el-switch>
                     <!-- active-text='开'
                        inactive-text='关' -->
                </template>
                </el-table-column>
                <el-table-column
                prop="sensitiveStart"
                label="脱敏规则"
                min-width="300" 
                align="center">
                    <template slot-scope='scope'>
                        <el-select style="width:100%" v-model="scope.row.sensitiveRule" :disabled="!scope.row.isSensitive" placeholder="请选择">
                            <el-option
                            v-for="item in tmgzoptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button  @click='handleDialogClose'>取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'jsqxsqsxqx',
    props:{
		isShowSxqxDialog:{
			type:[Boolean],
			required:true
        }
    },
    data() {
      return {
        parentId:"",
        type:"",
        tableName:"",//表名
        tableNameCode:"",//表id
        tableNameOptions: [],
        issxqxDlog:false,//属性权限
        sxqxTableData:[],//属性权限列表初始表
        sxqxSelection: [],//选中的项
        tmgzoptions: [],
        tmgzvalue: []//脱敏规则
      }
    },
    mounted () {
        
    },
    methods:{
        // 初始化获取修改属性权限的列表
        handleClickSxqx (row) {
            this.parentId=row.id
            this.type=row.type
            this.getTableName()
            this.getTmStatus()
            
        },

        //获脱敏配置
        getTmStatus(){
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
               url:this.$http.adornUrl("/dataPermission/getTmStatus"),
               method: 'get',
            }).then(({data}) => {
                this.tmgzoptions=data.data
                this.tmgzoptions.map((item,index)=>{
                    if(item.code==="0"){
                        this.tmgzoptions.splice(index,1)
                    }
                })
            })
        },

        //获取表头
        getTableName(){
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
               url:this.$http.adornUrl("/dataPermission/getAllTables"),
               method: 'get',
            }).then(({data}) => {
                this.tableNameOptions=data.data
                this.tableName=data.data[0].name
                this.tableNameCode=data.data[0].code
                this.getTableTitle(this.tableNameCode)
                setTimeout(()=>{
                    this.getOldList()
                },1000)
                
            })
        },

        //获取表名
        getTableTitle(code){
            let params={
                "tablename":code
            }
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
               url:this.$http.adornUrl("/dataPermission/getTabelInfo"),
               method: 'get',
               params: this.$http.adornParams(params)
            }).then(({data}) => {
                // console.log(data)
                data.data.map((item,index)=>{
                    item.isSensitive=true
                    item.sensitiveRule="3"
                })
                this.sxqxTableData=data.data
                // this.tableName=data.data[0].name
            })
        },

        //切换表头
        onChangeTableName(val){
            this.tableNameCode=val
            this.getTableTitle(val)
            setTimeout(()=>{
                this.getOldList()
            },1000)
        },

        //是否反显
        getOldList(){
            let page = ""
            let params = {}
            if(this.type==="user"){
                page="/dataPermission/userColumnList",
                params={
                    "userid":this.parentId,
                    "tableName":this.tableNameCode
                }
            }else if(this.type==="juese"){
                page="/dataPermission/roleColumnList",
                params={
                    "roleid":this.parentId,
                    "tableName":this.tableNameCode
                }
            }
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
               url:this.$http.adornUrl(page),
               method: 'get',
               params: this.$http.adornParams(params)
            }).then(({data}) => {
                // console.log(data)
                if(data.data.length!==0){
                    this.sxqxTableData=data.data
                    this.sxqxTableData.map((item,index)=>{
                        item.isSensitive==="0"?item.isSensitive=false:item.isSensitive=true
                        item.sensitiveRule==="0"?item.sensitiveRule="不设置脱敏，全显示":item.sensitiveRule
                        item.name=item.columnName
                        item.comment=item.cloumnRealName
                    })
                }
                
                // this.$nextTick(() => {//反显
                //     this.sxqxTableData.map((item,index)=>{
                //         if(item.isCheck===true){
                //             console.log(item)
                //             this.$refs.sxqxMpleTable.toggleRowSelection(item)
                //         }
                //     })
                // })
            })
        },

         // 关闭当前弹窗
        handleDialogClose () {
            this.$emit('onClose', 'close-sxqx')
        },

        //属性权限列表选择
        handleSelectionChange(val) {
            // console.log(val)
            this.sxqxSelection = val;
            // console.log(this.sxqxSelection)
        },
        //属性权限脱敏开关
        onChangeSxqxTuomin(data){
            // console.log(data)
            this.sxqxTableData.map((item,index)=>{
                if(item.id===data.id){
                    if(item.isSensitive===false){
                       item.sensitiveRule="不设置脱敏，全显示"
                        this.$set(this.sxqxTableData,index, this.sxqxTableData[index])
                    }
                    if(item.isSensitive===true){
                        item.sensitiveRule="3"
                        this.$set(this.sxqxTableData,index, this.sxqxTableData[index])
                    }
                }
            })
            // console.log(this.sxqxTableData)
        },
        //提交设置属性权限
        handleSubmit(){
            let table = []
            this.sxqxTableData.map((item,index)=>{
                // console.log()
                let text={
                    name:item.name,
                    comment:item.comment,
                    cloumnRealName:item.cloumnRealName,
                    isSensitive:item.isSensitive===false?"0":"1",
                    sensitiveRule:item.sensitiveRule==="不设置脱敏，全显示"?"0":item.sensitiveRule
                }
                table.push(text)
            })
            let page = ""
            let params ={}
            if(this.type==="user"){
                page="/dataPermission/insertUserColumnPermission"
                params= {"userid":this.parentId,"tableName":this.tableNameCode,"tabledata":JSON.stringify(table)}
            }else if(this.type==="juese"){
                page="/dataPermission/insertRoleColumnPermission"
                params= {"roleid":this.parentId,"tableName":this.tableNameCode,"tabledata":JSON.stringify(table)}
            }
            this.$http({
                // url: window.location.origin+"/src/data/" +"jsqx/sxqx"+".json",
               url:this.$http.adornUrl(page),
               method: 'post',
               data: this.$http.adornData(params,false)
            }).then(({data}) => {
                if(data.successful===false){
                    this.$message({
                        message: '系统异常，请与管理人员联系',
                        type: 'warning'
                    });
                    this.handleDialogClose()
                    this.sxqxTableData=[]
                }else{
                     this.$message({
                        message: '操作成功！',
                        type: 'success'
                     });
                     this.handleDialogClose()
                    this.sxqxTableData=[]
                }
            })
        }
    }
  }
</script>

<style lang="scss" scoped>
    .jsqxsxsq-dialog-container {

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