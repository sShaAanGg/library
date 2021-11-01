<template>
    <div>
        <CCard class="card-base">
            <CCardBody>
                <h4 style="color: #98a8a0">
                    <CIcon name="cil-lightbulb" size="lg"/> 電費預估
                </h4>
                <CRow lg="12">
                    <CCol lg="6">
                        <CRow>
                            <CCol class="ml-5" lg="4">
                                <CCallout color="info">
                                    <small class="mt-5 text-muted"><CIcon name="cil-dollar" style="color:#3399FF"/> 基本電費</small><br>
                                    <strong class="h4" style="color:#FFFFFF">{{ demandCharge }}</strong>
                                </CCallout>
                            </CCol>
                            <CCol lg="6">
                                <CCallout color="info">
                                    <small class="text-muted"><CIcon name="cil-dollar" style="color:#3399FF"/> 流動電費</small><br>
                                    <strong class="h4" style="color:#FFFFFF">{{ energyCharge }}</strong>
                                </CCallout>
                            </CCol>
                        </CRow>
                        <CRow>
                            <div class="ml-3 mt-5" id="barChartDemand" style="width:40vw;height:50vh"></div>
                        </CRow>

                    </CCol>
                    <CCol lg="6" class="card-base">
                        <h4 class="mt-4" style="color: #98a8a0">
                            <CIcon name="cil-description" size="lg" /> 廠區用電
                        </h4>
                        <CRow lg="8">
                        <CSelect class="select-factory" label="年" :options="yearOptions"
                            :value.sync="selectYear" />
                        <CSelect class="select-factory" label="月" :options="monthOptions"
                            :value.sync="selectMonth" />
                        <CButton
                        class="btn-search"
                        size="lg"
                        @click="get_factory_list()"
                        >
                        搜尋
                        </CButton>
                        </CRow>
                        <CDataTable
                            :items="factoryList"
                            :fields="factoryFields"
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
                        <h4 class="mt-4" style="color: #98a8a0">
                            <CIcon name="cil-calculator" size="lg" /> 計價設定- {{period}}
                        </h4>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 契約容量 (月)</h5>
                            <CInput class="ml-2" size="sm" v-model="contractCapacity"/>
                            <h5 class="ml-3 mt-1"> KW </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 需量 (月)</h5>
                            <CInput class="ml-5" size="sm" v-model="demand"/>
                            <h5 class="ml-3 mt-1"> KW </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 總耗電量 (月)</h5>
                            <CInput class="ml-2" size="sm" v-model="totalElecConsum"/>
                            <h5 class="ml-3 mt-1"> KWh </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 基本費率 </h5>
                            <CInput class="ml-5" size="sm" v-model="contractPrice"/>
                            <h5 class="ml-3 mt-1"> 元 / KW </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 流動費率 </h5>
                            <CInput v-if="period==='夏季'" class="ml-5" size="sm" v-model="summerPrice"/>
                            <CInput v-if="period==='非夏季'" class="ml-5" size="sm" v-model="normalPrice"/>
                            <h5 class="ml-3 mt-1"> 元 / 度 </h5>
                        </CRow>
                        <CRow>
                            <CCol lg="6"/>
                            <CButton
                            class="ml-5 mb-5 btn-search"
                            size="lg"
                            @click="compute_charge()"
                            >
                            儲存設定
                            </CButton>
                        </CRow>

                        <!-- <h4 class="mt-4" style="color: #98a8a0">
                            <CIcon name="cil-description" size="lg" /> 機台用電 - {{factory}}
                        </h4>
                        <CDataTable
                            :items="machineList"
                            :fields="machineFields"
                            style="textalign: center; font-size: 110%;"
                            :items-per-page="5"
                            :bordered="true"
                            pagination
                        >
                        </CDataTable> -->
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard >
    </div>
</template>

