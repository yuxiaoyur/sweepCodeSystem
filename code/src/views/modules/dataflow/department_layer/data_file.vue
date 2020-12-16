<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.fileName" placeholder="文件名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.filePath" placeholder="文件路径" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="dataForm.fileType" placeholder="文件类型" clearable>
              <el-option
              v-for="item in accessMethodOptions"
              :key="item.value"
              :label="item.value"
              :value="item.label">
                {{item.value}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.updateFrequencyValue" placeholder="更新周期" clearable>
            <el-select v-model="dataForm.updateFrequencyUnit" slot="append" placeholder="单位" style="width: 75px" clearable>
              <el-option label="年" value="年"></el-option>
              <el-option label="月" value="月"></el-option>
              <el-option label="周" value="周"></el-option>
              <el-option label="天" value="天"></el-option>
              <el-option label="小时" value="小时"></el-option>
              <el-option label="分" value="分"></el-option>
            </el-select>
          </el-input>
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle(dataForm.id,'add')">新增
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <br/><br/>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="...">
      <el-table-column
        prop="fileName"
        header-align="center"
        align="center"
        sortable
        label="文件名称">
      </el-table-column>
      <el-table-column
        prop="filePath"
        header-align="center"
        align="center"
        sortable
        label="文件路径">
      </el-table-column>
      <el-table-column
        prop="fileType"
        header-align="center"
        align="center"
        sortable
        label="文件类型">
      </el-table-column>
      <el-table-column
        prop="updateFrequency"
        header-align="center"
        align="center"
        sortable
        label="更新周期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('view')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id,'view')">查看
          </el-button>
          <el-button v-if="hasPermission('update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id,'update')">修改
          </el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<style>
  .fixElDatePicker {
    align-content: center;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  import AddOrUpdateBusiness from './data_file_add_or_update.vue'

  export default {
    data () {
      return {
        accessMethodOptions:[],
        dataForm: {
          id: '',
          fileName: '',
          filePath: '',
          fileType: '',
          updateFrequencyValue: '',
          updateFrequencyUnit:''
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
          view: false,
          update: false,
          delete: false
        },
        addOrUpdateVisible: false
      }
    },
    computed: {},
    components: {
      addOrUpdate: AddOrUpdateBusiness
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.getPermission()
      this.getFileType()
    },
    methods: {
      // 取得权限
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
              case 'view':
                this.permissionVisible.view = true
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
      // 判断权限
      hasPermission (param) {
        switch (param) {
          case 'add':
            return this.permissionVisible.add
          case 'view':
            return this.permissionVisible.view
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
          url: this.$http.adornUrl('/data_file/files'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            // 在此处添加查询所需参数
            'fileName': this.dataForm.fileName,
            'filePath': this.dataForm.filePath,
            'fileType': this.dataForm.fileType,
            'updateFrequencyValue': this.dataForm.updateFrequencyValue,
            'updateFrequencyUnit': this.dataForm.updateFrequencyUnit
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
      // 获取文件类型
      getFileType () {
        this.$http({
          url: this.$http.adornUrl('/data_class/get_dict_type'),
          method: 'get',
          params: this.$http.adornParams({
            dictType: 'file_type'
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.accessMethodOptions = data.data
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

      // 添加或修改
      addOrUpdateHandle (id, subType) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initializing(id, subType)
          this.$refs.addOrUpdate.getRadio(this.accessMethodOptions)
        })
      },
      // 删除
      deleteHandle (id) {
        var Ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        if (Ids == null || Ids === '') {
          this.$message.error('请选择要删除的数据')
          return
        }
        this.$confirm(`确定进行[${Ids ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/data_file/file'),
            method: 'delete',
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
        }).catch(() => {
        })
      }
    }
  }
</script>
