<template>
    <div>
        <div class="card-base">
            <CRow :gutters="false">
                <CCol lg = '2'>
                    <CCol lg= '12'>
                        <div class="mb-1 cardstyle">
                            <ElecStore></ElecStore>
                        </div>
                    </CCol>
                    <CCol lg= '12'>
                        <div class="mb-1 cardstyle">
                            <CarbonEmission></CarbonEmission>
                        </div>
                    </CCol>
                    <CCol lg = '12'>
                        <div class="mb-1 cardstyle">
                            <ReduceCarbonEmission></ReduceCarbonEmission>
                        </div>
                    </CCol>
                </CCol>
                <CCol lg='10'>
                    <CRow :gutters="false">
                        <CCol lg = '6'>
                            <div class="mb-1 cardstyle">
                                <ElecConsum></ElecConsum>
                            </div>
                        </CCol>
                        <CCol lg = '6'>
                            <div class="mb-1 cardstyle">
                                <DemandResponse></DemandResponse>
                            </div>
                        </CCol>
                        <CCol lg = '12'>
                            <div class="mb-1 cardstyle">
                                <EquipSetting></EquipSetting>
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
        EquipSetting
    }
}

</script>

<style scope>
.card-base {
    background-color: #000000;
    border-color: #272727;
}


</style>
