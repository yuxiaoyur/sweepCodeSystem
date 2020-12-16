<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.sjbt" placeholder="标题关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.sjfssj" placeholder="发生时间(yyy-mm-dd)" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change=""
      style="width: 100%;">
      <el-table-column
        prop="sjfssj"
        header-align="center"
        align="center"
        label="发生时间">
      </el-table-column>
      <el-table-column
        prop="sjbt"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="sjfsqx"
        header-align="center"
        align="center"
        label="行政区划">
      </el-table-column>
      <el-table-column
        prop="sjfsdz"
        header-align="center"
        align="center"
        label="发生地址">
      </el-table-column>
      <el-table-column
        prop="sjssrs"
        header-align="center"
        align="center"
        label="受伤人数">
      </el-table-column>
      <el-table-column
        prop="sjswrs"
        header-align="center"
        align="center"
        label="死亡人数">
      </el-table-column>
      <el-table-column
        prop="sjlx"
        header-align="center"
        align="center"
        label="大类">
      </el-table-column>
      <el-table-column
        prop="sjjb"
        header-align="center"
        align="center"
        label="小类">
      </el-table-column>
      <el-table-column
        prop="sjdj"
        header-align="center"
        align="center"
        label="等级">
      </el-table-column>
      <el-table-column
        prop="ccss"
        header-align="center"
        align="center"
        label="财产损失">
      </el-table-column>
      <el-table-column
        prop="sjyy"
        header-align="center"
        align="center"
        label="发生原因">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="sjbindldzs(scope.row.id)">查看领导指示</el-button>
          <el-button type="text" size="small" @click="sjbindxxbs(scope.row.id)">查看信息报送</el-button>
        </template>
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
    <!-- 弹窗, 查看-->
    <bind-ldzs v-if="bindldzsVisible" ref="bindLdzs" @refreshDataList="getDataList"></bind-ldzs>
    <bind-xxbs v-if="bindxxbsVisible" ref="bindXxbs" @refreshDataList="getDataList"></bind-xxbs>
  </div>
</template>

<script>
  import Bindldzs from './yjzh-tfsj-ldzslist'
  import Bindxxbs from './yjzh-tfsj-xxbslist'
  export default {
    data () {
      return {
        dataForm: {
          sjfssj: '',
          sjbt: '',
          sjfsdz: '',
          sjlx: '',
          sjjb: '',
          sjdj: '',
          sjfsqx: '',
          sjssrs: '',
          sjswrs: '',
          ccss: '',
          sjyy: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission:[],
        permissionVisible:{
          add:false,
          update:false,
          delete:false
        },
        bindldzsVisible: false,
        bindxxbsVisible: false
      }
    },
    components: {
      bindLdzs: Bindldzs,
      bindXxbs: Bindxxbs
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      this.getPermission()
    },
    methods: {
      getPermission(){
        this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId:this.$route.meta.menuId})
        }).then(({data}) => {
          this.permission = data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].split(":")[1]){
              case "add":
                this.permissionVisible.add = true
                break;
              case "update":
                this.permissionVisible.update = true
                break;
              case "delete":
                this.permissionVisible.delete = true
                break;
              default:
                break;
            }
          }

        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/yjzh/findTfsjxx'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'sjbt': this.dataForm.sjbt,
            'sjfssj': this.dataForm.sjfssj
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataList = data.data.list
            this.totalPage = data.data.total
            this.dataListLoading = false
          }else{
            console.log('ERROR',data)
            this.$message.error("操作失败")
          }
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
      //查看列表
      sjbindldzs (id) {
        this.bindldzsVisible = true
        this.$nextTick(() => {
          this.$refs.bindLdzs.init(id)
        })
      },
      sjbindxxbs (id) {
        this.bindxxbsVisible = true
        this.$nextTick(() => {
          this.$refs.bindXxbs.init(id)
        })
      }
    }
  }
</script>
