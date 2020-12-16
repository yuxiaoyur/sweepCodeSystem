<template>
  <el-dialog
    :title="'日志详情列表' + '     所属板块：' + dataForm.modules + '     所属模块：' + dataForm.childModule "
    :modal-append-to-body="false"
    :close-on-click-modal="true"
    :visible.sync="visible"
    width="86%">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="detailLogToExcel()">导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <div class="mod-mssq-rcfx">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
        </el-table-column>
        <el-table-column
          prop="url"
          header-align="center"
          align="center"
          label="地址链接">
        </el-table-column>
        <el-table-column
          prop="responseCode"
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.responseCode == '200'" size="small">正常</el-tag>
            <el-tag v-else size="small" type="danger">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pollTime"
          header-align="center"
          align="center"
          label="巡检时间">
        </el-table-column>
        <el-table-column
          prop="responseTime"
          header-align="center"
          align="center"
          label="响应时长">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="viewDetails(scope.row.id)">查看详情
            </el-button>
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
      <!-- 弹窗, 新增 / 修改-->
      <view-details v-if="viewDetailsVisible" ref="viewDetails" @refreshDataList="getDataList"></view-details>
    </div>
  </el-dialog>
</template>

<script>
  import ViewDetails from './urlOrPort_statis_log_detail.vue'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          modules: '',
          childModule: '',
          url: '',
          urlType: '',
          urlStr: '',
          sTime: '',
          eTime: ''
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
        viewDetailsVisible: false
      }
    },
    components: {
      viewDetails: ViewDetails
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
    },
    methods: {
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
      init (modules, childModule, url, urlType, sTime, eTime) {
        this.visible = true
        this.dataForm.modules = modules
        this.dataForm.childModule = childModule
        this.dataForm.url = url
        this.dataForm.urlType = urlType
        this.dataForm.sTime = sTime
        this.dataForm.eTime = eTime
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/queryDetailsLogList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'modules': this.dataForm.modules,
            'childModule': this.dataForm.childModule,
            'urlType': this.dataForm.urlType,
            'url': this.dataForm.url,
            'sTime': this.dataForm.sTime,
            'eTime': this.dataForm.eTime
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
      detailLogToExcel () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/urlOrPort/detailsLogToExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'modules': this.dataForm.modules,
            'childModule': this.dataForm.childModule,
            'urlType': this.dataForm.urlType,
            'url': this.dataForm.url,
            'sTime': this.dataForm.sTime,
            'eTime': this.dataForm.eTime
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataListLoading = false
            window.open(data.data, '_blank')
            this.$message({
              message: data.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            console.log('ERROR', data)
            this.$message.error(data.message)
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
      viewDetails (id) {
        this.viewDetailsVisible = true
        this.$nextTick(() => {
          this.$refs.viewDetails.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var Ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if (Ids == null || Ids == '') {
          this.$message.error('请选择要删除的数据')
          return
        }
        this.$confirm(`确定进行[${Ids ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/link/removeLink'),
            method: 'post',
            params: this.$http.adornParams({id: Ids.join(',')}, false)
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
