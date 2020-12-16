<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="已绑定库表" name="1">
      <el-row>
        <el-col :span="1">
          接口名称:
        </el-col>
        <el-col :span="3">
          <el-tag type="success">{{apiInfo.apiName}}</el-tag>
        </el-col>

        <el-col :span="2">
          数据类提供部门:
        </el-col>
        <el-col :span="3">
          <el-tag type="success">{{apiInfo.apiDept}}</el-tag>
        </el-col>

        <el-col :span="1">
          接口功能:
        </el-col>
        <el-col :span="3">
          <el-tag type="success">{{apiInfo.apiFunction}}</el-tag>
        </el-col>

        <el-col :span="1">
          接口路径:
        </el-col>
        <el-col :span="3">
          <el-tag type="success">{{apiInfo.apiUrl}}</el-tag>
        </el-col>

        <el-col :span="1">
          接口网络类型:
        </el-col>
        <el-col :span="3">
          <el-tag type="success">{{apiInfo.apiNetworkType}}</el-tag>
        </el-col>

        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="unbindDbInfo(apiInfo.apiId,dataAccessWay)">
        </el-button>
      </el-row>
    </el-collapse-item>
    <!--      第二部分， 筛选条件-->
    <el-collapse-item title="筛选条件" name="2">
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
                  v-for="item in networkType"
                  :key="item.value"
                  :label="item.value"
                  :value="item.label">
                  {{item.value}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <!--      第三部分，库表记录-->
    <el-collapse-item title="接口记录" name="3">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
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
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('update')" type="text" size="small"
                       @click="bindDbInfo(moduleId, scope.row.id, dataAccessWay, scope.row)">绑定
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
        // 已经绑定库表 这个标签的数据
        moduleId: '',
        dataAccessWay: '',
        deptName: [],
        networkType: [],
        apiInfo: {
          apiId: '',
          deptApiId: '',
          apiDept: '暂无',
          apiName: '暂无',
          apiFunction: '暂无',
          apiUrl: '暂无',
          apiNetworkType: '暂无'
        },
        // 展开的页面，默认展开一个，collapse里面有个参数叫name, 这里就是对应的
        activeNames: ['1'],
        // 这个参数就是控制是否显示当前页面
        visible: false,
        // 这里就是筛选条件里面的数据
        dataForm: {
          id: '',
          apiName: '',
          apiDept: '',
          apiDeptId: '',
          apiFunction: '',
          apiUrl: '',
          apiNetworkType: ''
        },
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
          this.clearApiInfo()
        }
      }
    },
    computed: {
      hasDataFlag: function () {
        return this.apiInfo.apiName !== '暂无' ? true : false
      }
    },
    components: {},
    activated() {
      this.getDataList()
    },
    mounted() {
      this.getPermission()
    },
    methods: {
      setBindDeleteEvent(srcId, dataAccessWay) {
        this.$emit('bindDeleteEvent', this.hasDataFlag, srcId, dataAccessWay)
      },
      getDepts(parm) {
        this.deptName = parm
      },
      bindDbInfo(moduleId, srcId, dataAccessWay, srcBody) {
        // 下面先弹出一个选择框，让客户确定是否执行操作
        if (this.apiInfo.apiName !== '暂无') {
          this.$message({
            message: '请先进行解绑',
            type: 'warning'
          })
        } else {
          this.$confirm(`确定进行[绑定]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.apiInfo = srcBody
            this.$emit("bindUpdateEvent", this.apiInfo.id, false)
          })
        }
      },
      // 解除绑定所用函数
      unbindDbInfo(srcId, dataAccessWay) {
        // todo 这里需要一个确认符号

        if (this.apiInfo.apiName === '暂无' || this.apiInfo === undefined) {
          this.$message({
            message: '您还没进行绑定',
            type: 'warning'
          });
        } else {
          this.$confirm(`确定进行[解绑]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.setBindDeleteEvent(srcId, dataAccessWay)
            this.clearApiInfo()
          })
        }
      },
      //清空dbInfo这个数据里数据
      clearApiInfo() {
        this.apiInfo = {
          apiId: '',
          deptApiId: '',
          apiDept: '暂无',
          apiName: '暂无',
          apiFunction: '暂无',
          apiUrl: '暂无',
          apiNetworkType: '暂无'
        }
      },
      // 取得已经绑定的数据
      getBindInfo(moduleId, dataAccessWay) {
        this.$http({
          url: this.$http.adornUrl('/exhibition_layer/bind_info'),
          method: 'get',
          params: this.$http.adornParams({
            'moduleId': moduleId,
            'dataAccessWay': dataAccessWay
          })
        }).then(({data}) => {
          if (data && data.successful) {
            if (data.data === null) {
              this.clearApiInfo()
            } else {
              this.apiInfo = data.data
            }
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
      // 获取接口网络类型
      getApiNetworkType() {
        this.$http({
          url: this.$http.adornUrl('/data_class/get_dict_type'),
          method: 'get',
          params: this.$http.adornParams({
            dictType: 'api_network_type'
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.networkType = data.data
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
      // 这个函数就是第一个页面调用的，调用了就把visible这个参数变为true, 然后当前这个页面就弹出来了
      init(moduleId, dataAccessWay) {
        this.visible = true
        this.activeNames = ['1']
        this.clearApiInfo()
        this.dataForm = {
          id: '',
          apiName: '',
          apiDept: '',
          apiDeptId: '',
          apiFunction: '',
          apiUrl: '',
          apiNetworkType: ''
        }
        // 获取列表数据
        this.getDataList()
        this.getApiNetworkType()
        // 获取已经绑定的数据
        console.log("部门接口初始化 moduleID是什么 " + moduleId)
        console.log("部门接口初始化 moduleID是什么 " + typeof moduleId)
        if (!isNaN(moduleId)) {
          this.getBindInfo(moduleId, dataAccessWay)
        }
        this.moduleId = moduleId
        this.dataAccessWay = dataAccessWay

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
      // 获取数据列表
      filterList() {
        this.getDataList();
        this.activeNames.push('3')
      },
      getDataList() {
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
