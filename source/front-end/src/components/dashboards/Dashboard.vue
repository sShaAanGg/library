<template>
    <!-- <div class="charts">
    <div id="LineChartElectricConsum" style="height: 350px;"></div>
    </div> -->
    <div class="fullpage">
        <CCard class="card-1">
            <CCardBody>
                <h4 style="color: #d686bc">
                    <CIcon name="cil-factory" size="lg" /> 儀表板
                </h4>
                <CRow alignHorizontal="center">
                    <CCol>
                        <CRow alignHorizontal="center">
                            <ElecStore></ElecStore>
                        </CRow>
                        <CRow alignHorizontal="center">
                            <CarbonEmission></CarbonEmission>
                        </CRow>
                        <CRow alignHorizontal="center">
                            <ReduceCarbonEmission></ReduceCarbonEmission>
                        </CRow>
                    </CCol>
                    <CCol xs="5">
                        <ElecConsum></ElecConsum>
                    </CCol>
                    <CCol sm="5">
                        <DemandResponse></DemandResponse>
                    </CCol>
                </CRow>
                <CRow alignHorizontal="center">
                    <CCol xs="5">
                        <EquipSetting></EquipSetting>
                    </CCol>
                </CRow>
                <!-- <CRow>
                        <label class="c-switch c-switch-pill c-switch-label c-switch-dark">
                            <input type="checkbox" class="c-switch-input" checked>
                            <span class="c-switch-slider" data-checked="On" data-unchecked="Off"></span>
                        </label>
                    </CRow> -->
            </CCardBody>
        </CCard>
    </div>
</template>

<script>
import CarbonEmission from '@/components/cards/CarbonEmission';
import ElecConsum from '@/components/cards/ElecConsum';
import ElecStore from '@/components/cards/ElecStore';
import ReduceCarbonEmission from '@/components/cards/ReduceCarbonEmission';
import DemandResponse from '@/components/cards/DemandResponse';
import EquipSetting from '@/components/cards/EquipSetting';

export default {
    components: {
        ElecConsum,
        ElecStore,
        CarbonEmission,
        ReduceCarbonEmission,
        DemandResponse,
        EquipSetting
    }
}

</script>

<style scope>
ElecConsum .background {
    background-color: #272727;
}
ElecStore .background {
    background-color: #272727;
}
CarbonEmission .background {
    background-color: #272727;
}
ReduceCarbonEmission .background {
    background-color: #272727;
}
.card-1 {
    background-color: #000000;
    border-color: #272727;
    height: 1000px;
}
.fullpage {
    border-color: #272727;
}
.c-switch {
    color: green;
}
</style>
