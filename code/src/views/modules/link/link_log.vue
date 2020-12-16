<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.doneuser" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="doneuser"
        header-align="center"
        align="center"
        width="100"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="active"
        header-align="center"
        align="center"
        width="100"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="usepage"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="点击页面">
      </el-table-column>
      <el-table-column
        prop="linkurl"
        header-align="center"
        align="center"
        label="访问地址">
      </el-table-column>
      <el-table-column
        prop="activeip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="acttime"
        header-align="center"
        align="center"
        width="250"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="ispass"
        header-align="center"
        align="center"
        width="100"
        label="是否通过">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ispass == '1'" size="small">通过</el-tag>
          <el-tag v-else size="small" type="danger">未通过</el-tag>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          doneuser: '',
          active: '',
          usepage: '',
          linkurl: '',
          activeip: '',
          acttime: '',
          ispass: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/linklog/findlinklog'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'doneuser': this.dataForm.doneuser
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
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>
