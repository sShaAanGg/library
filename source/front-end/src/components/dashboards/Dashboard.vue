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
                                <ElecStore></ElecStore>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecStore></ElecStore>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecStore></ElecStore>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecStore></ElecStore>
                            </div>
                        </CCol>
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
                                <ElecConsum></ElecConsum>
                            </div>
                        </CCol>
                        <CCol lg = '4'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecConsum></ElecConsum>
                            </div>
                        </CCol>
                        <CCol lg = '5'>
                            <div class="mb-1 mr-1 cardstyle">
                                <DemandResponse></DemandResponse>
                            </div>
                        </CCol>
                        <CCol lg = '7'>
                            <div class="mb-1 mr-1 cardstyle">
                                <ElecConsum></ElecConsum>
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
import EquipSetting from '@/components/cards/EquipSetting';

export default {
    components: {
        ElecStore,
        CarbonEmission,
        ReduceCarbonEmission,
        ElecConsum,        
        DemandResponse,
        EquipSetting,
    }
}

</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}
.cardstyle {
    /* border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom:5px green solid; */
}

</style>
