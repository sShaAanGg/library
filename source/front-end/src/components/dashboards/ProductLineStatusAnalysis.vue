<template>
    <div class="c-main">
        <CCard class="card-base">
            <h4 style="color: #98a8a0">
                <CIcon name="cil-bar-chart" size="lg" /> 產線狀態分析
            </h4>
			<CCol lg="8" class="pt-2 card-base">
                <CRow lg="8">
                <!-- <CSelect label="選擇年" :options="yearOptions" :value.sync="selectYear" /> -->
                <CSelect class="select-month" label="選擇月" :options="['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" 
                    :value.sync="selectMonth" @change="get_select_year_month(selectYear, selectMonth)"/>                                     
                <CSelect class="select-factory" label="廠區" :options="factoryOptions" 
                    :value.sync="factory" />
                <CButton
                class="btn-search"
                size="lg"
                style="color: #98a8a0"
                @click="get_equip_list(factory, yearMonth)"
                >
                search
                </CButton>                    
                </CRow>
                
			</CCol>
         
        </CCard >
        <CCard class="card-base">
            <CRow>
                <CCol>
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-chart-line" size="lg" /> 圖表數據 - {{ equipName }}
                    </h4>
                    <table class="equip-table">
                        <tr>
                            <th class="equip-elec"> 本月耗電量: {{ equipElec }} KWh</th>
                            <th class="equip-elec"> 作動時間: {{ equipWorkHours }} </th>
                        </tr>
                        <tr>
                            <th class="equip-elec"> 異常次數: {{ equipEventTimes }} </th>
                            <th class="equip-elec"> 本月稼動率: {{ equipActivate }} %</th>
                        </tr>                        
                    </table>                                    
                </CCol>
                <CCol>
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-description" size="lg" /> 設備清單
                    </h4>
                    <CDataTable
                        :items="equipList"
                        :fields="equipFields"
                        style="textalign: center; font-size: 110%; color: #98a8a0"
                        :items-per-page="15"
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
                        style="textalign: center; font-size: 110%; color: green"
                        :items-per-page="15"
                        :bordered="true"
                        pagination
                    >
                    </CDataTable>            
                </CCol> 
            </CRow>
            <CModal
                title="系統提示"
                size="xs"
                color="dark"
                :show.sync="showSearchHint"
                :closeOnBackdrop="false"
		    >
               請選擇月份與廠區testtest
            </CModal>       
            
        </CCard>

    </div>
    
    
   
</template>

<script>
export default {
    data() {
        return {
            showSearchHint: false,
            factoryOptions: ['-', '廠區一', '廠區二', '廠區三'],
            yearOptions: [2021],
            yearMonth: '',
            selectYear: 2020,
            selectMonth: '',
            factory: '',

            equipName: '請從右側選擇設備',
            equipElec: '-',
            equipWorkHours: '-',
            equipEventTimes: '-',
            equipActivate: '-',

            
            
            equipList: [],
            equipFields: [
                {key: 'machine_name', label: '設備名稱', _style: "color: #98a8a0"},
                {key: 'machine_sn', label: '財產編號', _style: "color: #98a8a0"},
                {key: 'cur_month_elec', label: '耗電量', _style: "color: #98a8a0"},
                {key: 'yoy_month_elec', label: '去年同期分析', _style: "color: #98a8a0"},
                {key: 'activation', label: '稼動率', _style: "color: #98a8a0"},
                {key: 'update_chart', label: ''}
            ],
            equipEventList: '',
            eventFields: [
                {key: 'event', label: '異常原因'},
                {key: 'start_datetime', label: '開始時間'},
                {key: 'end_datetime', label: '結束時間'}
            ]

        }
    },
    created() {
        this.get_equip_list('', '');
    },
    mounted() {

    },
    methods: {
        reset() {


        },
        get_select_year_month(selectYear, selectMonth) {

            (selectMonth < 10)  ? this.yearMonth = selectYear.toString() + '0' + (selectMonth.toString()) + '00000000'
                                : this.yearMonth = selectYear.toString() + (selectMonth.toString()) + '00000000';

        },
        get_equip_list(factory, month) {
            console.log('in get_equip_list...', factory, month);
            if (factory == '-' || month == '-') {
                this.showSearchHint = true;
            }
            this.yearMonth = month;
            this.get_select_year_month(this.selectYear, this.selectMonth);
            let data = {factory:factory, datetime:this.yearMonth};
            console.log('test');
            this.$http
                .post('api/enms/select_factory_machine_monthly_info', {data:data})
                .then((res) => {
                    this.equipList = res.data;
                    console.log(this.equipList);

                })
                .catch((error) => console.log(error));
            
        },
        show_chart(item) {
            this.equipName = item.machine_name;
            this.equipElec = item.cur_month_elec;
            this.equipActivate = item.activation;

            this.get_equip_events(item);
        },
        get_equip_events(item) {
            let data = {machine_sn:item.machine_sn};
            this.$http
                .post('api/enms/select_equip_error_log', {data:data})
                .then((res) => {
                    this.equipEventList = res.data;
                    console.log(this.equipEventList);

                })
                .catch((error) => console.log(error));            
            
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
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
}
.placeholder {
    background-color: #081d1b;
    color: white;
}
.plsaTable {
    color: #98a8a0;
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
    background: rgb(77, 107, 77);

}
.equip-table {
    position: absolute;
    left: 1vw;
}

</style>