<template>
    <div>
        <CRow>
            <CCol lg = '12' class="pt-2">
                <div class="card-h">
                    <CCardBody class="mr-1 mb-1 h-100">
                        <h4 style="color:#8c5c7d" class="card-font"><CIcon name="cil-chart-line" size="lg"/> {{AnalysisData.name}}</h4>
                        <hr class="mt-0 mb-2">
                        <CRow>
                            <CCol lg = '3' class="pt-2">
                                <h4 class="card-font">時間區間 : 
                                    <CButton v-bind="classColor['Y']" @click="switch_mode('year')">年</CButton>
                                    <CButton v-bind="classColor['M']" @click="switch_mode('month')">月</CButton> 
                                </h4>
                                <CSelect
                                    :value.sync="AnalysisData.year"
                                    :options="AnalysisData.yearList"
                                    class="mr-2"
                                    v-if="AnalysisData.analysisMode==='year'"
                                />
                                <CInput
                                    type="month"
                                    class="mr-2"
                                    v-model="AnalysisData.date"
                                    max="2021-09"
                                    v-if="AnalysisData.analysisMode==='month'"
                                />
                            </CCol>
                            <CCol lg = '3' class="pt-2">
                                <h2 class="card-font">區域 :</h2>
                                <CSelect
                                    type="date"
                                    class="mr-2"
                                    :value.sync="factory"
                                    :options="factoryOptions"
                                />
                            </CCol>
                            <CCol lg = '3' class="pt-4">
                                <CButton
                                    color="success"
                                    size="lg"
                                    @click="select_chart_data()"
                                >
                                <CIcon size="xl" name="cilZoom"/>
                                    搜尋
                                </CButton>
                            </CCol>
                            <CCol lg = '3' class="pt-2" />
                        </CRow>
                    </CCardBody>
                </div>
            </CCol>

            <CCol lg = '6' class="pt-2">
                <div class="card-h h-100">
                    <CCardBody>
                        <h3 style="color:#8c5c7d"  class="card-font"><CIcon name="cil-chart-pie" size="lg"/> 圖表數據</h3>
                        <CRow>
                            <CCol lg = '12' class="pt-2">
                                <div id="analysisChart" style = "width: 38vw;height:60vh"/>
                            </CCol>
                            <CCol lg = '12' class="pt-2">
                                <CRow>
                                    <CCol lg = '6'>
                                        <CCallout color="info">
                                            <small class="text-muted"><CIcon name="cil-industry" style="color:#3399FF"/> 分類</small><br>
                                            <strong class="h4">{{AnalysisData.sort}}</strong>
                                        </CCallout>
                                    </CCol>
                                    <CCol lg = '6'>
                                        <CCallout color="success">
                                            <small class="text-muted"><CIcon name="cil-check-circle" style="color:green"/> {{AnalysisData.analysisSort}}</small><br>
                                            <strong class="h5">{{AnalysisData.value}} KW</strong>
                                        </CCallout>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </div>
            </CCol>

            <CCol lg = '6' class="pt-2">
                <div class="card-h h-100">
                    <CCardBody>
                        <h3 style="color:#8c5c7d"  class="card-font"><CIcon name="cil-align-left" size="lg"/> 進階數據</h3>
                        <CDataTable
                            :items="AnalysisData.items"
                            :fields="AnalysisData.fields"
                            style="textAlign:center;font-size:125%"
                            :items-per-page="9"
                            pagination
                    >
                            <template #show_details="{item}">
                                <td class="p-2">
                                    <CButton  @click="show_chart(item)">
                                        <CIcon size="xl" name="cil-chart-pie"/>
                                    </CButton>
                                    <CButton  @click="show_data_details(item)">
                                        <CIcon size="xl" name="cilZoom"/>
                                    </CButton>
                                </td>
                            </template>
                        </CDataTable>
                    </CCardBody>
                </div>
            </CCol>

            <CModal
                color="info"
                size="xl"
                :show.sync="showDetail"
                :closeOnBackdrop="false"
                :no-close-on-backdrop="true"
            >
                <CDataTable
                    :items="AnalysisData.detailItems"
                    :fields="AnalysisData.detailFields"
                    style="textAlign:center;font-size:125%"
                    :items-per-page="10"
                    :bordered="true"
                    column-filter
                    sorter
                    pagination
                >
                </CDataTable>
                <template #footer>
                    <CButton @click="showDetail = false" color="danger">返回</CButton>
                </template>
            </CModal>
        </CRow>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            myChart:'',
            option : {},

            date:'',

            factory:'',
            factoryOptions:[
                '',
                '廠區一',
                '廠區二',
                '廠區三'
            ],

            showDetail:false,

            classColor:{
                'Y':{color:'success'},
                'M':{color:''},
            },

            AnalysisData:{
                mode:'',

                name:'',
                sort:'',
                analysisSort:'減碳量',
                value:0,

                min:0,
                max:0,

                year:'',
                yearList:[],
                date:'',
                analysisMode:'',

                data:[],
                compareData:[],

                xAxis:[],
    
                items:[],
                fields:[
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%'            },
                    { key: 'value',                 label:'減碳量',             _style:'width:25%'           },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%'           },
                    { key: 'show_details',          label:'',                   _style:'width:25%'           }
                ],
    
                detailItems:[],
                detailItemsTemp:[],
                detailFields:[]
            }
        }
    },

    created() {
        switch(this.$route.params.mode) {
            case 'powerConsumption':
                this.AnalysisData.mode = 'powerConsumption';
                this.AnalysisData.name = '耗電量分析';
                this.AnalysisData.sort = '全部';
                this.AnalysisData.analysisSort = '耗電量';
                this.AnalysisData.value = 0;
                this.AnalysisData.fields = [
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%'            },
                    { key: 'value',                 label:'耗電量(KW)',             _style:'width:25%'        },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%'             },
                    { key: 'show_details',          label:'',                   _style:'width:25%'            }
                ];
                this.AnalysisData.detailFields = [
                    { key: 'date',                  label:'日期',               _style:'width:20%'            },
                    { key: 'factory',               label:'區域',               _style:'width:20%'            },
                    { key: 'equipment',             label:'設備',               _style:'width:20%'            },
                    { key: 'value',                 label:'耗電量(KW)',             _style:'width:20%'        },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:20%'             }
                ];
            break;

            case 'carbonEmissions':
                this.AnalysisData.mode = 'carbonEmissions';
                this.AnalysisData.name = '碳排量分析';
                this.AnalysisData.sort = '全部';
                this.AnalysisData.analysisSort = '碳排量';
                this.AnalysisData.value = 0;
                this.AnalysisData.fields = [
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%'            },
                    { key: 'value',                 label:'碳排量',             _style:'width:25%'           },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%'           },
                    { key: 'show_details',          label:'',                   _style:'width:25%'           }
                ];
                this.AnalysisData.detailFields = [
                    { key: 'date',                  label:'日期',               _style:'width:20%'            },
                    { key: 'factory',               label:'區域',               _style:'width:20%'            },
                    { key: 'equipment',             label:'設備',               _style:'width:20%'            },
                    { key: 'value',                 label:'碳排量',             _style:'width:20%'           },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:20%'           }
                ];
            break;

            case 'carbonNegative':
                this.AnalysisData.mode = 'carbonNegative';
                this.AnalysisData.name = '減碳排分析';
                this.AnalysisData.sort = '全部';
                this.AnalysisData.analysisSort = '減碳排';
                this.AnalysisData.value = 0;
                this.AnalysisData.fields = [
                    { key: 'sort',                  label:'分類項目',           _style:'width:40%'            },
                    { key: 'value',                 label:'減碳量',             _style:'width:40%'           },
                    { key: 'show_details',          label:'',                   _style:'width:20%'           }
                ];
                this.AnalysisData.detailFields = [
                    { key: 'date',                  label:'日期',               _style:'width:25%'            },
                    { key: 'factory',               label:'區域',               _style:'width:25%'            },
                    { key: 'equipment',             label:'設備',               _style:'width:25%'            },
                    { key: 'value',                 label:'減碳量',             _style:'width:25%'           },
                ];
            break;

            default:
            break;
        }

        if (this.$route.params.factory === 'all'){
            this.factory = '';
        } else {
            this.factory = this.$route.params.factory;
        }

        this.AnalysisData.year_list = [];
        this.$http
            .get('api/enms/select_data_year')
            .then(res => {
                for (let i = 0; i < res.data.length; ++i){
                    var result = res.data[i];
                    this.AnalysisData.yearList.push(result.year);
                }
                var newDate = new Date();
                this.AnalysisData.analysisMode = 'year';
        
                this.AnalysisData.year = (newDate.getFullYear()).toString();

                this.select_chart_data();
                this.myChart = this.$echarts.init(document.getElementById("analysisChart"));
            })
            .catch(err =>{
                console.log(err);
            })
    },

    methods:{
        switch_mode(mode) {
            this.classColor['Y']    = {color: ''};
            this.classColor['M']    = {color: ''};

            if (mode === 'year'){
                this.classColor['Y']    = {color: 'success'};
                this.AnalysisData.analysisMode = 'year';
            }

            if (mode === 'month'){
                this.classColor['M']    = {color: 'success'};
                this.AnalysisData.analysisMode = 'month';
            }
        },

        select_chart_data() {
            if (this.AnalysisData.analysisMode === 'year')
                this.AnalysisData.date = this.AnalysisData.year + '-01';

            let data = {
                factory:this.factory,
                date:this.AnalysisData.date,
                analysisMode:this.AnalysisData.analysisMode
            }
            this.$http
                .post('api/enms/select_two_years_electricity_consumption_for_anslysis',{ data:data })
                .then(res => {
                        var newDate = new Date(this.AnalysisData.date);

                        this.xAxis = [];
                        this.AnalysisData.min = 0;
                        this.AnalysisData.max = 0;
                        this.AnalysisData.value = 0;
                        this.AnalysisData.data = [];
                        this.AnalysisData.compareData = [];
                        this.AnalysisData.items = [];
                        this.AnalysisData.detailItemsTemp = [];

                        var dateTotal = [];
                        var index;

                        for (let i = 0; i < res.data.length; ++i){
                            var result = res.data[i];
                            var data;
                            switch (this.AnalysisData.mode){
                                case 'powerConsumption':
                                    data = result.electricity;
                                break;

                                case 'carbonEmissions':
                                    data = result.carbon_footprint;
                                break;

                                case 'carbonNegative':
                                    data = result.carbon_negative;
                                break;
                                
                                default:
                                break;
                            }

                            if (this.AnalysisData.analysisMode === 'year'){
                                this.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

                                index = dateTotal.findIndex(x => x.datetime === result.datetime);

                                if (index < 0){
                                    dateTotal.push({
                                        datetime:result.datetime,
                                        data:data
                                    })
                                } else {
                                    dateTotal[index].data += parseInt(data.toFixed(2));
                                }


                                var year = new Date(result.datetime).getFullYear();

                                if (year == newDate.getFullYear()){
                                    index = this.AnalysisData.items.findIndex(x => x.sort === result.type);
    
                                    if (index < 0){
                                        this.AnalysisData.items.push({
                                            sort:result.type,
                                            value:data,
                                            analysis:result.carbon_negative
                                        })
                                    } else {
                                        this.AnalysisData.items[index].value    += parseInt(data.toFixed(2));
                                        this.AnalysisData.items[index].analysis += parseInt(result.carbon_negative);
                                    }

                                    if (this.AnalysisData.mode === 'powerConsumption'){
                                        this.AnalysisData.detailItemsTemp.push({
                                            date:result.datetime,
                                            sort:result.type,
                                            equipment:result.machine_name,
                                            factory:result.factory,
                                            value:data.toFixed(2), 
                                            analysis:((result.carbon_negative / 509) * 1000).toFixed(2),
                                        })
                                    } else {
                                        this.AnalysisData.detailItemsTemp.push({
                                            date:result.datetime,
                                            sort:result.type,
                                            equipment:result.machine_name,
                                            factory:result.factory,
                                            value:data.toFixed(2), 
                                            analysis:result.carbon_negative,
                                        })
                                    }
                                    this.AnalysisData.value += parseInt(data);
                                }

                            }

                            if (this.AnalysisData.analysisMode === 'month'){
                                index = dateTotal.findIndex(x => x.datetime === result.datetime);

                                if (index < 0){
                                    dateTotal.push({
                                        datetime:result.datetime,
                                        data:data
                                    })
                                } else {
                                    dateTotal[index].data += parseInt(data.toFixed(2));
                                }


                                if (new Date(result.datetime).getFullYear() == new Date(newDate).getFullYear() &&
                                    new Date(result.datetime).getMonth()    == new Date(newDate).getMonth()){
                                        this.AnalysisData.value += parseInt(data);

                                        index = this.AnalysisData.items.findIndex(x => x.sort === result.type);
    
                                        if (index < 0){
                                            this.AnalysisData.items.push({
                                                sort:result.type,
                                                value:data,
                                                analysis:result.carbon_negative
                                            })
                                        } else {
                                            this.AnalysisData.items[index].value    += parseInt(data.toFixed(2));
                                            this.AnalysisData.items[index].analysis += parseInt(result.carbon_negative);
                                        }

                                        if (this.AnalysisData.mode === 'powerConsumption'){
                                            this.AnalysisData.detailItemsTemp.push({
                                                date:result.datetime,
                                                sort:result.type,
                                                equipment:result.machine_name,
                                                factory:result.factory,
                                                value:data.toFixed(2), 
                                                analysis:((result.carbon_negative / 509) * 1000).toFixed(2),
                                            })
                                        } else {
                                            this.AnalysisData.detailItemsTemp.push({
                                                date:result.datetime,
                                                sort:result.type,
                                                equipment:result.machine_name,
                                                factory:result.factory,
                                                value:data.toFixed(2), 
                                                analysis:result.carbon_negative,
                                            })
                                        }
                                }
                            }

                        }


                        for (let i = 0; i < dateTotal.length; ++i){
                            if (this.AnalysisData.analysisMode === 'year'){
                                var year = new Date(dateTotal[i].datetime).getFullYear();
    
                                if (year == newDate.getFullYear()){
                                    this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                                }
    
                                if (year == newDate.getFullYear()-1){
                                    this.AnalysisData.compareData.push(dateTotal[i].data.toFixed(2));
                                }
                            }

                            if (this.AnalysisData.analysisMode === 'month'){
                                if (new Date(dateTotal[i].datetime).getFullYear() == new Date(newDate).getFullYear() &&
                                    new Date(dateTotal[i].datetime).getMonth()    == new Date(newDate).getMonth()){
                                    this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                                }

                                if ((new Date(dateTotal[i].datetime).getFullYear())   == new Date(newDate).getFullYear()-1 &&
                                    new Date(dateTotal[i].datetime).getMonth()        == new Date(newDate).getMonth()){
                                    this.AnalysisData.compareData.push(dateTotal[i].data.toFixed(2));
                                    this.xAxis.push(new Date(dateTotal[i].datetime).getDate());
                                    continue;
                                }
                            }
                        }

                        if (this.AnalysisData.compareData.length === 0 && this.xAxis.length === 0){
                            for (let i = 0 ; i < this.AnalysisData.data.length; ++i){
                                this.xAxis.push(i+1);
                            }
                        }

                        if (this.AnalysisData.mode === 'powerConsumption'){
                            for (let i = 0; i < this.AnalysisData.items.length; ++i){
                                this.AnalysisData.items[i].analysis = ((this.AnalysisData.items[i].analysis/509) * 1000).toFixed(2);
                            }
                        }

                        for (let i = 0; i < this.AnalysisData.data.length; ++i){
                            if (i === 0){
                                this.AnalysisData.max = Math.ceil(this.AnalysisData.data[i]);
                                this.AnalysisData.min = Math.floor(this.AnalysisData.data[i]);
                            }

                            if (this.AnalysisData.data[i] > this.AnalysisData.max)
                                this.AnalysisData.max = Math.ceil(this.AnalysisData.data[i]);

                            if (this.AnalysisData.data[i] < this.AnalysisData.min)
                                this.AnalysisData.min = Math.floor(this.AnalysisData.data[i]);
                        }

                        for (let i = 0; i < this.AnalysisData.compareData.length; ++i){
                            if (this.AnalysisData.data[i] > this.AnalysisData.max)
                                this.AnalysisData.max = Math.ceil(this.AnalysisData.data[i]);

                            if (this.AnalysisData.data[i] < this.AnalysisData.min)
                                this.AnalysisData.min = Math.floor(this.AnalysisData.data[i]);
                        }

                        this.rendering_chart();
                })
                .catch(err =>{
                    console.log(err);
                })
        },

        rendering_chart() {
            if (this.AnalysisData.compareData.length > 0){
                this.option = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis,
                    },
                    yAxis: {
                        type: 'value',
                        min: this.AnalysisData.min,
                        max: this.AnalysisData.max,
                    },
                    series: [
                        {
                            name: '今年度' + this.AnalysisData.analysisSort,
                            type: 'line',
                            smooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.data,
                        },
                        {
                            name: '去年度' + this.AnalysisData.analysisSort,
                            type: 'line',
                            smooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.compareData,
                        },
                    ]
                };
            } else {
                this.option = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis,
                    },
                    yAxis: {
                        type: 'value',
                        min: this.AnalysisData.min,
                        max: this.AnalysisData.max,
                    },
                    series: [
                        {
                            name: '今年度' + this.AnalysisData.analysisSort,
                            type: 'line',
                            smooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.data,
                        }
                    ]
                };
            }

            this.myChart.setOption(this.option);
        },

        show_chart(item) {
            var key = item.sort;

            this.AnalysisData.sort = key;

            this.xAxis = [];
            this.AnalysisData.min = 0;
            this.AnalysisData.max = 0;
            this.AnalysisData.value = 0;
            this.AnalysisData.data = [];
            this.AnalysisData.compareData = [];

            var dateTotal = [];
            var index;


            for (let i = 0; i < this.AnalysisData.detailItemsTemp.length; ++i){
                if (this.AnalysisData.detailItemsTemp[i].sort !== key)
                    continue;

                var result = this.AnalysisData.detailItemsTemp[i];
                var data = parseInt(result.value);

                index = dateTotal.findIndex(x => x.datetime === result.date);
    
                if (index < 0){
                    dateTotal.push({
                        datetime:result.date,
                        data:data
                    })
                } else {
                    dateTotal[index].data += parseInt(data.toFixed(2));
                }

                if (this.AnalysisData.analysisMode === 'year')
                    this.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                
            }

            for (let i = 0; i < dateTotal.length; ++i){
                if (this.AnalysisData.analysisMode === 'year'){
                    this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                    this.AnalysisData.value += parseInt(dateTotal[i].data);
                }

                if (this.AnalysisData.analysisMode === 'month'){
                    this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                    this.AnalysisData.value += parseInt(dateTotal[i].data);
                    this.xAxis.push(new Date(dateTotal[i].datetime).getDate());
                }
            }

            for (let i = 0; i < this.AnalysisData.data.length; ++i){
                if (i === 0){
                    this.AnalysisData.max = Math.ceil(this.AnalysisData.data[i]);
                    this.AnalysisData.min = Math.floor(this.AnalysisData.data[i]);
                }

                if (this.AnalysisData.data[i] > this.AnalysisData.max)
                    this.AnalysisData.max = Math.ceil(this.AnalysisData.data[i]);

                if (this.AnalysisData.data[i] < this.AnalysisData.min)
                    this.AnalysisData.min = Math.floor(this.AnalysisData.data[i]);
            }

            this.option = {
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxis,
                },
                yAxis: {
                    type: 'value',
                    min: this.AnalysisData.min,
                    max: this.AnalysisData.max,
                },
                series: [
                    {
                        name: '今年度' + this.AnalysisData.analysisSort,
                        type: 'line',
                        smooth: true,
                        // prettier-ignore
                        data: this.AnalysisData.data,
                    },
                    {
                        name: '去年度' + this.AnalysisData.analysisSort,
                        type: 'line',
                        smooth: true,
                        // prettier-ignore
                        data: this.AnalysisData.compareData,
                    },
                ]
            };

            this.myChart.setOption(this.option);
        },

        show_data_details(item) {
            var key = item.sort;

            this.AnalysisData.detailItems = [];

            for (let i = 0; i < this.AnalysisData.detailItemsTemp.length; ++i){
                if (this.AnalysisData.detailItemsTemp[i].sort === key)
                    this.AnalysisData.detailItems.push(this.AnalysisData.detailItemsTemp[i])
            }
            this.showDetail = true;
        },
    }
}
</script>

<style>
.card-h {
    background-color: #0e2e2b;
}

.card-font {
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
</style>