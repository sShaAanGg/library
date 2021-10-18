<template>
    <div>
        <CCard class="card-base">
            <CCardBody>
            <h4 style="color: #98a8a0">
                <CIcon name="cil-bar-chart" size="lg" /> 產線年度歷史分析
            </h4>
			<CCol lg="8" class="card-base">
                <CRow lg="8">
                <!-- <CSelect label="選擇年" :options="yearOptions" :value.sync="selectYear" /> -->
                <CSelect class="select-month" label="選擇月" :options="['-', 1, 2, 3, 4, 5, 6, 7, 8]"
                    :value.sync="selectMonth"/>
                <CSelect class="select-factory" label="廠區" :options="factoryOptions"
                    :value.sync="factory" />
                <CButton
                class="btn-search"
                size="lg"
                @click="get_equip_list(factory, selectMonth)"
                >
                搜尋
                </CButton>
                </CRow>

			</CCol>
            </CCardBody>
        </CCard >
        <CCard class="card-base">
            <CRow>
                <CCol lg="6">
                    <h4 class="ml-4 mt-4" style="color: #98a8a0">
                        <CIcon name="cil-chart-line" size="lg" /> 圖表數據 - {{ equipName }}
                    </h4>

                    <CRow>
                        <table class="equip-table ml-5 mt-2" >
                            <tr>
                                <th class="equip-elec"> 月耗電量: {{ equipElec }} KWh</th>
                                <th class="equip-elec"> 作動時間: {{ equipWorkHours }} </th>
                            </tr>
                            <tr>
                                <th class="equip-elec"> 異常次數: {{ equipEventTimes }} </th>
                                <th class="equip-elec"> 月稼動率: {{ equipActivate }} %</th>
                            </tr>
                        </table>
                    </CRow>
                    <CRow>
                        <div class="ml-3 mt-5" id="lineChartMonth" style="width:45vw;height:60vh"></div>
                    </CRow>
                </CCol>
                <CCol class="mr-4">
                    <h4 class="mt-4" style="color: #98a8a0">
                        <CIcon name="cil-description" size="lg" /> 設備清單
                    </h4>
                    <CDataTable
                        :items="equipList"
                        :fields="equipFields"
                        style="textalign: center; font-size: 110%; color: #98a8a0"
                        :items-per-page="5"
                        :bordered="true"
                        pagination
                    >
                        <template #update_chart="{ item }">
                        <td class="p-2">
                            <CButton
                            square
                            size="sm"
                            style="color: #98a8a0"
                            @click="show_chart(item)"
                            >
                            <CIcon size="xl" name="cil-chart-line" />
                            </CButton>
                        </td>
                        </template>
                    </CDataTable>
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-description" size="lg" /> 異常清單
                    </h4>
                    <CDataTable
                        :items="equipEventList"
                        :fields="eventFields"
                        style="textalign: center; font-size: 110%;"
                        :items-per-page="5"
                        :bordered="true"
                        pagination
                    >
                    </CDataTable>
                </CCol>
            </CRow>
            <CModal
                size="sm"
                :show.sync="showSearchHint"
                :closeOnBackdrop="false"
		    >
               <CRow><h5 class="ml-5" style="color:white;">請選擇月份與廠區</h5></CRow>
				<template #footer>
				<CButton @click="showSearchHint = false" color="dark">返回</CButton>
                </template>
            </CModal>

        </CCard>

    </div>



</template>

