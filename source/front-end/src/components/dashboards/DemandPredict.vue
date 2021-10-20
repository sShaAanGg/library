<template>
    <div>
        <CCard class="card-base">
            <CCardBody>
                <h4 style="color: #98a8a0">
                    <CIcon name="cil-bar-chart" size="lg"/> 需量預測
                </h4>
                <CRow lg="12">
                    <CCol lg="6">
                        <h4 class="ml-4 mt-4" style="color: #98a8a0">
                            <CIcon name="cil-chart-line" size="lg" /> 圖表數據 - {{ equipName }}
                        </h4>
                        <CRow>
                            <div class="ml-3 mt-5" id="barChartDemand" style="width:40vw;height:60vh"></div>
                        </CRow>
                    </CCol>
                    <CCol lg="6" class="card-base">
                        <CRow lg="8">
                        <CSelect class="select-factory" label="廠區" :options="factoryOptions"
                            :value.sync="factory" />
                        <CSelect class="select-factory" label="分類項目" :options="typeOptions"
                            :value.sync="machineType" />
                        <CButton
                        class="btn-search"
                        size="lg"
                        @click="get_equip_list(factory, selectMonth)"
                        >
                        搜尋
                        </CButton>
                        </CRow>
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
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard >
        <CCard class="card-base">
            <CRow>

                <CCol class="mr-4">

                </CCol>
            </CRow>
            <!-- <CModal
                size="sm"
                :show.sync="showSearchHint"
                :closeOnBackdrop="false"
		    >
               <CRow><h5 class="ml-5" style="color:white;">請選擇月份與廠區</h5></CRow>
				<template #footer>
				<CButton @click="showSearchHint = false" color="dark">返回</CButton>
                </template>
            </CModal> -->

        </CCard>

    </div>



</template>

<script>
export default {
    data() {
        return {
            maxContract: 62500,
            showSearchHint: false,
            factoryOptions: ['全廠區', '廠區一', '廠區二', '廠區三'],
            typeOptions: ['全部項目'],
            yearOptions: [2021],
            yearMonth: '-',
            selectYear: 2021,
            selectYearYoy: '',
            selectMonth: 8,
            factory: '全廠區',
            machineType: '全部項目',
            data: [],

            equipName: '請從右側選擇設備',
            equipElec: '-',
            equipWorkHours: '-',
            equipEventTimes: '-',
            equipActivate: '-',

            equipList: [],
            equipFields: [
                {key: 'machine_name', label: '設備名稱', _style: "color: #4C756A"},
                {key: 'machine_sn', label: 'S/N', _style: "color: #4C756A"},
                {key: 'factory', label: '廠區', _style: "color: #4C756A"},
                {key: 'type', label: '分類項目', _style: "color: #4C756A"},
                {key: 'cur_month_elec', label: '耗電量', _style: "color: #4C756A"},
                {key: 'update_chart', label: ''}
            ],
            equipEventList: [],
            eventFields: [
                {key: 'event', label: '異常原因', _style: "color: #4C756A"},
                {key: 'start_datetime', label: '開始時間', _style: "color: #4C756A"},
                {key: 'end_datetime', label: '結束時間', _style: "color: #4C756A"}
            ],

            barChart: '',
            option: {
                grid: {
                    left: '0%',
                    right: '5%',
                    bottom: '15%',
                    top: '3%',
                    containLabel: true,
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel:{
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#A19991'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['未來三個月\n契約容量', '未來三個月\n預測使用容量', '當前月\n使用容量'],
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                    max: 2,
                    axisLabel:{
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white'
                    }
                },
                visualMap: {
                    show: false,
                    orient: 'horizontal',
                    left: 'center',
                    min: 0,
                    max: 150,
                    text: ['High', 'Low'],
                    dimension: 0,
                    inRange: {
                        color: ['#55A864', '#A89F5B','#AC2D2D']
                    },
                },
                series: [{
                    realtimeSort: true,
                    type: 'bar',
                    data: [100, 50, 20],
                    label: {
                        show: true,
                        valueAnimation: true,
                        position: 'top',
                        fontFamily: 'monospace',
                        color:'#98a8a0',
                        fontSize: this.$utils.adjustFontSize(0.14)
                    }
                }],
                legend: {
                    show: false
                },
            }

        }
    },
    created() {


    },
    mounted() {
        this.barChart = this.$echarts.init(document.getElementById("barChartDemand"));
        this.barChart.setOption(this.option);
        this.option.visualMap.max = this.maxContract;
        this.option.series[0].data[0] = this.maxContract;
        // this.get_predict_capacity();
        this.initialize_page();

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
                .post('api/enms/select_machine_info_for_demand_predict', {data:data})
                .then((res) => {
                    this.equipList = res.data;
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
                // this.reset_chart();

                this.get_select_year_month(this.selectYear, this.selectMonth);
                let data = {factory:'', datetime:this.yearMonth};
                this.$http
                    .post('api/enms/select_machine_info_for_demand_predict', {data:data})
                    .then((res) => {
                        this.equipList = res.data;
                        this.show_chart(this.equipList[0]);
                    })
                    .catch((error) => console.log(error));
            }
            else{
                // this.reset_chart();

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

        get_predict_capacity(machine_sn){
            let data = {machine_sn: machine_sn}
            this.$http
                .post('api/enms/select_predict_capacity', {data:data})
                .then(res=>{
                    this.option.series[0].data[1] = res.data[0];
                    this.$http
                        .post('api/enms/select_current_capacity', {data:data})
                        .then(res=>{
                            this.option.series[0].data[2] = res.data[0].elec;
                            console.log(res)
                            this.barChart.setOption(this.option);

                        });
                });
        },

        show_chart(item) {
            let rowColor = 'table-active';
            // reset row color
            let foundIdx = this.equipList.findIndex(x => x._classes === rowColor);
            if (foundIdx >= 0) {
                this.equipList[foundIdx]._classes = '';
            }

            // change row color to show selected
            // change existed attributes to force rendering
            //  this.equipList[foundIdx]._classes = '';
            let tempName = item.machine_name;
            item.machine_name = '123';
            item.machine_name = tempName;
            item._classes = rowColor;

            this.equipName = item.machine_name;
            this.equipElec = item.cur_month_elec;
            this.equipActivate = item.activation;

            this.get_predict_capacity(item.machine_sn);
        },

        reset_chart() {
            this.equipName = '請從右側選擇設備';
            this.equipElec = '-';
            this.equipActivate = '-';
            this.equipEventList = [];
            this.equipList = [];
            this.equipEventTimes  = '-';
            for (let ix = 0; ix < this.option.series[0].data.length; ++ix) {
                this.option.series[0].data[ix] = 0;
                // this.option.series[1].data[ix] = 0;
            }
            this.option.yAxis.min = 0;

            this.barChart.setOption(this.option);
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
