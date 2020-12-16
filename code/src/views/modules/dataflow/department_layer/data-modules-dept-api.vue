<template>
  <el-dialog
    :title="'绑定'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="已绑定库表" name="1">
        <el-table
          :data="bindDataList"
          border
          v-loading="bindDataListLoading"
          style="...">
          <el-table-column
            prop="exhibitionDbName"
            header-align="center"
            align="center"
            sortable
            label="展示数据库名称">
          </el-table-column>
          <el-table-column
            prop="exhibitionDbTable"
            header-align="center"
            align="center"
            sortable
            label="展示数据库表名称">
          </el-table-column>
          <el-table-column
            prop="exhibitionDbDept"
            header-align="center"
            align="center"
            sortable
            label="展示数据库归属部门">
          </el-table-column>
          <el-table-column
            prop="className"
            header-align="center"
            align="center"
            sortable
            label="数据类名称">
          </el-table-column>
          <el-table-column
            prop="dataClassDept"
            header-align="center"
            align="center"
            sortable
            label="数据类部门">
          </el-table-column>
          <el-table-column
            prop="useStatus"
            header-align="center"
            align="center"
            sortable
            label="使用状态">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('update')"
                         type="text"
                         size="small"
                         @click="dialogVisible = true"
                         :disabled="viewMode">状态
              </el-button>
              <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" append-to-body>
                <el-form ref="form" label-width="80px">
                  <el-form-item label="使用状态">
                    <el-select
                      v-model="scope.row.useStatus"
                      placeholder="请选择"
                      :disabled="viewMode">
                      <el-option
                        v-for="item in selectStatus"
                        :key="item.value"
                        :label="item.value"
                        :value="item.label">
                        {{item.value}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateStatus(classId,scope.row.exhibitionDbId,scope.row.useStatus)"
                   :disabled="viewMode">
          确 定</el-button>
      </span>
              </el-dialog>
              <el-button v-if="hasPermission('update')"
                         type="text"
                         size="small"
                         :disabled="viewMode"
                         @click="unbindDbInfo(classId,scope.row.exhibitionDbId)">解绑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-pagination-->
        <!--@size-change="sizeChangeHandle"-->
        <!--@current-change="currentChangeHandle"-->
        <!--:current-page="pageIndex"-->
        <!--:page-sizes="[10, 20, 50, 100]"-->
        <!--:page-size="pageSize"-->
        <!--:total="totalPage"-->
        <!--layout="total, sizes, prev, pager, next, jumper">-->
        <!--</el-pagination>-->
      </el-collapse-item>
      <!--      第二部分，库表记录-->
      <el-collapse-item title="展示数据库" name="3">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="...">
          <el-table-column
            prop="exhibitionDbDept"
            header-align="center"
            align="center"
            sortable
            label="部门">
          </el-table-column>
          <el-table-column
            prop="dbName"
            header-align="center"
            align="center"
            sortable
            label="数据库名称">
          </el-table-column>
          <el-table-column
            prop="dbCnName"
            header-align="center"
            align="center"
            sortable
            label="库全称">
          </el-table-column>
          <el-table-column
            prop="dbTable"
            header-align="center"
            align="center"
            sortable
            label="数据库表名称">
          </el-table-column>
          <el-table-column
            prop="tableCnName"
            header-align="center"
            align="center"
            sortable
            label="表全称">
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
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('update')"
                         type="text"
                         size="small"
                         :disabled="viewMode"
                         @click="bindDbInfo(classId, scope.row.id)">绑定
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
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
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

  export default {
    data() {
      return {
        viewMode: false,
        dialogVisible: false,
        selectStatus: [{
          value: '已使用',
          label: '1'
        }, {
          value: '未使用',
          label: '2'
        }, {
          value: '弃用',
          label: '3'
        }],
        classId: '',
        useStatus: '',
        // 展开的页面，默认展开一个
        activeNames: ['1'],
        // 这个参数就是控制是否显示当前页面
        visible: false,
        // 这里就是筛选条件里面的数据
        dataForm: {
          id: '',
          exhibitionDbDept: '',
          dbName: '',
          tableCnName: '',
          dbTable: '',
          dbCnName: '',
          updateFrequency: '',
          updateFrequencyValue: '',
          updateFrequencyUnit: ''
        },
        //绑定库表记录
        bindDataList: [],
        bindDataListLoading: false,
        //库表记录里面的数据
        dataList: [],
        //下面不管
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
      }
    },
    // watch 相当于监控某个数据， 这里监控了visible这个字段，就是上面控制是否显示当前页面的参数
    // 这里写watch, 是为了让关闭页面的时候把form里面的数据和展开条重置
    watch: {
      visible: function (val) {
        if (val) {
          this.activeNames = ['1']
          this.dataForm.id = ''
        }
      }
    },
    computed: {},
    components: {},
    activated() {
      this.getDataList()
    },
    mounted() {
      this.getPermission()
    },
    methods: {
      getDepts(parm) {
        this.deptName = parm
      },
      bindDbInfo(classId, exhibitionDbId) {
        // 下面先弹出一个选择框，让客户确定是否执行操作
        console.log("classId : " + classId + "exhibitionDbId" + exhibitionDbId)
        this.$confirm(`确定进行[绑定]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/data_class/class_exhibition_db_bind_info'),
            method: 'post',
            params: this.$http.adornParams({
              'classId': classId,
              'exhibitionDbId': exhibitionDbId,
              'useStatus': 1
            })
          }).then(({data}) => {
            if (data && data.successful) {
              console.log('SUCCESS', data)
              this.$message.success('操作成功')
              this.getBindInfo(this.classId)
              this.getDataList()
            } else {
              console.log('ERROR', data)
              this.$message.error('绑定操作失败')
            }
          })
        })
      },
      updateStatus(classId, exhibitionDbId, useStatus) {
        this.dialogVisible = false
        this.$http({
          url: this.$http.adornUrl('/data_class/class_exhibition_db_bind_info'),
          method: 'put',
          params: this.$http.adornParams({
            'classId': classId,
            'exhibitionDbId': exhibitionDbId,
            'useStatus': useStatus
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.getBindInfo(classId)
          } else {
            console.log('ERROR', data)
            this.$message.error('取绑定数据操作失败')
          }
        })
      },
      // 解除绑定所用函数
      unbindDbInfo(classId, exhibitionDbId) {
        this.$confirm(`确定进行[解绑]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/data_class/class_exhibition_db_bind_info'),
            method: 'delete',
            params: this.$http.adornParams({
              'classId': classId,
              'exhibitionDbId': exhibitionDbId
            })
          }).then(({data}) => {
            if (data && data.successful) {
              console.log('SUCCESS', data)
              this.$message.success('操作成功')
              this.getBindInfo(classId)
            } else {
              console.log('ERROR', data)
              this.$message.error('操作失败')
            }
          })
        })
      },
      //清空dbInfo这个数据里数据
      clearApiInfo() {
        this.apiInfo = {
          deptApiId: '',
          apiDept: '暂无',
          apiName: '暂无',
          apiFunction: '暂无',
          apiUrl: '暂无',
          apiNetworkType: '暂无'
        }
      },
      // 取得已经绑定的数据
      getBindInfo(classId) {
        this.bindDataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/data_class/class_exhibition_db_bind_info'),
          method: 'get',
          params: this.$http.adornParams({
            'classId': classId,
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.bindDataList = data.data
            this.bindDataListLoading = false
          } else {
            console.log('ERROR', data)
            this.$message.error('取绑定数据操作失败')
          }
        })
      },
      // 这个函数就是第一个页面调用的，调用了就把visible这个参数变为true, 然后当前这个页面就弹出来了
      initializing(classId, subType) {
        this.getPermission()
        this.visible = true
        this.activeNames = ['1']
        this.getBindInfo(classId)
        this.classId = classId
        this.getDataList()
        this.viewMode = subType === 'view' ? true : false
      },
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
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/exhibition_db/tables'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            // 在此处添加查询所需参数
            'exhibitionDbDept': this.dataForm.exhibitionDbDept,
            'dbName': this.dataForm.dbName,
            'dbCnName': this.dataForm.dbCnName,
            'dbTable': this.dataForm.dbTable,
            'tableCnName': this.dataForm.tableCnName,
            'updateFrequencyValue': this.dataForm.updateFrequencyValue,
            'updateFrequencyUnit': this.dataForm.updateFrequencyUnit,
            'classId': this.classId
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
    }
  }
</script>
