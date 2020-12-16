<template>
  <el-dialog
    :title="getActivet(dataForm.type)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="20%" :rules="rules">
      <el-form-item label="接口名称" prop="apiName">
        <el-input v-model="dataForm.apiName" :disabled="viewDisable"></el-input>
      </el-form-item>
      <el-form-item label="数据类提供部门">
        <el-select v-model="dataForm.apiDeptId" filterable placeholder="请选择部门" clearable :disabled="viewDisable">
          <el-option
            v-for="item in deptName"
            :key="item.value"
            :label="item.value"
            :value="item.label">
            {{item.value}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口功能" prop="apiFunction">
        <el-input v-model="dataForm.apiFunction" :disabled="viewDisable"></el-input>
      </el-form-item>
      <el-form-item label="接口地址" prop="apiUrl">
        <el-input v-model="dataForm.apiUrl" :disabled="viewDisable"></el-input>
      </el-form-item>
      <el-form-item label="接口网络类型" prop="apiNetworkType">
        <el-radio-group v-model="dataForm.apiNetworkType" :disabled="viewDisable">
          <el-radio
            v-for="item in dictFileType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            {{item.value}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!this.viewDisable">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ElFormItem from 'element-ui/packages/form/src/form-item.vue'
  import ElInput from 'element-ui/packages/input/src/input.vue'

  export default {
    components: {
      ElInput,
      ElFormItem
    },
    data () {
      return {
        visible: false,
        dictFileType: [],
        viewDisable:false,
        deptName:[],
        dataForm: {
          id: '',
          apiName: '',
          apiDeptId:null,
          apiFunction: '',
          apiUrl: '',
          apiNetworkType: '',
          type:''
        },
        rules: {
          apiName: [
            {required: true, message: '请输入接口名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          apiFunction: [
            {required: true, message: '请输入接口功能', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          apiNetworkType: [
            {required: true, message: '请选择接口网络类型', trigger: 'change'}
          ],
          apiUrl: [
            {required: true, message: '请输入接口地址', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      getActivet(type){
        if(type == "add"){
          this.viewDisable = false
          return "新增"
        }else if(type == "update"){
          this.viewDisable = false
          return "修改"
        }else if(type == "view") {
          this.viewDisable = true
          return "查看"
        }
      },
      getDept(dept){
        this.deptName = dept
      },
      getRadio (prams) {
        this.dictFileType = prams
      },
      initializing (id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/dept_api_info/interface'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                this.dataForm.type = subType
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            for (var i in this.dataForm) {
              this.dataForm[i] = ''
            }
          }
          this.dataForm.type = subType
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dept_api_info/interface`),
              method: this.dataForm.type === 'add' ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'apiName': this.dataForm.apiName,
                'apiDeptId':this.dataForm.apiDeptId,
                'apiFunction': this.dataForm.apiFunction,
                'apiUrl': this.dataForm.apiUrl,
                'apiNetworkType': this.dataForm.apiNetworkType,
                'deleteFlag': '1'
              })
            }).then(({data}) => {
              if (data.successful) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>
