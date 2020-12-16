<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.apiName" placeholder="接口名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="dataForm.apiDeptId" filterable placeholder="请选择数据类提供部门" clearable>
              <el-option
                v-for="item in deptName"
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
            <el-input v-model="dataForm.apiFunction" placeholder="接口功能" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.apiUrl" placeholder="接口路径" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="dataForm.apiNetworkType" placeholder="接口网络类型" clearable>
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
        prop="apiName"
        header-align="center"
        align="center"
        sortable
        label="接口名称">
      </el-table-column>
      <el-table-column
        prop="apiDept"
        header-align="center"
        align="center"
        sortable
        label="数据类提供部门">
      </el-table-column>
      <el-table-column
        prop="apiFunction"
        header-align="center"
        align="center"
        sortable
        label="接口功能">
      </el-table-column>
      <el-table-column
        prop="apiUrl"
        header-align="center"
        align="center"
        sortable
        label="接口地址">
      </el-table-column>
      <el-table-column
        prop="apiNetworkType"
        header-align="center"
        align="center"
        sortable
        label="接口网络类型">
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
  import AddOrUpdateBusiness from './dept_api _info_add_or_update.vue'

  export default {
    data () {
      return {
        accessMethodOptions: [],
        deptName: [],
        dataForm: {
          id: '',
          apiName: '',
          apiDept: '',
          apiDeptId: null,
          apiFunction: '',
          apiUrl: '',
          apiNetworkType: ''
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
      this.getDeptData()
    },
    methods: {
      // 获取部门列表
      getDeptData () {
        this.$http({
          url: this.$http.adornUrl('/data_class/departments'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.deptName = data.data
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
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
        if (typeof this.dataForm.apiDeptId == 'string') {
          this.dataForm.apiDeptId = null
        }
          this.$http({
            url: this.$http.adornUrl('/dept_api_info/interfaces'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              // 在此处添加查询所需参数
              'apiName': this.dataForm.apiName,
              'apiDept': this.dataForm.apiDept,
              'apiDeptId': this.dataForm.apiDeptId,
              'apiFunction': this.dataForm.apiFunction,
              'apiUrl': this.dataForm.apiUrl,
              'apiNetworkType': this.dataForm.apiNetworkType
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
//        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/data_class/get_dict_type'),
          method: 'get',
          params: this.$http.adornParams({
            dictType: 'api_network_type'
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.accessMethodOptions = data.data

//            this.dataListLoading = false
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
          this.$refs.addOrUpdate.getDept(this.deptName)
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
            url: this.$http.adornUrl('/dept_api_info/interface'),
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
