<template>
    <div>
        <div >
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
            cEmissionLastTime: '',
            realTimeKilowattHourData: 0,
            elecCapacity:[22000,Math.round(Math.random() * 22000),Math.round(Math.random() * 22000)],
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
            curLogIndex: ''

        }
    },

    created() {
    },

    mounted(){
        /* Initailize all values */
        // get carbon emission of 23 month data at the beginning
        this.cEmissionLastYear = [170, 220, 340, 460, 580, 700, 460, 230, 450, 780, 340, 120,
                                        200, 190, 280, 340, 620, 750, 290, 310];
        // get carbon emission of this month last year
        this.cEmissionLastTime = Math.round(Math.random() * 10000);

        this.cEmission = Math.round(Math.random() * 10000);
        this.reducedCEmission = this.cEmissionLastTime - this.cEmission;  
        this.temperature = (Math.random() * 15 + 20).toFixed(1);
        this.humidity = (Math.random() * 20 + 40).toFixed(2);
        this.illuminance = (Math.random() * 100 + 500).toFixed(2);
        this.carbonDioxide = (Math.random() * 100 + 300).toFixed(2);
        this.pm2dot5 = (Math.random() * 20 + 10).toFixed(2);
        this.curLogIndex = 0;


        // get carbon emission of this month every 10 minutes      
        setInterval(() => {
            this.cEmission = Math.round(Math.random() * 10000);
            this.reducedCEmission = this.cEmissionLastTime - this.cEmission;
            this.temperature = (Math.random() * 15 + 20).toFixed(1);
            this.humidity = (Math.random() * 20 + 40).toFixed(2);
            this.illuminance = (Math.random() * 100 + 500).toFixed(2);
            this.carbonDioxide = (Math.random() * 100 + 300).toFixed(2);
            this.pm2dot5 = (Math.random() * 20 + 10).toFixed(2);
            
            let lastLogIndex = this.curLogIndex;
            (lastLogIndex === 2) ? this.curLogIndex = 0 : this.curLogIndex = lastLogIndex + 1;

        }, 2000);

        setInterval(() => {
            let lastIsNormal = this.curIsNormal;
            this.curIsNormal = !lastIsNormal;
            setTimeout(() => {
                this.curIsNormal = lastIsNormal;
            }, 5000);
        }, 20000);

        setInterval(() => {
            // periodically call api to get updated data
            this.realTimeKilowattHourData = (Math.random() * 10000).toFixed(2) - 0;
            this.elecCapacity = [22000,Math.round(Math.random() * 22000),Math.round(Math.random() * 22000)];
            this.getElecConsumData =  [Math.round(Math.random() * 10000), 
                                        Math.round(Math.random() * 10000),
                                        Math.round(Math.random() * 10000),
                                        Math.round(Math.random() * 10000)];
           
            this.getBarData = [[170, 220, 340, 460, 580, 700, 460, 230, 450, 780, 340, 120],
                            [200, 190, 280, 340, 620, 750, 290, 310, 500, 680, 300, 100]];
        }, 2000); 
        
        // get event log every 5 minutes
        setInterval(() => {
            let choose = Math.round(Math.random() * 10);
            if (choose < 6) {
                this.eventLog =[{'time':'09:11:12', 'area':'廠區一', 'event':'水冷機故障'}, 
                                {'time':'09:10:23', 'area':'廠區三', 'event':'馬達故障'}];
            }
            else this.eventLog = '';
        }, 500)



    }    
}

</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}


</style>
