<template>
  <el-dialog
    :title="whichType(dataForm.type)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="20%" :rules="rules">
      <el-form-item label="数据库名称" prop="dbName">
        <el-input v-model="dataForm.dbName"
                  :disabled="isView" ></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="dataForm.exhibitionDbDept"
                   allow-create
                   filterable
                   default-first-option
                   placeholder="请选择部门"
                   clearable
                   :disabled="isView">
          <el-option
            v-for="item in deptName"
            :key="item.moduleDept"
            :label="item.moduleDept"
            :value="item.moduleDeptId">
            {{item.moduleDept}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库表名称" prop="dbTable">
        <el-input v-model="dataForm.dbTable"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="更新周期" prop="updateFrequencyValue">
        <el-input v-model="dataForm.updateFrequencyValue"
                  style="width: 250px"
                  :disabled="isView">
          <el-select
            v-model="dataForm.updateFrequencyUnit"
            prop="updateFrequencyUnit"
            slot="append"
            placeholder="请选择单位"
            style="width: 120px"
            :disabled="isView">
            <el-option label="年" value="年"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="天" value="天" name="1"></el-option>
            <el-option label="小时" value="小时" name="2"></el-option>
            <el-option label="分" value="分" name="3"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 :disabled="isView">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ElFormItem from '../../../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input.vue'

  export default {

    computed:{
      isView : function () {
        return this.whichType(this.dataForm.type) === "查看" ? true : false
      }
    },
    components: {
      ElInput,
      ElFormItem
    },
    data () {
      return {
        visible: false,
        deptName:[],
        dataForm: {
          id: '',
          dbName: '',
          dbTable:'',
          dbCnName:'',
          exhibitionDbDept: '',
          tableCnName:'',
          updateFrequencyValue: '',
          updateFrequencyUnit:'',
          type:''
        },
        rules: {
          dbName: [
            {required: true, message: '请输入数据库名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          dbTable: [
            {required: true, message: '请输入数据库表名称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          dbCnName: [
            {required: true, message: '请输入库全称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          tableCnName: [
            {required: true, message: '请输入表全称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          updateFrequencyValue: [
            {required: true, message: '请输入更新周期', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          updateFrequencyUnit: [
            {required: true, message: '请', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      whichType(typeCode) {
        if (typeCode === 'add') {
          return "新增"
        } else if (typeCode === 'update') {
          return "修改"
        } else if (typeCode === 'view') {
          return "查看"
        }
      },
      getDept(dept){
        this.deptName = dept
      },
      initializing (id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (typeof (id) === 'number') {
            this.$http({
              url: this.$http.adornUrl('/exhibition_db/table'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                this.dataForm.type = subType
                this.dataForm.id = id
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            for (var i in this.dataForm) {
              this.dataForm[i] = ''
            }
            this.dataForm.provideWay = '库表'
          }
          this.dataForm.type = subType
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/exhibition_db/table`),
              method: this.dataForm.type === 'add' ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'exhibitionDbDeptId': this.dataForm.exhibitionDbDept,
                'dbName': this.dataForm.dbName,
                'dbTable': this.dataForm.dbTable,
                'updateFrequencyValue': this.dataForm.updateFrequencyValue,
                'updateFrequencyUnit': this.dataForm.updateFrequencyUnit,
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
      }
    }
  }
</script>
