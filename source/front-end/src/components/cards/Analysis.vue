<template>
    <div>
        <CRow>
            <CCol lg = '12' class="pt-2">
                <div class="card-ana">
                    <CCardBody class="mr-1 mb-1 h-100">
                        <h4 style="color:#98a8a0" class="card-font-ana"><CIcon name="cil-chart-line" size="lg"/> {{AnalysisData.name}}</h4>
                        <hr class="mt-0 mb-2">
                        <CRow>
                            <CCol lg = '3' class="pt-2">
                                <h4 class="card-font-ana">
                                    時間區間 :
                                    <CButton v-bind="classColor['Y']" @click="switch_mode('year')">依年份瀏覽</CButton>
                                    <CButton v-bind="classColor['M']" @click="switch_mode('month')">依月份瀏覽</CButton>
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
                                    :max="max"
                                    v-if="AnalysisData.analysisMode==='month'"
                                />
                            </CCol>
                            <CCol lg = '3' class="pt-2">
                                <h2 class="card-font-ana">區域 :</h2>
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
                <div class="card-ana h-100">
                    <CCardBody>
                        <h4 style="color:#98a8a0"  class="card-font-ana"><CIcon name="cil-chart-pie" size="lg"/> 圖表數據</h4>
                        <CRow>
                            <CCol lg = '12' class="pt-2">
                                <div id="analysisChart" style = "width: 45vw;height:50vh"/>
                            </CCol>
                            <CCol lg = '12' class="pt-2">
                                <CRow>
                                    <CCol lg = '6'>
                                        <CCallout color="info">
                                            <small class="text-muted"><CIcon name="cil-industry" style="color:#3399FF"/> 分類</small><br>
                                            <strong class="h4" style="color:#FFFFFF">{{AnalysisData.sort}}</strong>
                                        </CCallout>
                                    </CCol>
                                    <CCol lg = '6'>
                                        <CCallout color="success">
                                            <small class="text-muted"><CIcon name="cil-check-circle" style="color:green"/> {{AnalysisData.analysisSort}}</small><br>
                                            <strong class="h5" style="color:#FFFFFF">{{AnalysisData.value}} KW</strong>
                                        </CCallout>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </div>
            </CCol>

            <CCol lg = '6' class="pt-2">
                <div class="card-ana h-100">
                    <CCardBody>
                        <h4 style="color:#98a8a0"  class="card-font-ana"><CIcon name="cil-align-left" size="lg"/> 進階數據</h4>
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
                size="xl"
                :show.sync="showDetail"
                :closeOnBackdrop="false"
                :no-close-on-backdrop="true"
            >
                <CDataTable
                    :items="AnalysisData.detailItems"
                    :fields="AnalysisData.detailFields"
                    style="textAlign:center;font-size:125%;"
                    :items-per-page="10"
                    :bordered="true"
                    sorter
                    pagination
                >
                </CDataTable>
                <template #footer>
                    <CButton @click="showDetail = false" color="dark">返回</CButton>
                </template>
            </CModal>
        </CRow>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            max:'',

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
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%;  color: #4C756A;'},
                    { key: 'value',                 label:'減碳量',             _style:'width:25%; color: #4C756A;'},
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%'           },
                    { key: 'show_details',          label:'',                   _style:'width:25%'           }
                ],

                detailItems:[],
                detailItemsTemp:[],
                detailItemsTempCompare:[],
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
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%; color: #4C756A;'            },
                    { key: 'value',                 label:'耗電量(KW)',         _style:'width:25%; color: #4C756A;'              },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%; color: #4C756A;'             },
                    { key: 'show_details',          label:'',                   _style:'width:25%; color: #4C756A;'            }
                ];
                this.AnalysisData.detailFields = [
                    { key: 'date',                  label:'日期',               _style:'width:20%'            },
                    { key: 'factory',               label:'區域',               _style:'width:20%'            },
                    { key: 'equipment',             label:'設備',               _style:'width:20%'            },
                    { key: 'value',                 label:'耗電量(KW)',         _style:'width:20%'              },
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
                    { key: 'sort',                  label:'分類項目',           _style:'width:25%; color: #4C756A;'            },
                    { key: 'value',                 label:'碳排量',             _style:'width:25%; color: #4C756A;'           },
                    { key: 'analysis',              label:'去年同期分析',       _style:'width:25%; color: #4C756A;'           },
                    { key: 'show_details',          label:'',                   _style:'width:25%; color: #4C756A;'           }
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
                    { key: 'sort',                  label:'分類項目',           _style:'width:40%; color: #4C756A;'            },
                    { key: 'value',                 label:'減碳量',             _style:'width:40%; color: #4C756A;'           },
                    { key: 'show_details',          label:'',                   _style:'width:20%; color: #4C756A;'           }
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

                this.max = newDate.getFullYear() + '-' + (newDate.getMonth() + 1);

                this.AnalysisData.analysisMode = 'year';

                this.AnalysisData.year = (newDate.getFullYear()).toString();

                this.myChart = this.$echarts.init(document.getElementById("analysisChart"));
                this.select_chart_data();
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
            console.log(data);
            // if (data['factory'] === '全廠區') data['factory'] = '';
            this.$http
                .post('api/enms/select_two_years_electricity_consumption_for_anslysis',{ data:data })
                .then(async res => {
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
                                    dateTotal[index].data = this.$utils.float_computing(dateTotal[index].data, data, 2, "+");
                                    // dateTotal[index].data += parseFloat(data.toFixed(2));
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
                                        this.AnalysisData.items[index].value = this.$utils.float_computing( this.AnalysisData.items[index].value,
                                                                                                            data,
                                                                                                            2,
                                                                                                            "+");

                                        this.AnalysisData.items[index].analysis = this.$utils.float_computing(  this.AnalysisData.items[index].analysis,
                                                                                                                result.carbon_negative,
                                                                                                                2,
                                                                                                                "+");
                                    }
                                    this.AnalysisData.value = this.$utils.float_computing(this.AnalysisData.value, data, 2, "+");
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

                            if (this.AnalysisData.analysisMode === 'month'){
                                index = dateTotal.findIndex(x => x.datetime === result.datetime);

                                if (index < 0){
                                    dateTotal.push({
                                        datetime:result.datetime,
                                        data:data
                                    })
                                } else {
                                    dateTotal[index].data = this.$utils.float_computing(dateTotal[index].data, data, 2, "+");
                                    // dateTotal[index].data += parseFloat(data.toFixed(2));
                                }


                                if (new Date(result.datetime).getFullYear() == new Date(newDate).getFullYear() &&
                                    new Date(result.datetime).getMonth()    == new Date(newDate).getMonth()){
                                        this.AnalysisData.value = this.$utils.float_computing(this.AnalysisData.value, data, 2, "+");
                                        // this.AnalysisData.value += parseFloat(data.toFixed(2));


                                        index = this.AnalysisData.items.findIndex(x => x.sort === result.type);

                                        if (index < 0){
                                            this.AnalysisData.items.push({
                                                sort:result.type,
                                                value:data,
                                                analysis:result.carbon_negative
                                            })
                                        } else {
                                            this.AnalysisData.items[index].value = this.$utils.float_computing( this.AnalysisData.items[index].value,
                                                                                                                data,
                                                                                                                2,
                                                                                                                "+");

                                            this.AnalysisData.items[index].analysis = this.$utils.float_computing(  this.AnalysisData.items[index].analysis,
                                                                                                                    result.carbon_negative,
                                                                                                                    2,
                                                                                                                    "+");
                                            }

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
                        console.log(dateTotal)
                        this.AnalysisData.compareData = [];
                        this.AnalysisData.data = [];

                        for (let i = 0; i < dateTotal.length; ++i){
                            if (this.AnalysisData.analysisMode === 'year'){
                                var year = new Date(dateTotal[i].datetime).getFullYear();
                                if (year == newDate.getFullYear()){
                                    this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                                    console.log("This is data::" + dateTotal[i].data.toFixed(2))
                                }

                                if (year == newDate.getFullYear()-1){
                                    this.AnalysisData.compareData.push(dateTotal[i].data.toFixed(2));
                                    console.log("This is compare::" + dateTotal[i].data.toFixed(2))
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

                        console.log(this.AnalysisData.compareData)
                        console.log(this.AnalysisData.data)

                        if (this.AnalysisData.compareData.length === 0 && this.xAxis.length === 0){
                            for (let i = 0 ; i < this.AnalysisData.data.length; ++i){
                                this.xAxis.push(i+1);
                            }
                        }

                        if (this.AnalysisData.mode === 'powerConsumption'){
                            for (let i = 0; i < this.AnalysisData.items.length; ++i){
                                this.AnalysisData.items[i].analysis = ((this.AnalysisData.items[i].analysis/509) * 1000).toFixed(2);
                                console.log('analysis:', this.AnalysisData.items[i].analysis);
                            }
                        }
                        this.AnalysisData.sort = '全部';
                        this.rendering_chart();
                })
                .catch(err =>{
                    console.log(err);
                })
        },

        rendering_chart() {
            this.option = {};
            this.compute_min_max_for_chart_data(this.AnalysisData.data);
            console.log(typeof this.AnalysisData.compareData.length)
            if (this.AnalysisData.compareData.length == 0){
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
                            // smooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.data,
                        },
                        {
                            name: '去年度' + this.AnalysisData.analysisSort,
                            type: 'line',
                            toolbox: {
                            show: false
                            },
                            // mooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.compareData,
                        },
                    ]
                };
                this.myChart.setOption(this.option);
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
                            // smooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.data,
                        },
                        {
                            name: '去年度' + this.AnalysisData.analysisSort,
                            type: 'line',
                            // mooth: true,
                            // prettier-ignore
                            data: this.AnalysisData.compareData,
                        },
                    ]
                };
                this.myChart.setOption(this.option);
            }
        },

        show_chart(item) {
            var newDate = new Date(this.AnalysisData.date);

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
            console.log(this.AnalysisData.detailItemsTemp);
            for (let i = 0; i < this.AnalysisData.detailItemsTemp.length; ++i){
                if (this.AnalysisData.detailItemsTemp[i].sort !== key)
                    continue;

                var result = this.AnalysisData.detailItemsTemp[i];
                var data = parseFloat(result.value);

                index = dateTotal.findIndex(x => x.datetime === result.date);
                if (index < 0){
                    dateTotal.push({
                        datetime:result.date,
                        data:data
                    })
                } else {
                    dateTotal[index].data = this.$utils.float_computing(dateTotal[index].data, data, 2, "+");
                    // dateTotal[index].data += parseFloat(data.toFixed(2));
                }

                if (this.AnalysisData.analysisMode === 'year')
                    this.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            }
            console.log(dateTotal);

            for (let i = 0; i < dateTotal.length; ++i){
                if (this.AnalysisData.analysisMode === 'year'){
                    var year = new Date(dateTotal[i].datetime).getFullYear();

                    if (year == newDate.getFullYear()){
                        this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                        this.AnalysisData.value = this.$utils.float_computing(this.AnalysisData.value, dateTotal[i].data, 2, "+");
                        // this.AnalysisData.value += parseFloat(dateTotal[i].data.toFixed(2));
                    }

                    if (year == newDate.getFullYear()-1){
                        this.AnalysisData.compareData.push(dateTotal[i].data.toFixed(2));
                    }
                }

                if (this.AnalysisData.analysisMode === 'month'){
                    if (new Date(dateTotal[i].datetime).getFullYear() == new Date(newDate).getFullYear() &&
                        new Date(dateTotal[i].datetime).getMonth()    == new Date(newDate).getMonth()){
                        this.AnalysisData.data.push(dateTotal[i].data.toFixed(2));
                        this.AnalysisData.value = this.$utils.float_computing(this.AnalysisData.value, dateTotal[i].data, 2, "+");
                    }

                    if ((new Date(dateTotal[i].datetime).getFullYear())   == new Date(newDate).getFullYear()-1 &&
                        new Date(dateTotal[i].datetime).getMonth()        == new Date(newDate).getMonth()){
                        this.AnalysisData.compareData.push(dateTotal[i].data.toFixed(2));
                        this.xAxis.push(new Date(dateTotal[i].datetime).getDate());
                        continue;
                    }
                }
            }
            this.rendering_chart();
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

        compute_min_max_for_chart_data(chartData) {
            let total = 0;
            let maxElement = 0;
            let minElement = Number.MAX_VALUE;

            for (let ix = 0; ix < chartData.length; ++ix){
                let floatData = parseFloat(chartData[ix]);
                if (floatData > maxElement) maxElement = floatData;
                if (floatData < minElement) minElement = floatData;

                total += floatData;
            }
            let avg = total / chartData.length;

            let maxScale = (avg + Math.abs(maxElement - avg) * 0.5) / avg;
            let minScale = (avg - Math.abs(minElement - avg) * 0.5) / avg;
            this.AnalysisData.max = (Math.round((maxElement + Math.abs(maxElement - avg) * 0.5) / 0.01) * 0.01).toFixed(2);
            this.AnalysisData.min = (Math.round((minElement - Math.abs(minElement - avg) * 0.5) / 0.01) * 0.01).toFixed(2);
            console.log('avg:', avg, maxElement, minElement);
            // diff percentage
            // let maxDiff = 0;
            // let minDiff = 1;
            // for (let iy = 0; iy < chartData.length; ++iy) {
            //     let floatData = parseFloat(chartData[iy]);
            //     let diff = Math.abs(floatData - avg) / avg;
            //     if (diff > maxDiff) maxDiff = diff;
            //     if (diff < minDiff) minDiff = diff;

            // }
            // let maxScale = 1 + maxDiff * 1.5;
            // let minScale = 1 + minDiff * 1.5;
            // this.AnalysisData.max = parseFloat((maxElement * maxScale).toFixed(2));
            // this.AnalysisData.min = parseFloat((minElement * minScale).toFixed(2));
            console.log(avg, minScale, maxScale);

            // this.AnalysisData.min = parseFloat((minElement*0.98).toFixed(2));
            // this.AnalysisData.max = parseFloat((maxElement*1.02).toFixed(2));
            console.log('(min, max)=', this.AnalysisData.min, this.AnalysisData.max);
        }
    }
}
</script>

<style>
.card-ana {
    background-color: #081d1b;
}

.card-font-ana {
    color: #98a8a0;
    background-color: #081d1b;
    /* border-bottom: 1px rgb(77, 107, 77) solid; */
}
.table {
    color: white;
}
.table-modal {
    color: black;
}
.modal-color {
	color: rgb(80, 78, 78);
}
</style>
