<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.dataType" placeholder="数据类" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-input v-model="dataForm.department" placeholder="部门" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input v-model="dataForm.apiUrl" placeholder="接口地址" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select v-model="dataForm.usingStatus" placeholder="请选择使用状态" clearable>
              <el-option
                v-for="item in usingStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
      stripe
      highlight-current-row
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      height="500"
      max-height="500"
      style="width: 100%;"
    >

      <el-table-column
        prop="dataType"
        header-align="center"
        align="center"
        label="数据类"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="department"
        header-align="center"
        align="center"
        sortable
        label="部门">
      </el-table-column>
      <el-table-column
        prop="apiUrl"
        header-align="center"
        align="center"
        sortable
        label="接口地址">
      </el-table-column>
      <el-table-column
        prop="usingStatus"
        header-align="center"
        align="center"
        sortable
        label="使用状态">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="120"
        label="操作"
        fixed="right">
        <template slot-scope="scope">
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
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
  import AddOrUpdateBusiness from './data_merge_ledger_add_or_update.vue'

  export default {
    data() {
      return {
        usingStatusOptions: [
          {
            value: '已使用',
            lable: '已使用'
          },
          {
            value: '未使用',
            lable: '未使用'
          },
          {
            value: '淘汰',
            lable: '淘汰'
          }
        ],
        dataForm: {
          id: '',
          dataType: '',
          department: '',
          apiUrl: '',
          usingStatus: ''
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
    computed: {},
    components: {
      addOrUpdate: AddOrUpdateBusiness
    },
    activated() {
      this.getDataList()
    },
    mounted() {
      this.getPermission()
    },
    methods: {
      // 取得权限
      getPermission() {
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
      // 判断权限
      hasPermission(param) {
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
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/data_merge_ledger/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'doneUser': this.dataForm.doneUser,
            // 在此处添加查询所需参数
            'dataType': this.dataForm.dataType,
            'department': this.dataForm.department,
            'apiUrl': this.dataForm.apiUrl,
            'usingStatus': this.dataForm.usingStatus
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
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 页码变更
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },

      // 添加或修改
      addOrUpdateHandle(id, subType) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initializing(id, subType)
        })
      },
      // 删除
      deleteHandle(id) {
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
            url: this.$http.adornUrl('/business_manage/deleteRecord'),
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
        }).catch(() => {
        })
      }
    }
  }
</script>
