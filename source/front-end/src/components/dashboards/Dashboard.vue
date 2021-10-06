<template>

    <div class="c-main">
        <CRow class="card-base" >
            <CCol lg = '2' class="pt-2">
                <CRow>
                    <CCol lg = '12'>
                        <div class="mb-1 mr-1 cardstyle">
                            <ElecStore :fromDataEs="elecStore"></ElecStore>
                        </div>
                    </CCol>
                    <CCol lg = '12'>
                        <div class="mb-1 mr-1 cardstyle">
                            <CarbonEmission :fromDataCe="cEmission"></CarbonEmission>
                        </div>
                    </CCol>
                    <CCol lg = '12'>
                        <div class="mb-1 mr-1 cardstyle">
                            <ReduceCarbonEmission :fromDataRce="reducedCEmission"></ReduceCarbonEmission>
                        </div>
                    </CCol>
                    <CCol lg = '12'>
                        <div class="mb-1 mr-1 cardstyle">
                            <AbnormalEvent 
                                :fromDataAe="eventLog"
                                :curTemp="temperature"
                                :curHumidity="humidity"
                                :curIllumi="illuminance"
                                :curCO2="carbonDioxide"
                                :curPm2dot5="pm2dot5"
                                :isNormal="curIsNormal"
                                :logIndex="curLogIndex"
                                :abnoramlLog="curAbnormalLog"
                            />
                        </div>
                    </CCol>
                    <!-- <CCol lg = '12'>
                        <div class="mb-1 mr-1 cardstyle">
                            <ElecStore></ElecStore>
                        </div>
                    </CCol> -->
                </CRow>
            </CCol>
            <CCol lg = '10' class="pt-2">
                <CRow>
                    <CCol lg = '4'>
                        <div class="mb-1 mr-1 cardstyle">
                            <ElecConsum :fromDataEc="getElecConsumData"></ElecConsum>
                        </div>
                    </CCol>
                    <CCol lg = '4'>
                        <div class="mb-1 mr-1 cardstyle">
                            <DemandResponse :fromDataDr="elecCapacity"></DemandResponse>
                        </div>
                    </CCol>
                    <CCol lg = '4'>
                        <div class="mb-1 mr-1 cardstyle">
                            <RealTimeKilowattHour :fromDataRt="realTimeKilowattHourData"></RealTimeKilowattHour>
                        </div>
                    </CCol>
                    <CCol lg = '8'>
                        <div class="mb-1 mr-1 cardstyle">
                            <HistoryAnalysis :fromDataHa="getBarData"></HistoryAnalysis>
                        </div>
                    </CCol>
                    <CCol lg = '4'>
                        <div class="mb-1 mr-1 cardstyle">
                            <EquipControl></EquipControl>
                        </div>
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
    </div>

</template>

<script>

import ElecStore from '@/components/cards/ElecStore';
import CarbonEmission from '@/components/cards/CarbonEmission';
import ReduceCarbonEmission from '@/components/cards/ReduceCarbonEmission';
import ElecConsum from '@/components/cards/ElecConsum';
import DemandResponse from '@/components/cards/DemandResponse';
import EquipControl from '@/components/cards/EquipControl';
import HistoryAnalysis from '@/components/cards/HistoryAnalysis';
import AbnormalEvent from '@/components/cards/AbnormalEvent';
import RealTimeKilowattHour from '@/components/cards/RealTimeKilowattHour';

