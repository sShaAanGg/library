<template>
    <div>
        <div >
            <CRow class="card-base" >
                <CCol lg = '2' class="pt-2">
                    <CRow>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecStore></ElecStore>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <CarbonEmission></CarbonEmission>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ReduceCarbonEmission></ReduceCarbonEmission>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <AbnormalEvent></AbnormalEvent>
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
                                <ElecConsum></ElecConsum>
                            </div>
                        </CCol>
                        <CCol lg = '4'>
                            <div class="mb-1 mr-1 cardstyle">
                                <DemandResponse :data="dataArray"></DemandResponse>
                            </div>
                        </CCol>
                        <CCol lg = '4'>
                            <div class="mb-1 mr-1 cardstyle">
                                <RealTimeKilowattHour :fromDashboardData="realTimeKilowattHourData"></RealTimeKilowattHour>
                            </div>
                        </CCol>
                        <CCol lg = '8'>
                            <div class="mb-1 mr-1 cardstyle">
                                <HistoryAnalysis></HistoryAnalysis>
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
            realTimeKilowattHourData: 0,
            dataArray:[22000,Math.round(Math.random() * 22000),Math.round(Math.random() * 22000)],
        }
    },

    created() {
    },

    mounted(){
        setInterval(() => {
            this.realTimeKilowattHourData = (Math.random() * 10000).toFixed(2) - 0;
            this.dataArray = [22000,Math.round(Math.random() * 22000),Math.round(Math.random() * 22000)]
        }, 2000);
    }    
}

</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}


</style>