<script>
export default {
    data() {
        return {
            period: '',
            contractCapacity: 125000,
            demand: 0,
            totalElecConsum: '',
            contractPrice: 177,
            summerPrice: 1.81,
            normalPrice: 112,
            demandCharge: 12310,
            energyCharge: 256321,
            // peakPrice: '',
            // shoulderPrice: '',
            // offPeakPrice: '',

            datetime: '',
            yearOptions: ['2020', '2021'],
            selectYear: '',
            monthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            selectMonth: '',
            factory: '',

            equipName: '',
            factoryList: [],
            factoryFields: [
                {key: 'factory', label: '廠區', _style: "color: #4C756A"},
                {key: 'demand', label: '需量(KW)', _style: "color: #4C756A"},
                {key: 'elec', label: '耗電量(KWh)', _style: "color: #4C756A"},
                {key: 'charge', label: '流動電費', _style: "color: #4C756A"},
            ],

            machineList: [],
            machineFields: [
                {key: 'machine_name', label: '機台名稱', _style: "color: #4C756A"},
                {key: 'factory', label: '廠區', _style: "color: #4C756A"},
                {key: 'demand', label: '需量(KW)', _style: "color: #4C756A"},
                {key: 'elec', label: '耗電量(KWh)', _style: "color: #4C756A"},
                {key: 'elec_bill', label: '流動電費', _style: "color: #4C756A"},
            ],

            barChart: '',
            barChartData: '',
            defaultFactory: '',
            option: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    textStyle: {
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white',
                        padding: [5, 10, 5, 10]
                    },
                    right: '5%',

                },
                series: [
                    {
                        type: 'pie',
                        right: '30%',
                        radius: ['65%', '85%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            color: '#FFFFFF',
                            fontSize: '20',
                            textBorderWidth: 0,
                            position: 'center',
                            formatter: () => {
                                return this.defaultFactory;
                            },
                        },

                        // emphasis: {
                        //     focus: 'series',
                        //     label: {
                        //         show: true,
                        //         fontSize: '20px',
                        //     }
                        // },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 1000, name: '廠區一'},
                            {value: 1000, name: '廠區二'},
                            {value: 1000, name: '廠區三'},
                        ],
                        color: [
                            '#175580',
                            '#346780',
                            '#3C968D',
                            // '#388C6C'
                        ]
                    }
                ]
            }

        }
    },
    async created() {
        await this.get_select_options();
        this.selectYear = new Date().getFullYear().toString();
        this.selectMonth = new Date().getMonth();
        this.get_factory_list();
    },
    mounted() {

        this.barChart = this.$echarts.init(document.getElementById("barChartDemand"));
        this.barChart.setOption(this.option);
        // this.initialize_page();
    },
    methods: {
        compute_format_datetime() {
            this.datetime = (this.selectMonth < 10) ? (this.selectYear + '0' + this.selectMonth + '01000000')
                                                    : (this.selectYear + this.selectMonth + '01000000');
        },
        get_select_options() {
            return new Promise((resolve, reject) => {
                let data = {datetime:this.datetime};
                this.$http
                    .post('api/enms/select_options', {data: data})
                    .then((res) => {
                        this.yearOptions = [];
                        for(let ix = 0; ix < res.data[0].length; ++ix){
                            this.yearOptions.push(res.data[0][ix]);
                        }
                        resolve();
                    })
                    .catch((err) => {reject(err)});
            })
        },
        compute_charge() {
            this.demandCharge = this.demand * this.contractPrice;
            this.energyCharge = (this.totalElecConsum * this.summerPrice).toFixed(2);
            this.totalElecConsum = parseFloat(this.totalElecConsum.toFixed(2));
        },
        get_factory_list() {
            this.compute_format_datetime();
            this.period = (this.selectMonth >= 6 && this.selectMonth <= 9) ? '夏季' : '非夏季';
            let data = {factory:this.factory, datetime:this.datetime};
            this.$http
                .post('api/enms/select_factory_info_for_elec_bill', {data:data})
                .then((res) => {
                    console.log('result:', res);
                    // this.factoryList = res.data;
                    this.demand = 0;
                    this.totalElecConsum = 0;
                    this.factoryList = [];
                    let elecChargeList = [];
                    let areaList = [];
                    for (let ix = 0; ix < res.data.length; ++ix) {
                        this.demand = (res.data[ix].demand > this.demand) ? res.data[ix].demand : this.demand;
                        this.totalElecConsum += res.data[ix].elec;
                        let tempData = JSON.parse(JSON.stringify(res.data[ix]));
                        tempData['charge'] = parseFloat((JSON.parse(JSON.stringify(res.data[ix].elec)) * this.summerPrice).toFixed(2));
                        this.factoryList.push(tempData);
                        elecChargeList.push(tempData['charge']);
                        areaList.push(tempData.factory);
                    }

                    this.option.series[0].data = [];
                    let copyData = JSON.parse(JSON.stringify(elecChargeList));
                    let sortElecCharge = copyData.sort((a, b) => b - a);
                    for (let iy = 0; iy < sortElecCharge.length; ++iy) {
                        let foundIdx = elecChargeList.findIndex(x => x == sortElecCharge[iy]);
                        if(iy === 0) {
                            this.defaultFactory = areaList[foundIdx] + "\n" + elecChargeList[foundIdx].toString();
                        }
                        this.option.series[0].data.push({value: elecChargeList[foundIdx],
                                                        name: areaList[foundIdx] + "\n" + elecChargeList[foundIdx].toString()});
                    }
                    this.compute_charge();
                    this.barChart.setOption(this.option);

                    // this.show_chart(this.factoryList[0]);
                    // this.equipList[0]._classes = '';
                })
                .catch((error) => console.log(error));
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
            this.get_predict_capacity(item.machine_sn);
        },
    }
}

</script>

<style scope>
.table {
    color: white;
}
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
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
</style>
