<template>
<!-- 健康码数量变化趋势 -->
  <div class="qsxjkmtj-jkmchart-container">
      <p class="jkmchart-title"><span>XXX</span>截止<span>XXXX</span>，现有健康码实际用户<span>XXXX</span>人</p>
         <!-- @keyup.enter.native="" -->
        <el-form :inline="true" :model="searchForm"  ref="searchForm" @keyup.enter.native="getSearch" size="small" label-width="95px">
            <el-form-item label="区/县：" prop="areaList">
                <el-select style="width: 150px;"  v-model="searchForm.areaList" placeholder="" >
                    <el-option v-for="(item,index) in areaList" :key="index" :label="item.dataName" :value="item.dataCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="街道：" prop="streetList">
                <el-select style="width: 150px;"  v-model="searchForm.streetList" placeholder="" >
                    <el-option v-for="(item,index) in streetList" :key="index" :label="item.dataName" :value="item.dataCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="截止时间：" prop="endTime">
                <el-date-picker
                    style="width: 150px;" 
                    v-model="searchForm.endTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                >
                <!-- :picker-options="pickerOptions" -->
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" plain @click="getSearch">查 询</el-button>
                <el-button type="primary" size="small" plain @click="resetForm('searchForm')">重 置</el-button>
                <el-button type="primary" size="small" plain >数据导出</el-button>
            </el-form-item>
        </el-form>
        <div class="jkmchart-tu" v-loading="echarsLoading" id="jkmbtChart">

        </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() < Date.now();
            }
        },
        allRegion:[],//所有地址
        proList:[],	//所有省份list
        cityList:[],//所有城市
        areaList:[],//所有区县
        streetList:[],//所有街道
        searchForm: {
            areaList:[],//所有区县
            streetList:[],//所有街道
            endTime:""
        },
        dataRule: {
        },
        echartsdata:[{"date": "02-05","sw": 0,"qz": 5,"pcr": 0,"zy": 7},
                    {"date": "02-06","sw": 0,"qz": 5,"pcr": 0, "zy": 0},
                    {"date": "02-07","sw": 0,"qz": 5,"pcr": 0,"zy": 9},
                    {"date": "02-08","sw": 0,"qz": 7,"pcr": 0,"zy": 8},
                    {"date": "02-09","sw": 0,"qz": 11,"pcr": 0,"zy": 2},
                    {"date": "02-10","sw": 0,"qz": 3,"pcr": 0,"zy": 4},
                    {"date": "02-11","sw": 0,"qz": 1,"pcr": 0,"zy": 2}
                ],
        echarsLoading:false
     

      }
    },
    mounted () {
        this.getSearch()
        this.getPro()
        this.drawSorter();
    },
    methods:{
        getSearch () {
          this.echarsLoading=true
          let page="/dataPermission/getUserData"
          let params=this.searchForm
          this.$http({
            url: window.location.origin+"/src/data/" +"jkmcs"+".json",
            method: 'get'
            // url:this.$http.adornUrl(page),
            // method: 'get',
            // params: this.$http.adornParams(params)
          }).then(({data}) => {
            console.log(data)
            this.echarsLoading=false
            this.qsxjkmTable=data
            // if(data.successful){
            //   this.tableList = data.data.list
            //   this.totalPage = data.data.total
            //   this.echarsLoading = false
                // this.searchForm={
                //     areaList:[],//所有区县
                //     streetList:[],//所有街道
                //     endTime:""
                // }
            // }else{
            //     this.$message.error("系统异常，请与管理人员联系")
            // }
          })
        },

        //重置查询信息
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
               
        //获取省市区列表
        getPro(){
            this.$http({
                url: this.$http.adornUrl(`/meta/getMetaByTypeCode`),
                method: 'get',
                params: this.$http.adornParams({typeCode:'region'},false)
                }).then(({data}) => {
                    if(data.successful){
                        var result = [];
                        this.allRegion = data.data
                        for (var i = 0; i < this.allRegion.length; i++) {
                            if(this.allRegion[i].parentCode == '-1'){
                                result.push(this.allRegion[i])
                            }
                        }
                        this.proList = result
                        this.proChange("510000000000")//四川
                        this.cityChange("510100000000")//四川
                        console.log(this.proList )
                    }else{
                        console.log('ERROR',data)
                    }              
                })
        },
        //获取城市
        proChange(selVal){
      	    var result = []
      	    var parentId = ''
            //获取parentid
            for (var i = 0; i < this.allRegion.length; i++) {
                if(selVal == this.allRegion[i].dataCode){
                    parentId = this.allRegion[i].id
                    break
                }
            }
      	
            for (var i = 0; i < this.allRegion.length; i++) {
                if(parentId == this.allRegion[i].parentCode){
                    result.push(this.allRegion[i])
                }
            }
            this.cityList = result
        },
        //获取区县
        cityChange(selVal){
            var result = []
            var parentId = ''
            //获取parentid
            for (var i = 0; i < this.allRegion.length; i++) {
                if(selVal == this.allRegion[i].dataCode){
                    parentId = this.allRegion[i].id
                    break
                }
            }
            console.log(parentId)
            for (var i = 0; i < this.allRegion.length; i++) {
                if(parentId == this.allRegion[i].parentCode){
                    result.push(this.allRegion[i])
                }
            }
            console.log(result)
            this.areaList = result
            
        },

        //柱图
        drawSorter () {
            let SorterEcharts = echarts.init(document.getElementById('jkmbtChart'))
            SorterEcharts.clear()
            var date = [];
            var value1 = [];
            for (var i = 0; i < this.echartsdata.length; i++) {
                date.push(this.echartsdata[i].date);
                value1.push(this.echartsdata[i].qz);
            }
             var option = {
                // backgroundColor: '#fff',
                grid: {
                    top: "25%",
                    bottom: "10%"//也可设置left和right设置距离来控制图表的大小
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        label: {
                            show: true
                        }
                    },
                    textStyle:{
                        color:"#fff",
                        fontSize:14
                    }
                },
                legend: {
                    data: ["健康码数量（万）", "增幅"],
                    selectedMode:false,//取消图例上的点击事件
                    top: "15%",
                    textStyle: {
                        color: "#a6b5d2"
                    }
                },
                xAxis: {
                    data:date,
                    axisLine: {
                        show: true, //隐藏X轴轴线
                        textStyle: {
                            fontSize:14
                        },
                        color:'#a6b5d2'
                    },
                    axisTick: {
                        show: true //隐藏X轴刻度
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color:'#a6b5d2'
                        }
                    },
                    
                },
                yAxis: [{
                        type: "value",
                        // name: "亿元",
                        nameTextStyle: {
                            color:'#a6b5d2',
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: true
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color:'#a6b5d2',
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color:'#a6b5d2',
                            }
                        },
                        
                    },
                    {
                        type: "value",
                        // name: "同比",
                        nameTextStyle: {
                            color: "#ebf8ac"
                        },
                        position: "right",
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color:'#a6b5d2',
                            }
                        },
                        axisLabel: {
                            show: true,
                            formatter: "{value} %", //右侧Y轴文字显示
                            textStyle: {
                                color: "#a6b5d2"
                            }
                        }
                    },
                    {
                        type: "value",
                        gridIndex: 0,
                        min: 50,
                        max: 100,
                        splitNumber: 8,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitArea: {
                            show: true,
                            areaStyle: {
                                color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
                            }
                        }
                    }
                ],
                series: [{
                        name: "增幅",
                        type: "line",
                        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
                        smooth: true, //平滑曲线显示
                        showAllSymbol: true, //显示所有图形。
                        symbol: "circle", //标记的图形为实心圆
                        symbolSize: 10, //标记的大小
                        itemStyle: {
                            //折线拐点标志的样式
                            color: "#058cff"
                        },
                        lineStyle: {
                            color: "#058cff"
                        },
                        areaStyle:{
                            color: "rgba(5,140,255, 0.2)"
                        },
                        data:value1
                    },
                    {
                        name: "健康码数量（万）",
                        type: "bar",
                        barWidth: 15,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: "#00FFE3"
                                    },
                                    {
                                        offset: 1,
                                        color: "#4693EC"
                                    }
                                ])
                            }
                        },
                        data: value1
                    }
                ]
            };
            SorterEcharts.setOption(option)
        }
    }
  }
</script>

<style lang="scss" scoped>
  .qsxjkmtj-jkmchart-container {
      .jkmchart-title {
          color: #17B3A3;
          font-size: 16px;
          line-height: 30px;
          border-bottom: 1px solid #c1c1c1;
          margin-bottom: 30px;
      }

      .jkmchart-tu {
          width: 100%;
          height: 350px;
      }
    
  }

</style>
