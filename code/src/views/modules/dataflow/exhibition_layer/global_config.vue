<template>
  <div class="mod-mssq-rcfx">
    <el-form :inline="true" @keyup.enter.native="getData()">
        <el-form-item label="实时数据获取方式">
          <el-switch
            v-model="interfaceSwitch"
            :active-value=false
            :inactive-value=true
            @change="changeSwitch"
            active-text="缓存数据"
            inactive-text="融合平台接口">
          </el-switch>
        </el-form-item>
    </el-form>
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
//  import AddOrUpdateBusiness from './global_config_add_or_update.vue'

  export default {
    data() {
      return {
        interfaceSwitch:null,
        url:'',
        dataForm: {
        },
        dataList: [],
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
//      addOrUpdate: AddOrUpdateBusiness
    },
    activated() {
      this.getData()
    },
    mounted() {
      this.getPermission()
    },
    methods: {
      changeSwitch(value){
        this.getDataList()
        this.open()
      },
      open(){
        var content=''
        if(this.interfaceSwitch == false){
          content = "通过缓存数据";
        }else if(this.interfaceSwitch == true){
          content = "通过融合平台接口";
        }
          this.$alert(content, '实时数据获取方式', {
            confirmButtonText: '确定',
            showConfirmButton:  true,
            showClose:false,
            callback: action => {
//              this.$message({
//                type: 'info',
//                message: `action: ${ action }`
//              });
            }
          });
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
      hasPermission(param) {
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
      getDataList() {
        this.dataListLoading = true
        this.$http({
//          url: 'http://172.24.59.40:8848/nacos/v1/cs/configs/',
          url: this.$http.adornUrl('/nacos/v1/cs/configs/'),
//          url: 'http://10.1.232.153:8848/nacos/v1/cs/configs/',
          method: 'post',
          params: this.$http.adornParams({
            'dataId': 'globalProperties',
            'group': 'DEFAULT_GROUP',
            'content':'interfaceSwitch='+this.interfaceSwitch,
            'type':'properties'
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.dataList = data.data.list
            this.dataListLoading = false
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
      getData() {
        this.dataListLoading = true
        this.$http({
//          url: 'http://172.24.59.40:8848/nacos/v1/cs/configs/',
          url: this.$http.adornUrl('/nacos/v1/cs/configs/'),
//          url: 'http://10.1.232.153:8848/nacos/v1/cs/configs/',
          method: 'get',
          params: this.$http.adornParams({
            'dataId': 'globalProperties',
            'group': 'DEFAULT_GROUP'
          })
        }).then(({data}) => {
          if (data && data.successful) {
            this.interfaceSwitch = data.split('=')[1]
            this.getDataList()
            this.dataListLoading = false
          } else {
            console.log('ERROR', data)
            this.$message.error('操作失败')
          }
        })
      },
    }
  }
</script>
