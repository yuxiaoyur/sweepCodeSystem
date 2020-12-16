<template>
  <el-dialog
    :title="whichType(typeCode)"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" ref="dataForm" label-width="15%" :rules="rules">
      <el-form-item label="模块名称" prop="title">
        <el-input v-model="dataForm.title"
                  :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="模块筛选">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          :disabled="isView">
        </el-input>
      </el-form-item>
      <el-form-item
        label="上级模块"
        :disabled="isView">
        <el-tree
          class="filter-tree"
          :data="modulesTreeInfo"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          highlight-current
          accordion
          node-key="id"
          :default-expanded-keys="treeExpandKeys"
          :default-checked-keys="treeCheckedKeys"
          show-checkbox
          check-strictly
          @check="setTreeKey">
        </el-tree>
      </el-form-item>
      <el-form-item label="数据来源部门">
        <el-select v-model="dataForm.moduleDeptId"
                   allow-create
                   filterable
                   default-first-option
                   placeholder="请选择部门"
                   clearable
                   :disabled="isView">
          <el-option
            v-for="item in deptName"
            :key="item.value"
            :label="item.value"
            :value="item.label">
            {{item.value}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据接入方式" prop="dataAccessWay">
        <el-radio-group
          v-model="dataForm.dataAccessWay"
          :disabled="isView"
          @change="onRadioChange">
          <el-radio
            v-for="item in radioDataAccessWay"
            :key="item.value"
            :label="item.label">
            {{item.value}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="this.dataAccessWay !== '3'">

        <bind-modules-dept-api
          v-if="bindModulesApiVisible &&(this.dataAccessWay == '2')"
          ref="bindModulesDeptApi"
          @bindDeleteEvent="bindDelete"
          @bindUpdateEvent="bindUpdate">
        </bind-modules-dept-api>

        <bind-modules-db
          v-if="bindModulesDbVisible &&(this.dataAccessWay == '1')"
          ref="bindModulesDb"
          @bindDeleteEvent="bindDelete"
          @bindUpdateEvent="bindUpdate">
        </bind-modules-db>

      </div>
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
  import BindModulesDeptApi from './bind-modules-dept-api'
  import BindModulesDb from './bind-modules-db'

  export default {
    data() {
      return {
        deptName: [],
        dataAccessWay: '',
        radioDataAccessWay: [],
        treeExpandKeys: [],
        treeCheckedKeys: [],
        filterText: '',
        visible: false,
        typeCode: false,
        bindModulesApiVisible: false,
        bindModulesDbVisible: false,
        moduleId: '',
        dataForm: {
          id: '',
          pid: '',
          title: '',
          moduleDept: '',
          moduleDeptId: '',
          moduleLevel: '',
          dataAccessWay: '',
          srcId: '',
          deleteFlag: false,
          deleteSrcId: '',
          deleteDataAccessWay: ''
        },
        modulesTreeInfo: [],
        defaultProps: {
          children: 'children',
          label: 'title',
        },
        rules: {
          title: [
            {required: true, message: '请输入模块名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          moduleDept: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          dataAccessWay: [
            {required: true, message: '请选择数据接入方式', trigger: 'change'}
          ]
        }
      }
    },
    components: {
      bindModulesDeptApi: BindModulesDeptApi,
      bindModulesDb: BindModulesDb
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
      // 如果关闭页面，即清空已有数据
      visible(val) {
        if (val === false) {
          for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
            this.$refs.tree.store._getAllNodes()[i].expanded = false;
          }
          this.treeExpandKeys = []
          this.treeCheckedKeys = []
          this.filterText = ''
          this.$refs['dataForm'].resetFields()
        }
      }
    },
    computed: {
      isView: function () {
        return this.whichType(this.typeCode) === "查看" ? true : false
      }
    },
    mounted() {
    },
    methods: {
      bindUpdate(srcId, deleteFlag) {
        this.dataForm.srcId = srcId
        this.dataForm.deleteFlag = deleteFlag
        console.log("父组件 bindUpdate -> srcId : " + srcId + " deleteFlag : " + deleteFlag)
      },
      // 通过子组件emit中
      bindDelete(deletedFlag, srcId, dataAccessWay) {
        console.log("父组件 bindDelete  -> deleteFlag : " + deletedFlag + " srcId: " + srcId + " dataAccessWay: " + dataAccessWay)
        this.dataForm.deleteFlag = deletedFlag
        this.dataForm.deleteSrcId = srcId
        this.dataForm.deleteDataAccessWay = dataAccessWay
      },
      onRadioChange(value) {
        if (value == '1') {
          this.dataAccessWay = '1'
          this.bindDb(this.moduleId, value)
        } else if (value == '2') {
          this.dataAccessWay = '2'
          this.bindInterface(this.moduleId, value)
        } else if (value == '3') {
          this.dataAccessWay = '3'
        }
      },
      getDepts(parm) {
        this.deptName = parm
      },
      getAataAccessWay(way) {
        this.radioDataAccessWay = way
      },
      bindDb(id, dataAccessWay) {
        this.bindModulesDbVisible = true
        this.$nextTick(() => {
          this.$refs.bindModulesDb.init(id, dataAccessWay)
          this.$refs.bindModulesDb.getDepts(this.deptName)
          console.log("Db部门信息：：：：：：：：："+this.deptName)
        })
      },
      bindInterface(id, dataAccessWay) {
        this.bindModulesApiVisible = true
        this.$nextTick(() => {
          this.$refs.bindModulesDeptApi.init(id, dataAccessWay)
          this.$refs.bindModulesDeptApi.getDepts(this.deptName)
          console.log("api部门信息：：：：：：：：："+this.deptName)
        })
      },
      whichType(typeCode) {
        if (typeCode === 'add') {
          return "新增"
        } else if (typeCode === 'update') {
          return "修改"
        } else if (typeCode === 'view') {
          return "查看"
        }
      },
      // 注意这里的title需要和目标筛选的值进行一个匹配
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      // 初始化页面数据
      initializing(id, typeCode, dataAccessWay) {
        this.visible = true
        this.moduleId = id
        this.dataAccessWay = dataAccessWay
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id !== undefined) {
            this.$http({
              url: this.$http.adornUrl('/exhibition_layer/module'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                let expandIndex = Number(this.dataForm.pid)
                let checkedIndex = Number(this.dataForm.pid)
                this.treeExpandKeys = [expandIndex]
                this.$refs.tree.setCheckedKeys([checkedIndex])
              } else {
                this.$message.error('操作失败')
              }
            })
          }
          this.typeCode = typeCode
        })
        if (dataAccessWay == '1') {
          this.bindDb(id, dataAccessWay)
        } else if (dataAccessWay == '2') {
          this.bindInterface(id, dataAccessWay)
        }
        this.$http({
          url: this.$http.adornUrl('/exhibition_layer/get_modules_tree'),
          method: 'get',
        }).then(({data}) => {
          if (data && data.successful) {
            this.modulesTreeInfo = data.data
          } else {
            this.$message.error('获取树形结构操作失败')
          }
        })
      },
      // 设置树选中节点，只能选中一个节点, 如果当前为查看模式，则不能更改
      setTreeKey(data, status) {
        // 查看模式不能选
        if (this.whichType(this.typeCode) === "查看") {
          this.$message({
            message: '查看模式下不能进行节点选取',
            type: 'warning'
          })
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.tree.setCheckedKeys([this.dataForm.pid])
          // 非查看模式可以选，但是不能选自己
        } else {
          if (data.title == this.dataForm.title) {
            this.$message({
              message: '请选择其他节点进行挂载, 当前节点选中已重置',
              type: 'warning'
            })
            this.$refs.tree.setCheckedKeys([]);
            this.$refs.tree.setCheckedKeys([data.pid])
          } else {
            // 先清空，再选择
            this.$refs.tree.setCheckedKeys([]);
            this.$refs.tree.setCheckedKeys([data.id])
            this.dataForm.pid = data.id
          }
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/exhibition_layer/module`),
              method: this.whichType(this.typeCode) === "修改" ? 'put' : 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'pid': this.dataForm.pid,
                'title': this.dataForm.title,
                'moduleDeptId': this.dataForm.moduleDeptId,
                'dataAccessWay': this.dataForm.dataAccessWay,
                'srcId': this.dataForm.srcId || undefined,
                // 通过子组件emit传递过来的值，如果deleteFlag为true, 就会进行解绑定操作
                'srcDeleteFlag': this.dataForm.deleteFlag,
                'deleteSrcId': this.dataForm.deleteSrcId,
                'deleteDataAccessWay': this.dataForm.deleteDataAccessWay
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
