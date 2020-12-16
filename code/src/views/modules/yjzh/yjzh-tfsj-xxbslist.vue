<template>
  <el-dialog
    title="信息报送情况"
    :modal-append-to-body="false"
    :close-on-click-modal="true"
    :visible.sync="visible"
    width="75%">
    <div class="mod-mssq-rcfx">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.bsnr" placeholder="内容关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.bssj" placeholder="报送时间(yyy-mm-dd)" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle(dataForm.sjdm,'','add')">新增</el-button>
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
          width="40">
        </el-table-column>
        <el-table-column
          prop="bsnr"
          header-align="center"
          align="center"
          label="报送内容">
        </el-table-column>
        <el-table-column
          prop="bssj"
          header-align="center"
          align="center"
          width="200px"
          label="报送时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="250"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id,scope.row.bsnr,'update')">修改</el-button>
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
  </el-dialog>
</template>

<script>
  import AddOrUpdatexxbs from './xxbs-addOrUpdate.vue'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          bsnr: '',
          bssj: '',
          sjdm: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        permission: [],
        permissionVisible: {
          add: false,
          update: false,
          delete: false
        },
        addOrUpdateVisible: false
      }
    },
    components: {
      addOrUpdate: AddOrUpdatexxbs
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    methods: {
      init (id) {
        this.dataForm.sjdm = id
        this.visible = true
        this.getDataList()
      },
      getPermission () {
        this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId: this.$route.meta.menuId})
        }).then(({data}) => {
          this.permission = data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].split(':')[1]) {
              case 'add':
                this.permissionVisible.add = true
                break
              case 'update':
                this.permissionVisible.update = true
                break
              case 'delete':
                this.permissionVisible.delete = true
                break
              default:
                break
            }
          }

        })
      },
      hasPermission (param) {
        switch (param) {
          case 'add':
            return this.permissionVisible.add
          case 'update':
            return this.permissionVisible.update
          case 'delete':
            return this.permissionVisible.delete
          default:
            return false
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/yjzh/findxxbs'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'bsnr': this.dataForm.bsnr,
            'bssj': this.dataForm.bssj,
            'id': this.dataForm.sjdm
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataList = data.data.list
            this.totalPage = data.data.total
            this.dataListLoading = false
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
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
      addOrUpdateHandle (id, bsnr, subType) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, bsnr, subType)
        })
      },
      // 删除
      deleteHandle (id) {
        var rcIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if (rcIds == null || rcIds == '') {
          this.$message.error('请选择要删除的数据')
          return
        }
        this.$confirm(`确定进行[${rcIds ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/yjzh/removexxbs'),
            method: 'post',
            params: this.$http.adornParams({id: rcIds.join(',')}, false)
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