<script>
export default {
    data() {
        return {
            showSearchHint: false,
            factoryOptions: ['全廠區', '廠區一', '廠區二', '廠區三'],
            yearOptions: [2021],
            yearMonth: '-',
            selectYear: 2021,
            selectYearYoy: '',
            selectMonth: 8,
            factory: '全廠區',

            equipName: '請從右側選擇設備',
            equipElec: '-',
            equipWorkHours: '-',
            equipEventTimes: '-',
            equipActivate: '-',

            equipList: [],
            equipFields: [
                {key: 'machine_name', label: '設備名稱', _style: "color: #4C756A"},
                {key: 'machine_sn', label: 'S/N', _style: "color: #4C756A"},
                {key: 'cur_month_elec', label: '耗電量', _style: "color: #4C756A"},
                {key: 'yoy_month_elec', label: '去年同期分析', _style: "color: #4C756A"},
                {key: 'activation', label: '稼動率', _style: "color: #4C756A"},
                {key: 'update_chart', label: ''}
            ],
            equipEventList: [],
            eventFields: [
                {key: 'event', label: '異常原因', _style: "color: #4C756A"},
                {key: 'start_datetime', label: '開始時間', _style: "color: #4C756A"},
                {key: 'end_datetime', label: '結束時間', _style: "color: #4C756A"}
            ],

            lineChart: '',
            isShowChart: false,
            option: {
                xAxis: {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7']
                },
                yAxis: {
                    type: 'value',

                },
                series: [
                    {
                        data: [150, 230, 224, 218, 135, 147, 260],
                        type: 'line',
                        itemStyle: {
                                color: '#92BED4'
                        },
                        label: {
                            show: false
                        },
                    },
                    // {
                    //     data: [150, 230, 224, 218, 135, 147, 260],
                    //     type: 'line',
                    //     itemStyle: {
                    //             color: '#B9FAE6'
                    //     },
                    //     label: {
                    //         show: false
                    //     },
                    // }
                ]
            }

        }
    },
    created() {


    },
    mounted() {
        this.lineChart = this.$echarts.init(document.getElementById("lineChartMonth"));
        this.initialize_page();
        // this.get_equip_list('', '');


    },
    methods: {
        reset() {


        },
        get_select_year_month(selectYear, selectMonth) {

            (selectMonth < 10)  ? this.yearMonth = selectYear.toString() + '0' + (selectMonth.toString()) + '00000000'
                                : this.yearMonth = selectYear.toString() + (selectMonth.toString()) + '00000000';

        },

        initialize_page() {
            this.get_select_year_month(this.selectYear, this.selectMonth);
            let data = {factory:'', datetime:''};
            this.$http
                .post('api/enms/select_factory_machine_monthly_info', {data:data})
                .then((res) => {
                    this.equipList = res.data;
                    console.log('1', this.equipList[0]);
                    this.show_chart(this.equipList[0]);
                    // this.equipList[0]._classes = '';

                })
                .catch((error) => console.log(error));
        },

        get_equip_list(factory, month) {
            if (month === '-') {
                // user does not select month
                this.showSearchHint = true;
            }
            else if (factory === '全廠區') {
                this.reset_chart();

                this.get_select_year_month(this.selectYear, this.selectMonth);
                let data = {factory:'', datetime:this.yearMonth};
                this.$http
                    .post('api/enms/select_factory_machine_monthly_info', {data:data})
                    .then((res) => {
                        this.equipList = res.data;
                        this.show_chart(this.equipList[0]);
                    })
                    .catch((error) => console.log(error));
            }
            else{
                this.reset_chart();

                this.get_select_year_month(this.selectYear, this.selectMonth);
                let data = {factory:factory, datetime:this.yearMonth};
                this.$http
                    .post('api/enms/select_factory_machine_monthly_info', {data:data})
                    .then((res) => {
                        this.equipList = res.data;
                        this.show_chart(this.equipList[0]);

                    })
                    .catch((error) => console.log(error));
            }


        },

        show_chart(item) {
            console.log('2', item);
            let rowColor = 'table-active';
            // reset row color
            let foundIdx = this.equipList.findIndex(x => x._classes === rowColor);
            if (foundIdx >= 0) {
                this.equipList[foundIdx]._classes = '';
            }

            // change row color to show selected
            // change existed attributes to force rendering
            //  this.equipList[foundIdx]._classes = '';
            console.log('3', item);
            let tempName = item.machine_name;
            item.machine_name = '123';
            item.machine_name = tempName;
            item._classes = rowColor;

            this.equipName = item.machine_name;
            this.equipElec = item.cur_month_elec;
            this.equipActivate = item.activation;


            this.get_equip_events(item);
            this.get_daily_elec(item);
            // this.get_daily_elec_yoy(item);
            this.lineChart.setOption(this.option);
        },

        get_equip_events(item) {
            let data = {machine_sn:item.machine_sn};
            this.$http
                .post('api/enms/select_equip_error_log', {data:data})
                .then((res) => {
                    this.equipEventList = res.data;
                    this.equipEventTimes = this.equipEventList.length;
                })
                .catch((error) => console.log(error));

        },

        get_daily_elec(item) {
            let endDate = '';
            (this.selectMonth < 10) ? endDate = this.selectYear.toString() + '0' + (this.selectMonth.toString()) + '32000000'
                                    : endDate = this.selectYear.toString() + (this.selectMonth.toString()) + '32000000';
            let data = {machine_sn:item.machine_sn, start_date:this.yearMonth, end_date: endDate};
            this.$http
                .post('api/enms/select_equip_daily_elec_yoy', {data:data})
                .then((res) => {
                    let chartData = [];
                    let xLabel = [];
                    let min = Number.MAX_VALUE;
                    for (let ix = 0; ix < res.data.length; ++ix) {
                        chartData.push(res.data[ix].electricity);
                        xLabel.push(ix + 1);
                        if (res.data[ix].electricity < min) min = res.data[ix].electricity;
                    }
                    this.option.series[0].data = chartData;
                    this.option.xAxis.data = xLabel;
                    this.option.yAxis.min = Math.floor(min);
                    this.lineChart.setOption(this.option);
                })
                .catch((error) => console.log(error));

        },

        get_daily_elec_yoy(item) {
            this.selectYearYoy = this.selectYear - 1;
            let startDate = '';
            (this.selectMonth < 10) ? startDate = this.selectYearYoy.toString() + '0' + (this.selectMonth.toString()) + '00000000'
                                    : startDate = this.selectYearYoy.toString() + (this.selectMonth.toString()) + '00000000';
            let endDate = '';
            (this.selectMonth < 10) ? endDate = this.selectYearYoy.toString() + '0' + (this.selectMonth.toString()) + '32000000'
                                    : endDate = this.selectYearYoy.toString() + (this.selectMonth.toString()) + '32000000';
            console.log(startDate, endDate);
            let data = {machine_sn:item.machine_sn, start_date:startDate, end_date: endDate};
            this.$http
                .post('api/enms/select_equip_daily_elec_yoy', {data:data})
                .then((res) => {
                    let chartData = [];
                    let xLabel = [];
                    let min = Number.MAX_VALUE;
                    for (let ix = 0; ix < res.data.length; ++ix) {
                        chartData.push(res.data[ix].electricity);
                        xLabel.push(ix + 1);
                        if (res.data[ix].electricity < min) min = res.data[ix].electricity;
                    }
                    console.log(chartData);
                    this.option.series[1].data = chartData;
                    // this.option.xAxis.data = xLabel;
                    // this.option.yAxis.min = Math.floor(min);
                    this.lineChart.setOption(this.option);
                })
                .catch((error) => console.log(error));

        },
        reset_chart() {
            this.equipName = '請從右側選擇設備';
            this.equipElec = '-';
            this.equipActivate = '-';
            this.equipEventList = [];
            this.equipList = [];
            this.equipEventTimes  = '-';
            for (let ix = 0; ix < this.option.xAxis.data.length; ++ix) {
                this.option.series[0].data[ix] = 0;
                // this.option.series[1].data[ix] = 0;
            }
            this.option.yAxis.min = 0;

            this.lineChart.setOption(this.option);
        }
    }
}

</script>

<style scope>
/* .background {
	background-color: #272727;
}
.card-1 {
	background-color:#000000;
	border-color: #272727;
}
.fullpage {
	border-color: #272727;
} */
.table {
    color: white;
}
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
}
.equip-elec {
    min-width: 20vw;
    padding-left: 1vw;
    border-left: 3px rgb(77, 107, 77) solid;
    border-top: 3px rgb(77, 107, 77) solid;
    border-right: 3px rgb(77, 107, 77) solid;
    border-bottom: 3px rgb(77, 107, 77) solid;
}
.select-month {
    min-width: 7vw;
    padding-left: 1vw;
    padding-right: 1vw;
}
.select-factory {
    min-width: 12vw;
    padding-left: 1vw;
    padding-right: 1vw;
}
.btn-search {
    position: relative;
    top: 1vw;
    color: white;
    height: 3vw;
    background: #1d7948;

}
.equip-table {
    position: absolute;
    left: 1vw;

}
.table-dark {
    color: #000000;
}


</style>
