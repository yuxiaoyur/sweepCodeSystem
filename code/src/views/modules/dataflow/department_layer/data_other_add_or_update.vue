<template>
  <el-dialog
    :title="getActivet(dataForm.type)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="20%" :rules="rules">
      <el-form-item label="数据名称" prop="dataName">
        <el-input v-model="dataForm.dataName" :disabled="viewDisable"></el-input>
      </el-form-item>
      <el-form-item label="数据传输方式" prop="dataTransmissionType">
        <el-radio-group v-model="dataForm.dataTransmissionType" :disabled="viewDisable">
          <el-radio
            v-for="item in dictFileType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            {{item.value}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="更新周期" prop="updateFrequencyValue">
        <el-input v-model="dataForm.updateFrequencyValue" style="width: 250px" :disabled="viewDisable">
          <el-select v-model="dataForm.updateFrequencyUnit" prop="updateFrequencyUnit" slot="append" placeholder="请选择单位" style="width: 120px" :disabled="viewDisable">
            <el-option label="年" value="年"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="天" value="天"></el-option>
            <el-option label="小时" value="小时"></el-option>
            <el-option label="分" value="分"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!this.viewDisable">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ElFormItem from '../../../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input.vue'

  export default {

    components: {
      ElInput,
      ElFormItem
    },
    data () {
      return {
        visible: false,
        viewDisable: false,
        dictFileType:[],
        optionType:'',
        dataForm: {
          id: '',
          dataName: '',
          dataTransmissionType:'',
          updateFrequency: '',
          updateFrequencyValue: '',
          updateFrequencyUnit:''
        },
        rules: {
          dataName: [
            {required: true, message: '请输入数据名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          dataTransmissionType: [
            {required: true, message: '请选择提数据传输方式', trigger: 'change'}
          ],
          updateFrequencyValue: [
            {required: true, message: '请输入更新周期', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 1 到 66 个字符', trigger: 'blur'}
          ],
          updateFrequencyUnit: [
            {required: true, message: '请选择单位', trigger: 'change'}
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
      getRadio (prams) {
        this.dictFileType = prams
      },
      initializing (id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/data_other/document'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                this.optionType = subType
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
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/data_other/document`),
              method: this.dataForm.type === 'add' ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataName': this.dataForm.dataName,
                'dataTransmissionType': this.dataForm.dataTransmissionType,
                'updateFrequencyValue': this.dataForm.updateFrequencyValue,
                'updateFrequencyUnit': this.dataForm.updateFrequencyUnit,
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
      }
    }
  }
</script>
