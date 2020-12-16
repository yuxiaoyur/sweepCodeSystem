<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <!--<el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <table-tree-column
        prop="title"
        header-align="center"
        treeKey="id"
        parentKey="pid"
        levelKey="moduleLevel"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="moduleDept"
        header-align="center"
        align="center"
        label="数据来源部门">
      </el-table-column>
      <el-table-column
        prop="dataAccessWay"
        header-align="center"
        align="center"
        label="数据接入方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dataAccessWay === '数据库库表'" size="small">库表</el-tag>
          <el-tag v-else-if="scope.row.dataAccessWay === '接口'" size="small" type="success">接口</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id, 'view')">
            查看
          </el-button>
          <el-button v-if="hasPermission('update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id,'update',scope.row.dataAccessWay === null ? '' : getTypeLabel(scope.row.dataAccessWay))">
            修改
          </el-button>
          <el-button v-if="hasPermission('delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './exhibition-modules-add-or-update'
  import {treeDataTranslate} from '@/utils'

  export default {
    data() {
      return {
        dataForm: {},
        dataList: [],
        deptName:[],
        permission: [],
        permissionVisible: {
          add: false,
          update: false,
          delete: false
        },
        dataListLoading: false,
        addOrUpdateVisible: false,
        bindModulesApiVisible: false,
        bindModulesDbVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated() {
      this.getDataList()
      this.getDataAccessWay()
      this.getDeptData()
    },
    mounted() {
      this.getPermission()
    },
    methods: {
      // 获取部门列表
      getDeptData() {
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
      // 获取接入方式类型
      getDataAccessWay() {
        this.$http({
          url: this.$http.adornUrl('/data_class/get_dict_type'),
          method: 'get',
          params: this.$http.adornParams({
            dictType: 'data_access_way'
          })
        }).then(({data}) => {
          if (data.successful) {
            this.radioDataAccessWay = data.data
          } else {
            console.log('ERROR', data)
          }
        })
      },
      //文件类型转化
      getTypeLabel (value) {
        var szie = this.radioDataAccessWay.length
        if(szie > 0) {
          for (var i = 0; i <= szie; i++) {
            if (value == this.radioDataAccessWay[i].value) {
              return this.radioDataAccessWay[i].label
            }
          }
        }
      },
      getPermission() {
        this.$http({
          url: this.$http.adornUrl('/sys/menuPermission'),
          method: 'get',
          params: this.$http.adornParams({menuId: this.$route.meta.menuId})
        }).then(({data}) => {
          this.permission = data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].split(":")[1]) {
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
      hasPermission(param) {
        switch (param) {
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
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/exhibition_layer/modules'),
          method: 'get',
          params: this.$http.adornParams({
            'page': '1',
            'size': '10',
            'title': this.title,
            'moduleDept': this.moduleDept,
            'dataAccessWay': this.dataAccessWay
          })
        }).then(({data}) => {
          if (data.successful) {
            this.dataList = treeDataTranslate(data.data, 'id', 'pid')
            this.dataListLoading = false
          } else {
            console.log('ERROR', data)
          }
        })
      },
      // 新增 / 修改 / 查看
      addOrUpdateHandle(id, subType, dataAccessWay) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initializing(id, subType, dataAccessWay)
          this.$refs.addOrUpdate.getAataAccessWay(this.radioDataAccessWay)
          this.$refs.addOrUpdate.getDepts(this.deptName)
        })
      },
      // 删除
      deleteHandle(id) {
        this.$confirm(`确定进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/exhibition_layer/module`),
            method: 'delete',
            params: this.$http.adornParams({id: id}, false)
          }).then(({data}) => {
            if (data.successful) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
              console.log('success', data)
            } else {
              console.log('ERROR', data)
              console.log(data)
              this.$message.error("操作失败")
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