export default {
    components: {
        ElecStore,
        CarbonEmission,
        ReduceCarbonEmission,
        ElecConsum,        
        DemandResponse,
        EquipControl,
        HistoryAnalysis,
        AbnormalEvent,
        RealTimeKilowattHour
    },

    data(){
        return{
            // data to show on dashboard
            elecStore: 0,
            cEmission: '',
            reducedCEmission: '',
            
            // data to plot graph
            cEmissionLastYear: [],
            cEmissionThisYearBefore:[],
            cEmissionThisYear: [],
            cEmissionLastTime: '',
            realTimeKilowattHourData: 0,
            // elecCapacity:[22000,Math.round(Math.random() * 22000),Math.round(Math.random() * 22000)],
            contractCapacity: 70000,
            elecCapacity: [50000, 15000, 5000], 
            getElecConsumData: [],
            getBarData: [],

            // sensor data and event log
            eventLog: '',
            temperature: '', 
            humidity: '',
            illuminance: '',
            carbonDioxide: '',
            pm2dot5: '',
            curIsNormal: true,
            curLogIndex: 0,
            curAbnormalLog: '',
            abnormalStatus: {},
            abnormalLogs: [],
            canGetNew: true

        }
    },

    created() {
    },

    mounted(){
        /* Initailize all values */
        // get carbon emission of 23 month data at the beginning
        // this.cEmissionLastYear = [170, 220, 340, 460, 580, 700, 460, 230, 450, 780, 340, 120,
        //                                 200, 190, 280, 340, 620, 750, 290, 310];
        // get carbon emission of this month last year
        this.temperature = (Math.random() * 15 + 20).toFixed(1);
        this.humidity = (Math.random() * 20 + 40).toFixed(2);
        this.illuminance = (Math.random() * 100 + 500).toFixed(2);
        this.carbonDioxide = (Math.random() * 100 + 300).toFixed(2);
        this.pm2dot5 = (Math.random() * 20 + 10).toFixed(2);
        this.curLogIndex = 0;
        this.get_history_data();
        this.get_cur_month_elec();
        this.update_factory_status();
        this.get_real_time_elec();
        this.get_sensor_data();
        this.check_abnormal_event();
        

        setInterval(() => {
            this.get_cur_month_elec();
            this.get_real_time_elec();
            this.get_sensor_data();
            this.update_factory_status();
        }, 2000);

        setInterval(() => {
            this.get_cur_abnormal_event();
        }, 100);
        setInterval(() => {
            this.check_abnormal_event();
        }, 100);

        // update history data every day
        // setInterval(() => {
        //     this.get_history_data();
        // }, 86400000);
    },
    methods: {
        get_history_data() {
            // let curDate = new Date();
            // let curTime = curDate.getHours() + ':' + curDate.getMinutes() 
            //                 + ':' + curDate.getSeconds() + ':' + curDate.getMilliseconds();
            // console.log('***before API:', curTime);
            this.$http
                .get('api/enms/select_two_years_electricity_consumption')
                .then(res=> {
                    let todayDate = new Date();
                    let curMonth = todayDate.getMonth();
                    // this.cEmissionLastYear = [];
                    // this.cEmissionThisYearBefore = [];
                    for (let ix = 0; ix < Object.keys(res.data).length; ix++) {
                        if (ix > 22) break;
                        (ix < 12)   ? this.cEmissionLastYear.push((0.554 * JSON.parse(res.data[ix].electricity)).toFixed(2)) 
                                    : this.cEmissionThisYearBefore.push((0.554 * JSON.parse(res.data[ix].electricity)).toFixed(2));
                    }
                    // this.cEmissionLastYear = this.cEmissionLastYear.map(x=>x * 0.554);
                    // console.log('after:', this.cEmissionLastYear);
                    this.cEmissionLastTime = this.cEmissionLastYear[curMonth];
                    // console.log(this.cEmissionThisYear);
                    this.cEmissionLastYear = this.cEmissionLastYear.map(Number);
                    this.cEmissionThisYearBefore = this.cEmissionThisYearBefore.map(Number);
                    this.elecCapacity = [this.contractCapacity, 0, 0];
                    for (let iy = 0; iy < 12; iy++){
                        this.elecCapacity[1] += this.cEmissionLastYear[iy];
                        if (iy < this.cEmissionThisYearBefore.length) {
                            this.elecCapacity[2] += this.cEmissionThisYearBefore[iy];
                        }                                                                
                    }
                    this.elecCapacity[1] = this.elecCapacity[1].toFixed(2);
                    this.elecCapacity[2] = this.elecCapacity[2].toFixed(2);
                });
            // let curDateAfter = new Date();
            // let curTimeAfter = curDateAfter.getHours() + ':' + curDateAfter.getMinutes() 
            //                     + ':' + curDateAfter.getSeconds() + ':' + curDateAfter.getMilliseconds();
            // console.log('***after API:', curTimeAfter);
 
        },

        get_cur_month_elec() {
            // let curDate = new Date();
            // let curTime = curDate.getHours() + ':' + curDate.getMinutes() 
            //                 + ':' + curDate.getSeconds() + ':' + curDate.getMilliseconds();
            // console.log('***before API get_cur_month_elec:', curTime);            
            this.$http
                .get('api/enms/select_current_month_cumulative_electricity_consumption')
                .then(res=>{
                    this.getElecConsumData = [JSON.parse(res.data[0]), JSON.parse(res.data[1]), JSON.parse(res.data[2])];
                    this.cEmission = (0.509 * (this.getElecConsumData[0] 
                                                + this.getElecConsumData[1] 
                                                + this.getElecConsumData[2])).toFixed(2);

                    // do not use deep copy                                                
                    this.cEmissionThisYear = Object.assign([], this.cEmissionThisYearBefore);

                    this.cEmissionThisYear.push(this.cEmission);
                    this.getBarData.push(this.cEmissionLastYear, this.cEmissionThisYear);
                    this.reducedCEmission = (this.cEmissionLastTime - this.cEmission).toFixed(2);
                });
            // let curDateAfter = new Date();
            // let curTimeAfter = curDateAfter.getHours() + ':' + curDateAfter.getMinutes() 
            //                     + ':' + curDateAfter.getSeconds() + ':' + curDateAfter.getMilliseconds();
            // console.log('***after API get_cur_month_elec:', curTimeAfter);
            // console.log('barData:', this.getBarData);        

        },

        update_factory_status() {
            let lastLogIndex = this.curLogIndex;
            (lastLogIndex === 2) ? this.curLogIndex = 0 : this.curLogIndex = lastLogIndex + 1;
        },

        get_cur_abnormal_event() {        
            if (this.abnormalLogs.length && this.canGetNew) {
                let newestLog = Object.assign([],this.abnormalLogs[0]);
                let newestIdx = 0;
                for(let iz = 1; iz < this.abnormalLogs.length; ++iz) {
                    if (this.abnormalLogs[iz].time > newestLog.time) {
                        newestLog = Object.assign([],this.abnormalLogs[iz]);
                        newestIdx = iz;
                    }
                }
            
                this.curAbnormalLog = newestLog.event;
                
                this.curIsNormal = false;
                this.canGetNew = false;
                setTimeout(() => {
                    this.canGetNew = true;
                    this.abnormalLogs.splice(newestIdx, 1);
                }, 3000)
            }
            else if(this.abnormalLogs.length == 0 ){
                this.curIsNormal = true;
            }
        },
        check_abnormal_event() {
            this.$http
                .get('/api/enms/select_event_log')
                .then(res=> {
                    for (let ix = 0; ix < res.data.length; ix++) {
                        let eventLog = '';
                        switch (res.data[ix].factory) {
                            case '廠區一':
                                // eventLog = '廠區一' + res.data[ix].equipment + ' ' + res.data[ix].event;
                                eventLog = '廠區一異常';
                                break;
                            case '廠區二':
                                // eventLog = '廠區二' + res.data[ix].equipment + ' ' + res.data[ix].event;
                                eventLog = '廠區二異常';
                                break;
                            case '廠區三':
                                // eventLog = '廠區三' + res.data[ix].equipment + ' ' + res.data[ix].event;
                                eventLog = '廠區三異常';
                                break;                                                                  
                        }
                        if (eventLog){
                            if (this.abnormalLogs.length == 0) {
                                this.abnormalLogs.push({'event':eventLog, 'hasShown':false, 'time':res.data[ix].datetime});
                            }
                            else {
                                for (let iy = 0; iy < this.abnormalLogs.length; ++iy) {
                                    if (this.abnormalLogs[iy].event == eventLog) {
                                        this.abnormalLogs[iy].hasShown = false;
                                        this.abnormalLogs[iy].time = res.data[ix].datetime;
                                        break;
                                    }
                                    if (iy == this.abnormalLogs.length - 1) {
                                        this.abnormalLogs.push({'event':eventLog, 'hasShown':false, 'time':res.data[ix].datetime});
                                        break;
                                    }                                        

                                }

                            }


                        }
                    }
                

                });
            // for(let iz = 0; iz < this.abnormalLogs.length; ++iz) {
            //     let nowDate = new Date();
            //     let getTime = nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds(); 
            //     console.log(getTime, iz, this.abnormalLogs[iz].event, this.abnormalLogs[iz].time);
            // }
        },

        get_real_time_elec() {
            this.$http
                .get('/api/enms/select_real_time_electricity_consumption')
                .then(res=> {
                    this.realTimeKilowattHourData = parseFloat(res.data).toFixed(2);
                });      
        },

        get_sensor_data() {
            this.temperature = (Math.random() * 15 + 20).toFixed(1);
            this.humidity = (Math.random() * 20 + 40).toFixed(2);
            this.illuminance = (Math.random() * 100 + 500).toFixed(2);
            this.carbonDioxide = (Math.random() * 100 + 300).toFixed(2);
            this.pm2dot5 = (Math.random() * 20 + 10).toFixed(2);
        }


    }
}

</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}

</style>
