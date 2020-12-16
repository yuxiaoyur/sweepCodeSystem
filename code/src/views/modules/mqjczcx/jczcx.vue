<template>
  <div class="mqjczcx-jczcxlb-container">
    <!-- <p class="jczcxlb-title"><span>XXX</span>截止<span>XXXX</span>，现有健康码实际用户<span>XXXX</span>人</p> -->
    <div class="jczcxlb-title">
        <p class="jczcxlb-title-text">成都市截止2020年3月15日，现有健康码实际用户710.98万个</p>
        <img class="jczcxlb-title-img" src="../../../assets/img/xiaohushi.png" alt="">
    </div>
    <div class="jczcxlb-search" style="margin-top: 20px;">
        <!-- @keyup.enter.native="" -->
      <el-form :inline="true" :model="searchForm" :rules="searchRules" ref="searchForm"  @keyup.enter.native="getSearch" size="small" label-width="95px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
              <el-input v-model.trim="searchForm.name"></el-input>
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
    <el-table v-loading="tableListLoading" class="jczcxlb-table" ref="multipleTable" :data="tableList" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name"  label="姓名" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="zhushi" label="身份证" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="leixing" label="病例类型" min-width="120" align="center">
        </el-table-column>
        <!-- <el-table-column prop="tuomin" label="健康状态更新时间" min-width="120" align="center"> -->
        <!-- <template slot-scope='scope'>
        </template> -->
        <!-- </el-table-column> -->
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
            name:"",
            idCard:""
        },
        searchRules: {
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
  .mqjczcx-jczcxlb-container {
      .jczcxlb-title {
        color: #fff;
        font-size: 16px;
        line-height: 70px;
        margin-bottom: 30px;
        background: url('../../../assets/img/xiaohushititle.png') center center no-repeat;
        background-size: calc( 100% - 185px ) 70px;
        background-position-x: 0px;
        display: flex;
        justify-content: space-between;
        align-content: center;
      }
        // background: #18385e;
        // background: -moz-linear-gradient(left, #ffffff  0%,#18385e 100%);
        // background: -webkit-gradient(linear, left, right, color-stop(0%,#ffffff), color-stop(100%,#18385e));
        // background: -webkit-linear-gradient(left, #ffffff 0%,#18385e 100%);
        // background: -o-linear-gradient(left, #ffffff 0%,#18385e 100%);
        // background: -ms-linear-gradient(left, #ffffff 0%,#18385e 100%);
        // background: linear-gradient(to right, #ffffff 0%,#18385e 100%);
        // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#18385e',GradientType=0 );
        // }
        // :root .jczcxlb-title{filter:none;}
    //   }
        .jczcxlb-title-text {
            padding-left: 40px;
            font-size: 18px;
        }

        .jczcxlb-title-img{
            width: 185px;
            height: 70px;
        }
      
    
  }

</style>