<template>
  <el-dialog
    :title="getActivet(dataForm.type)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="20%" :rules="rules">
      <el-form-item label="数据类名称" prop="className">
        <el-input v-model="dataForm.className" :disabled="viewDisable"></el-input>
      </el-form-item>
      <el-form-item label="数据类提供部门">
        <el-select v-model="dataForm.dataClassDeptId" filterable placeholder="请选择部门" clearable :disabled="viewDisable">
          <el-option
            v-for="item in deptName"
            :key="item.value"
            :label="item.value"
            :value="item.label">
            {{item.value}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提供方式" prop="provideWayId">
        <el-radio-group v-model="dataForm.provideWayId"
                        @change="onRadioChange"
                        :disabled="viewDisable">
          <el-radio
            v-for="item in dictFileType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            {{item.value}}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <div>
        <bind-class-dept-db
          v-if="bindClassDeptDbVisible &&(this.provideWayId == '1')"
          ref="bindClassDeptDb"
          @bindDeleteEvent="bindDelete"
          @bindUpdateEvent="bindUpdate">
        </bind-class-dept-db>

        <bind-class-dept-file
          v-if="bindClassDeptFileVisible && (this.provideWayId === '2')"
          ref="bindClassDeptFile"
          @bindDeleteEvent="bindDelete"
          @bindUpdateEvent="bindUpdate">
        </bind-class-dept-file>

        <bind-class-dept-other
          v-if="bindClassDeptOtherVisible &&(this.provideWayId == '3')"
          ref="bindClassDeptOther"
          @bindDeleteEvent="bindDelete"
          @bindUpdateEvent="bindUpdate">
        </bind-class-dept-other>
      </div>
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
  import ElCollapse from '../../../../../node_modules/element-ui/packages/collapse/src/collapse.vue'
  import BindClassDeptFile from './bind_class_dept_file.vue'
  import BindClassDeptOther from './bind_class_dept_other.vue'
  import BindClassDeptDb from './bind_class_dept_db.vue'

  export default {
    components: {
      ElCollapse,
      ElInput,
      ElFormItem,
      bindClassDeptFile: BindClassDeptFile,
      bindClassDeptOther: BindClassDeptOther,
      bindClassDeptDb: BindClassDeptDb
    },
    data() {
      return {
        // 当前进行的操作标示
        currentOpt: '',
        //默认展开“1”下拉框
        viewDisable: false,
        activeNames: ['1'],
        bindClassDeptFileVisible: false,
        bindClassDeptOtherVisible: false,
        bindClassDeptDbVisible: false,
        visible: false,
        dictFileType: [],
        deptName: [],
        provideWayId: '',
        classId: '',
        dataForm: {
          id: '',
          className: '',
          dataClassDept: '',
          provideWayId: '',
          type: '',
          srcId: '',
          deleteFlag: false,
          deleteSrcId: '',
          deleteProvideWay: ''
        },
        rules: {
          className: [
            {required: true, message: '请输入数据类名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          dataClassDept: [
            {required: true, message: '请输入数据类提供部门', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          provideWayId: [
            {required: true, message: '请选择提供方式', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      bindUpdate(srcId, deleteFlag) {
        this.dataForm.srcId = srcId
        this.dataForm.deleteFlag = deleteFlag
      },
      // 通过子组件emit中
      bindDelete(deletedFlag, srcId, provideWay) {
        this.dataForm.deleteFlag = deletedFlag
        this.dataForm.deleteSrcId = srcId
        this.dataForm.deleteProvideWay = provideWay
      },
      getActivet(type) {
        if (type == "add") {
          this.viewDisable = false
          return "新增"
        } else if (type == "update") {
          this.viewDisable = false
          return "修改"
        } else if (type == "view") {
          this.viewDisable = true
          return "查看"
        }
      },
      onRadioChange(value) {
        if (value == 1) {
          this.provideWayId = '1'
          this.bindClassDb(this.classId, value)
        } else if (value == 2) {
          this.provideWayId = '2'
          this.bindClassFile(this.classId, value)
        } else if (value == 3) {
          this.provideWayId = '3'
          this.bindClassOther(this.classId, value)
        }
      },
      bindClassDb(id, provideWayId) {
        this.bindClassDeptDbVisible = true
        this.$nextTick(() => {
          this.$refs.bindClassDeptDb.init(id, provideWayId)
          this.$refs.bindClassDeptDb.getViewDisable(this.viewDisable)
        })
      },
      bindClassFile(id, provideWayId) {
        this.bindClassDeptFileVisible = true
        this.$nextTick(() => {
          this.$refs.bindClassDeptFile.init(id, provideWayId)
          this.$refs.bindClassDeptFile.getViewDisable(this.viewDisable)
        })
      },
      bindClassOther(id, provideWayId) {
        this.bindClassDeptOtherVisible = true
        this.$nextTick(() => {
          this.$refs.bindClassDeptOther.init(id, provideWayId)
          this.$refs.bindClassDeptOther.getViewDisable(this.viewDisable)
        })
      },
      getClassType(provideWayId) {
        this.dictFileType = provideWayId
      },
      getDept(dept) {
        this.deptName = dept
      },
      initializing(id, subType, provideWayId) {
        this.visible = true
        this.classId = id
        this.provideWayId = provideWayId
        this.dataForm.type = subType
        this.currentOpt = subType
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/data_class/class'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                if (this.dataForm.dataClassDeptId == 0) {
                  this.dataForm.dataClassDeptId = null
                }
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
        })

        if (provideWayId == '1') {
          this.bindClassDb(id, provideWayId)
        } else if (provideWayId == '2') {
          this.bindClassFile(id, provideWayId)
        } else if (provideWayId == '3') {
          this.bindClassOther(id, provideWayId)
        }

      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/data_class/class`),
              method: this.currentOpt === 'add' ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'className': this.dataForm.className,
                'dataClassDeptId': this.dataForm.dataClassDeptId,
                'provideWayId': this.dataForm.provideWayId,
                // 如果是新增的时候传入了srcId, 就会把绑定信息一起插入
                'srcId': this.dataForm.srcId || undefined,
                // 通过子组件emit传递过来的值，如果deleteFlag为true, 就会进行解绑定操作
                'srcDeleteFlag': this.dataForm.deleteFlag,
                'deleteSrcId': this.dataForm.deleteSrcId,
                'deleteProvideWay': this.dataForm.deleteProvideWay
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
