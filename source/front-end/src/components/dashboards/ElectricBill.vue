<template>
    <div>
        <CCard class="card-base">
            <CCardBody>
                <h4 style="color: #98a8a0">
                    <CIcon name="cil-lightbulb" size="lg"/> 電費計算
                </h4>
                <CRow lg="12">
                    <CCol lg="6">
                        <h4 class="ml-4 mt-4" style="color: #98a8a0">
                            <CIcon name="cil-calculator" size="lg" /> 計價設定-夏季
                        </h4>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 契約容量 (月)</h5>
                            <CInput class="ml-2" size="sm"/>
                            <h5 class="ml-3 mt-1"> kW </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 需量 (月)</h5>
                            <CInput class="ml-5" size="sm"/>
                            <h5 class="ml-3 mt-1"> kW </h5>
                            <h5 class="ml-5 mt-1"> 基本電費 </h5>
                            <CInput class="ml-5" size="sm"/>
                            <h5 class="ml-3 mt-1"> 元 / 月 </h5>
                        </CRow>
                        <CRow>
                            <h5 class="ml-5 mt-1"> 流動費率 </h5>
                            <CInput class="ml-5" size="sm"/>
                            <h5 class="ml-3 mt-1"> 元 / 度 </h5>
                            <h5 class="ml-5 mt-1"> 流動電費 </h5>
                            <CInput class="ml-5" size="sm"/>
                            <h5 class="ml-3 mt-1"> 元 / 月 </h5>
                        </CRow>
                        <CRow>
                            <CButton
                            class="mr-1 btn-search"
                            size="lg"
                            >
                            儲存設定
                            </CButton>
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
                        <CSelect class="select-factory" label="廠區" :options="factoryOptions"
                            :value.sync="factory" />
                        <CSelect class="select-factory" label="年" :options="typeOptions"
                            :value.sync="machineType" />
                        <CSelect class="select-factory" label="月" :options="typeOptions"
                            :value.sync="machineType" />
                        <CButton
                        class="btn-search"
                        size="lg"
                        @click="get_equip_list(factory, selectMonth)"
                        >
                        搜尋
                        </CButton>
                        </CRow>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            maxContract: 125000,
            factoryOptions: ['全廠區'],
            typeOptions: ['全部項目'],
            factory: '全廠區',
            machineType: '全部項目',

            equipName: '',
            equipList: [],
            equipFields: [
                {key: 'factory', label: '廠區', _style: "color: #4C756A"},
                {key: 'contract', label: '契約容量(KW)', _style: "color: #4C756A"},
                {key: 'demand', label: '需量(KW)', _style: "color: #4C756A"},
                {key: 'power_consum', label: '耗電量(KWh)', _style: "color: #4C756A"},
                {key: 'elec_bill', label: '流動電費', _style: "color: #4C756A"},
            ],

            barChart: '',
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
    created() {
    },
    mounted() {
        this.barChart = this.$echarts.init(document.getElementById("barChartDemand"));
        this.barChart.setOption(this.option);
        this.option.visualMap.max = this.maxContract;
        this.option.series[0].data[0] = this.maxContract;
        this.initialize_page();
    },
    methods: {
        get_select_options(resultData) {
            for (let ix = 0; ix < resultData.length; ++ix) {
                let foundIdx = this.factoryOptions.findIndex(x => x === resultData[ix].factory);
                if (foundIdx < 0) {
                    this.factoryOptions.push(resultData[ix].factory);
                }

                // search another array
                foundIdx = this.typeOptions.findIndex(x => x === resultData[ix].type);
                if (foundIdx < 0) {
                    this.typeOptions.push(resultData[ix].type);
                }
            }
        },
        initialize_page() {
            let data = {factory:this.factory, type:this.machineType};
            this.$http
                .post('api/enms/select_machine_info_for_demand_predict', {data:data})
                .then((res) => {
                    console.log(res);
                    this.get_select_options(res.data);
                    this.equipList = res.data;
                    this.show_chart(this.equipList[0]);
                    // this.equipList[0]._classes = '';

                })
                .catch((error) => console.log(error));
        },
        get_equip_list() {
            let data = {factory:this.factory, type:this.machineType};
            this.$http
                .post('api/enms/select_machine_info_for_demand_predict', {data:data})
                .then((res) => {
                    this.equipList = res.data;
                    this.show_chart(this.equipList[0]);
                })
                .catch((error) => console.log(error));
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
