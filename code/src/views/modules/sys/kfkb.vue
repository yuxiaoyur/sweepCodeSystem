<template>
  <div class="mod-kfkb-rcjl">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.gjc" placeholder="输入系统级别信息" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.date" placeholder="时间(yyyy-MM-dd)" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="hasPermission('delete')" type="primary" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <!--<el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="150"
        label="ID">
      </el-table-column>-->

      <!--<el-table-column-->
        <!--prop="sj"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="180"-->
        <!--label="统计时间">-->
      <!--</el-table-column>-->

      <el-table-column
        prop="yjxtgn"
        header-align="center"
        align="center"
        width="160"
        label="一级系统功能">
      </el-table-column>
      <el-table-column
        prop="erjxtgn"
        header-align="center"
        align="center"
        width="160"
        label="二级系统功能">
      </el-table-column>

      <el-table-column
        prop="sjxtgn"
        header-align="center"
        align="center"
        width="160"
        label="三级系统功能">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="hj"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="80"-->
        <!--label="合计">-->
      <!--</el-table-column>-->

      <el-table-column
        prop="lx"
        header-align="center"
        align="center"
        width="80"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lx == 1" size="small" type="danger">表</el-tag>
          <el-tag v-else size="small">接口</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="bjxx"
        header-align="center"
        align="center"
        width="160"
        label="表（接口）信息">
      </el-table-column>

      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './kfkb-kfkbgl-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          gjc: '',
          date: ''
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
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
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
      hasPermission(param){
        switch (param){
          case "add":
            return this.permissionVisible.add
          case "update":
            return this.permissionVisible.update
          case "delete":
            return this.permissionVisible.delete
          default:
            return false;
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/kfkb/xtjrgljk'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'gjc': this.dataForm.gjc,
            'date': this.dataForm.date
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var rcIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if(rcIds == null || rcIds == ''){
          this.$message.error("请选择要删除的数据")
          return
        }
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/kfkb/xtjrgljk/remove'),
            method: 'post',
            params: this.$http.adornParams({id:rcIds.join(',')},false)
          }).then(({data}) => {
            if (data && data.successful) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      }

    }
  }
</script>
