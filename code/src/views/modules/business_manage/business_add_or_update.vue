<template>
  <el-dialog
    :title=" dataForm.type === 'add' ? '新增' : '修改'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">

    <el-collapse v-model="activeCollapse">
      <el-form :model="dataForm" ref="dataForm" label-width="15%" :rules="rules">
        <!--      前端信息-->
        <el-collapse-item name="1">
          <template slot="title">
            前端<i class="header-icon el-icon-edit"></i>
          </template>
          <el-form-item label="前端人员" prop="frontStaff">
            <el-input v-model="dataForm.frontStaff" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="前端更新时间" prop="frontUpdateTime">
            <el-input v-model="dataForm.frontUpdateTime" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="前端备注" prop="frontComment">
            <el-input v-model="dataForm.frontComment" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="板块" prop="project">
            <el-input v-model="dataForm.project" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="一级模块" prop="firstModule">
            <el-input v-model="dataForm.firstModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="二级模块" prop="secondModule">
            <el-input v-model="dataForm.secondModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="三级模块" prop="thirdModule">
            <el-input v-model="dataForm.thirdModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="四级模块" prop="fourthModule">
            <el-input v-model="dataForm.fourthModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="五级模块" prop="fifthModule">
            <el-input v-model="dataForm.fifthModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="六级模块" prop="sixthModule">
            <el-input v-model="dataForm.sixthModule" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="数据接口" prop="dataApiUrl">
            <el-input v-model="dataForm.dataApiUrl" placeholder="数据接口" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>

          <el-form-item label="数据接口类型">
            <el-radio-group v-model="dataForm.dataApiUrlType" v-bind:disabled="!hasFrontWrite">
              <el-radio label="1">数据接口</el-radio>
              <el-radio label="2">Http接口</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="地图接口" prop="gisApiUrl">
            <el-input v-model="dataForm.gisApiUrl" v-bind:disabled="!hasFrontWrite"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            后端<i class="header-icon el-icon-edit"></i>
          </template>
          <!--      后端信息-->
          <el-form-item label="后端人员" prop="backStaff">
            <el-input v-model="dataForm.backStaff" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="后端备注" prop="backComment">
            <el-input v-model="dataForm.backComment" placeholder="后端备注" v-bind:disabled="!hasBackWrite"></el-input>
          </el-form-item>

          <el-form-item label="后端更新时间" prop="backUpdateTime">
            <el-input v-model="dataForm.backUpdateTime" placeholder="设计更新时间" disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="后台方法" prop="javaMethod">
            <el-input v-model="dataForm.javaMethod" v-bind:disabled="!hasBackWrite"></el-input>
          </el-form-item>

          <el-form-item label="数据库表" prop="dbTable">
            <el-input v-model="dataForm.dbTable" v-bind:disabled="!hasBackWrite"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item name="3">
          <!--      设计信息-->
          <template slot="title">
            设计<i class="header-icon el-icon-edit"></i>
          </template>
          <el-form-item label="设计人员" prop="designStaff">
            <el-input v-model="dataForm.designStaff" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设计备注" prop="designComment">
            <el-input v-model="dataForm.designComment" placeholder="设计备注" v-bind:disabled="!hasDesignWrite"></el-input>
          </el-form-item>
          <el-form-item label="设计更新时间" prop="designUpdateTime">
            <el-input v-model="dataForm.designUpdateTime" placeholder="设计更新时间" disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="归管部门">
            <el-cascader
              ref="officeCascader"
              :options="officeOptions"
              v-model="dataForm.officeValues"
              v-bind:disabled="!hasDesignWrite"
              @change="handleChange"></el-cascader>
          </el-form-item>

          <el-form-item label="行业">
            <el-cascader
              ref="industryCascader"
              :options="options"
              v-model="dataForm.industryValues"
              v-bind:disabled="!hasDesignWrite"
              @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="业务描述" prop="businessDescription">
            <el-input v-model="dataForm.businessDescription" v-bind:disabled="!hasDesignWrite"></el-input>
          </el-form-item>
        </el-collapse-item>

        <!--      元数据信息-->
        <el-collapse-item name="4">
          <template slot="title">
            元数据<i class="header-icon el-icon-document"></i>
          </template>
          <el-form-item label="记录创建者" prop="createBy">
            <el-input v-model="dataForm.createBy" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="记录创建时间" prop="createDate">
            <el-input v-model="dataForm.createDate" placeholder="记录创建时间" disabled="true"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-form>

    </el-collapse>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        options: [],
        officeOptions: [],
        hasFrontWrite: false,
        hasEndWrite: false,
        hasDesignWrite: false,
        dataForm: {
          id: '',
          project: '',
          firstModule: '',
          secondModule: '',
          thirdModule: '',
          fourthModule: '',
          fifthModule: '',
          sixthModule: '',
          dataApiUrl: '',
          dataApiUrlType: '',
          gisApiUrl: '',
          javaMethod: '',
          dbTable: '',
          dbTableComment: '',
          officeValues: [],
          industryValues: [],
          businessDescription: '',
          frontStaff: '',
          frontComment: '',
          frontUpdateTime: '',
          backStaff: '',
          backComment: '',
          backUpdateTime: '',
          designStaff: '',
          designComment: '',
          designUpdateTime: '',
          createDate: '',
          createBy: '',
          type: ''
        },
        rules: {
          project: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          firstModule: [
            {required: true, message: '请输入一级模块名称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ],
          secondModule: [
            {required: true, message: '请输入二级模块名称', trigger: 'blur'},
            {min: 2, max: 66, message: '长度在 2 到 66 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      office: function () {
        return this.dataForm.officeValues[this.dataForm.officeValues.length - 1]
      },
      industry: function () {
        return this.dataForm.industryValues[this.dataForm.industryValues.length - 1]
      },
      activeCollapse: function () {
        if (this.hasFrontWrite && this.hasBackWrite && this.hasDesignWrite) {
          return ['1', '2', '3']
        } else if (this.hasFrontWrite) {
          return ['1']
        } else if (this.hasBackWrite) {
          return ['2']
        } else if (this.hasDesignWrite) {
          return ['3']
        }
      }
    },
    methods: {
      getDetailWritePermission () {
        this.$http({
          url: this.$http.adornUrl('/business_manage/getWritePermissions'),
          method: 'get'
        }).then(({data}) => {
          this.hasFrontWrite = data.data.hasFrontWrite
          this.hasBackWrite = data.data.hasBackWrite
          this.hasDesignWrite = data.data.hasDesignWrite
        })
      },
      initializing (id, subType) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id.length > 0) {
            this.$http({
              url: this.$http.adornUrl('/business_manage/find_by_id'),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.successful) {
                this.dataForm = data.data
                this.dataForm.industryValues = data.data.industryList
                this.dataForm.officeValues = data.data.officeList
              } else {
                console.log('ERROR', data)
                this.$message.error('操作失败')
              }
            })
          } else {
            for (var i in this.dataForm) {
              this.dataForm[i] = ''
            }
            this.dataForm.industryValues = []
            this.dataForm.officeValues = []
          }
          this.dataForm.type = subType
        })
      },
      initIndustryTreeSelect () {
        // 获取行业树形结构数据
        this.$http({
          url: this.$http.adornUrl('/business_manage/getIndustryTreeInfo'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.successful) {
            this.options = data.data
          } else {
            console.log('ERROR', data)
            this.$message.error('获取行业树形结构数据操作失败')
          }
        })

        // 获取行业树形结构数据结束
      },
      initOfficeTreeSelect () {
        // 获取所属部门树形结构数据
        this.$http({
          url: this.$http.adornUrl('/business_manage/getOfficeTreeInfo'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.successful) {
            this.officeOptions = data.data
          } else {
            console.log('ERROR', data)
            this.$message.error('获取所属部门树形结构数据操作失败')
          }
        })
        // 获取所属部门树形结构数据结束
      },
      // 表单提交
      dataFormSubmit (formName) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/business_manage/${this.dataForm.type === 'add' ? 'addRecord' : 'updateRecord'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'project': this.dataForm.project,
                'firstModule': this.dataForm.firstModule,
                'secondModule': this.dataForm.secondModule,
                'thirdModule': this.dataForm.thirdModule,
                'fourthModule': this.dataForm.fourthModule,
                'fifthModule': this.dataForm.fifthModule,
                'sixthModule': this.dataForm.sixthModule,
                'dataApiUrl': this.dataForm.dataApiUrl,
                'dataApiUrlType': this.dataForm.dataApiUrlType,
                'gisApiUrl': this.dataForm.gisApiUrl,
                'javaMethod': this.dataForm.javaMethod,
                'dbTable': this.dataForm.dbTable,
                'dbTableComment': this.dataForm.dbTableComment,
                'office': this.office,
                'industry': this.industry,
                'businessDescription': this.dataForm.businessDescription,
                'frontStaff': this.dataForm.frontStaff,
                'frontComment': this.dataForm.frontComment,
                'frontUpdateTime': this.dataForm.frontUpdateTime,
                'backStaff': this.dataForm.backStaff,
                'backComment': this.dataForm.backComment,
                'backUpdateTime': this.dataForm.backUpdateTime,
                'designStaff': this.dataForm.designStaff,
                'designComment': this.dataForm.designComment,
                'designUpdateTime': this.dataForm.designUpdateTime,
                'createDate': this.dataForm.createDate,
                'createBy': this.dataForm.createBy,
                'type': ''
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
      handleChange (value) {
        console.log(value)
      }
    }
  }
</script>
