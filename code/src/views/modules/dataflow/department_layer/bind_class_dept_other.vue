<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="已绑定库表" name="1">
      <el-form :inline="true" :model="otherInfo" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="2">数据类名称:</el-col>
          <el-col :span="3">
            <el-tag type="success">{{otherInfo.dataName}}</el-tag>
          </el-col>

          <el-col :span="3">数据传输方式:</el-col>
          <el-col :span="3">
            <el-tag type="success">{{otherInfo.dataTransmissionType}}</el-tag>
          </el-col>

          <el-col :span="2">更新周期:</el-col>
          <el-col :span="3">
            <el-tag type="success">{{otherInfo.updateFrequency}}</el-tag>
          </el-col>

          <el-button type="danger" icon="el-icon-delete" circle @click="unbindDbInfo(otherInfo.srcId,provideWay)"
                     v-if="!viewDisable"></el-button>
        </el-row>
      </el-form>
    </el-collapse-item>
    <!--      第二部分， 筛选条件-->
    <el-collapse-item title="筛选条件" name="2" v-if="!viewDisable">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.dataName" placeholder="数据类名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="dataForm.dataTransmissionType" placeholder="数据传输方式" clearable>
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
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="dataForm.updateFrequencyValue" placeholder="更新周期" clearable>
                <el-select v-model="dataForm.updateFrequencyUnit" slot="append" placeholder="单位" style="width: 75px"
                           clearable>
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
            <el-button @click="filterList()">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-collapse-item>
    <!--      第三部分，库表记录-->
    <el-collapse-item title="库表记录" name="3" v-if="!viewDisable">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="...">
        <el-table-column
          prop="dataName"
          header-align="center"
          align="center"
          sortable
          label="数据类名称">
        </el-table-column>
        <el-table-column
          prop="dataTransmissionType"
          header-align="center"
          align="center"
          sortable
          label="数据传输方式">
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
            <el-button v-if="hasPermission('update')" type="text" size="small"
                       @click="bindOtherInfo(classId, scope.row.id, provideWay, scope.row)">绑定
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
  import ElForm from '../../../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    data() {
      return {
        viewDisable: false,
        //数据传输方式
        accessMethodOptions: [],
        // 已经绑定库表 这个标签的数据
        classId: '',
        //获取点击那条信息的提供方式字段
        provideWay: '',
        otherInfo: {
          srcId: '',
          dataName: '暂无',
          dataTransmissionType: '暂无',
          updateFrequencyValue: '暂无',
          updateFrequencyUnit: '暂无'
        },
        // 展开的页面，默认展开一个，collapse里面有个参数叫name, 这里就是对应的
        activeNames: ['1'],
        // 这个参数就是控制是否显示当前页面
        visible: false,
        // 这里就是筛选条件里面的数据
        dataForm: {
          id: '',
          dataName: '',
          dataTransmissionType: '',
          updateFrequency: '',
          updateFrequencyValue: '',
          updateFrequencyUnit: ''
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
          this.otherInfo = {
            srcId: '',
            dataName: '暂无',
            dataTransmissionType: '暂无',
            updateFrequencyValue: '暂无',
            updateFrequencyUnit: '暂无'
          }
        }
      }
    },
    computed: {
      hasDataFlag: function () {
        return this.otherInfo.dataName !== '暂无' ? true : false
      }
    },
    components: {ElForm},
    activated() {
      this.getDataList()
    },
    mounted() {
      this.getPermission()
      this.getDictType()
    },
    methods: {
      setBindDeleteEvent(srcId, provideWay) {
        this.$emit('bindDeleteEvent', this.hasDataFlag, srcId, provideWay)
      },
      getViewDisable(prams) {
        this.viewDisable = prams
        console.log("this.viewDisable" + this.viewDisable)
      },
      // 获取文件类型
      getDictType() {
        this.$http({
          url: this.$http.adornUrl('/data_class/get_dict_type'),
          method: 'get',
          params: this.$http.adornParams({
            dictType: 'data_transmission_type'
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
      //绑定（classId：数据类管理页面id, srcId：其他文件数据信息管理页面id, provideWay: 数据类管理页面文件类型）
      bindOtherInfo(classId, srcId, provideWay, srcBody) {
        // 下面先弹出一个选择框，让客户确定是否执行操作
        if (this.otherInfo.dataName !== '暂无') {
          this.$message({
            message: '请先进行解绑',
            type: 'warning'
          });
        } else {
          this.$confirm(`确定进行[绑定]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.otherInfo = srcBody
            this.$emit("bindUpdateEvent", srcId, false)
          })
        }
      },
      // 解除绑定所用函数
      unbindDbInfo(id, provideWay) {
        // todo 这里需要一个确认符号
        if (this.otherInfo.dataName === '暂无' || this.otherInfo === undefined) {
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
            // 向父组件传递已经解除绑定信息
            this.setBindDeleteEvent(id, provideWay)
            this.otherInfo = {
              srcId: '',
              dataName: '暂无',
              dataTransmissionType: '暂无',
              updateFrequencyValue: '暂无',
              updateFrequencyUnit: '暂无'
            }
          })
        }
      },
      // 取得已经绑定的数据
      getBindInfo(id, provideWay) {
        this.$http({
          url: this.$http.adornUrl('/data_class/bind_info'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id,
            'provideWay': provideWay

          })
        }).then(({data}) => {
          if (data && data.successful) {
            if (data.data === null) {
              this.otherInfo = {
                srcId: '',
                dataName: '暂无',
                dataTransmissionType: '暂无',
                updateFrequencyValue: '暂无',
                updateFrequencyUnit: '暂无'
              }
            } else {
              this.otherInfo = data.data
              // 向父组件传递已经解除绑定信息
              this.setFatherBindFlag()
            }
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
      // 这个函数就是第一个页面调用的，调用了就把visible这个参数变为true, 然后当前这个页面就弹出来了
      init(id, type) {
        this.viewDisable = false
        this.visible = true
        this.activeNames = ['1']
        this.dataForm = {
          id: '',
          dataName: '',
          dataTransmissionType: '',
          updateFrequency: '',
          updateFrequencyValue: '',
          updateFrequencyUnit: ''
        },
          this.otherInfo = {
            srcId: '',
            dataName: '暂无',
            dataTransmissionType: '暂无',
            updateFrequencyValue: '暂无',
            updateFrequencyUnit: '暂无'
          }
        // 获取列表数据
        this.getDataList()
        // 获取已经绑定的数据
        if (!isNaN(id)) {
          this.getBindInfo(id, type)
        }
        this.classId = id
        this.provideWay = type
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
        this.$http({
          url: this.$http.adornUrl('/data_other/documents'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            // 在此处添加查询所需参数
            'dataName': this.dataForm.dataName,
            'dataTransmissionType': this.dataForm.dataTransmissionType,
            'updateFrequency': this.dataForm.updateFrequency,
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
