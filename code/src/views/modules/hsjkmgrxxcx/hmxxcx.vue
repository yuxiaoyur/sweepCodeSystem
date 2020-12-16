<template>
  <div class="qsxjkmtj-hsjkmlb-container">
    <p class="qsxjkmlb-title"><span>XXX</span>截止<span>XXXX</span>，现有健康码实际用户<span>XXXX</span>人</p>
    <div class="qsxjkmlb-search" style="margin-top: 20px;">
        <!-- @keyup.enter.native="" -->
      <el-form :inline="true" :model="searchForm" :rules="searchRules" ref="searchForm"  @keyup.enter.native="getSearch" size="small" label-width="95px" class="demo-ruleForm">
          <el-form-item label="手机号：" prop="phone">
              <el-input v-model.trim="searchForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证：" prop="idCard">
              <el-input v-model.trim="searchForm.idCard"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" size="small" plain @click="getSearch"> 查 询</el-button>
              <el-button type="primary" size="small" plain @click="resetForm('searchForm')"> 重 置</el-button>
          </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="tableListLoading" class="qsxjkmlb-table" ref="multipleTable" :data="tableList" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name"  label="姓名" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="zhushi" label="健康码" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="leixing" label="健康信息" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="tuomin" label="健康状态更新时间" min-width="120" align="center">
        <!-- <template slot-scope='scope'>
        </template> -->
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import IDCardNoUtils from '@/utils/IDCardNoUtils'
  export default {
    name: 'home',
    data() {
      const validateIDCardNo = (rule, value, callback) => {
        if (IDCardNoUtils.check18IdCardNo(value) || IDCardNoUtils.check15IdCardNo(value)) {
          callback()
        } else {
          callback(new Error("请输入正确的身份证号!"))
        }
      }
      return {
        searchForm: {
            phone:"",
            idCard:""
        },
        searchRules: {
          phone: [
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
          ],
          idCard: [
            { validator: validateIDCardNo, trigger: 'change' }
          ]
        },
        tableList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableListLoading: false
     

      }
    },
    mounted () {
        this.getSearch()
      
    },
    methods:{
        //获取数据
        getSearch () {
          this.tableListLoading = true
          let page="/dataPermission/getUserData"
          let params=this.searchForm
          this.$http({
            url: window.location.origin+"/src/data/" +"jkmcs"+".json",
            method: 'get'
              // url:this.$http.adornUrl(page),
              // method: 'get',
              // params: this.$http.adornParams(params)
          }).then(({data}) => {
            console.log(data)
            this.tableListLoading = false
            this.tableList=[]
            // if(data.successful){
            //   this.tableList = data.data.list
            //   this.totalPage = data.data.total
            //   this.tableListLoading = false
            // }else{
            //     this.$message.error("操作失败")
            // }
          })
        },
        //重置查询信息
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        //分页
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

        
    }
  }
</script>

<style lang="scss" scoped>
  .qsxjkmtj-hsjkmlb-container {
      .qsxjkmlb-title {
          color: #17B3A3;
          font-size: 16px;
          line-height: 30px;
          border-bottom: 1px solid #c1c1c1;
          margin-bottom: 30px;
      }
    
  }

</style>
