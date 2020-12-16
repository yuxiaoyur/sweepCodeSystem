<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="hasPermission('add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        width="150"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="realname"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="deptname"
        header-align="center"
        align="center"
        label="所属部门">
      </el-table-column>
      <el-table-column
        prop="lastlogintime"
        header-align="center"
        align="center"
        label="最后登录时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="getUserMenuOpt(scope.row.id)">查看权限</el-button>
          <el-button type="text" size="small" @click="getLinkRoleMenuOpt(scope.row.id)">链接权限</el-button>
          <el-button type="text" size="small" @click="handleOpenSjqx(scope.row)">数据权限</el-button>
          <el-button type="text" size="small" @click="handleOpenSxqx(scope.row)">属性权限</el-button>
          <el-button v-if="hasPermission('update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            修改
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
    <!-- 属性权限授权 -->
    <jsqxsq-sxqx :isShowSxqxDialog='isShowSxqxDialog' ref='usersxId'  @onClose='handleCloseSxqx("close-sxqx")' ></jsqxsq-sxqx>
    <!-- 数据权限授权 -->
    <jsqxsq-sjqx :isShowSjqxDialog='isShowSjqxDialog' ref='usersjId' @onClose='handleCloseSjqx("close-sjqx")'></jsqxsq-sjqx>  

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <user-menu-opt v-if="userMenuOptVisible" ref="userMenuOpt" @refreshDataList="getDataList"></user-menu-opt>
    <link-user-role v-if="linkUserRoleVisible" ref="linkUserRole" @refreshDataList="getDataList"></link-user-role>

  </div>
</template>

<script>
  import JsqxsqSxqx from './jsqxsq/sxqx'
  import JsqxsqSjqx from './jsqxsq/sjqx'
  //	import TableTreeColumn from '@/components/table-tree-column-dept'
  import AddOrUpdate from './user-add-or-update'
  import UserMenuOpt from './user-menu-opt'
  import LinkUserRole from './../link/role_link_list'
  import { treeDataTranslate } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          userName: ''
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
        addOrUpdateVisible: false,
        userMenuOptVisible: false,
        linkUserRoleVisible: false,

        isShowSjqxDialog:false,//数据权限授权弹窗
        isShowSxqxDialog:false//属性权限授权弹窗
      }
    },
    components: {
      addOrUpdate: AddOrUpdate,
      userMenuOpt: UserMenuOpt,
      linkUserRole: LinkUserRole,

      'jsqxsq-sxqx': JsqxsqSxqx,
      'jsqxsq-sjqx': JsqxsqSjqx,
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 查看部门系统链接权限
      getLinkRoleMenuOpt (id) {
        this.linkUserRoleVisible = true
        this.$nextTick(() => {
          this.$refs.linkUserRole.init(id)
        })
      },
      // 查看用户菜单权限
      getUserMenuOpt (id) {
        this.userMenuOptVisible = true
        this.$nextTick(() => {
          this.$refs.userMenuOpt.init(id)
        })

//      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
//        confirmButtonText: '确定',
//        cancelButtonText: '取消',
//        type: 'warning'
//      }).then(() => {
//
//      }).catch(() => {})
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/user/remove'),
            method: 'post',
            params: this.$http.adornParams({id: userIds.join(',')}, false)
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
      },


       //数据权限弹窗
      handleOpenSjqx(row){
        console.log(row)
        this.isShowSjqxDialog=true
        this.$refs.usersjId.handleClickSjqx({id:row.id,name:row.realname,type:"user"})
      },
      // 关闭
      handleCloseSjqx (key) {
        switch (key) {
          case 'close-sjqx': {
            this.isShowSjqxDialog = false
            break
          }
        }
      },
      //属性权限弹窗
      handleOpenSxqx(row){
        this.isShowSxqxDialog=true
        this.$refs.usersxId.handleClickSxqx({id:row.id,type:"user"})
      },
      // 关闭
      handleCloseSxqx (key) {
        switch (key) {
          case 'close-sxqx': {
            this.isShowSxqxDialog = false
            break
          }
        }
      },

    }
  }
</script>
