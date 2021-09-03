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
                    <CRow></CRow>
                    <CRow alignHorizontal="center">
                        <CCol xs="5">
                        <ElecConsum></ElecConsum>
                        </CCol>
                        <!-- <CCol xs="5"></CCol> -->

                        <CCol sm="5">
                        <RequireManage></RequireManage>
                        </CCol>
                    </CRow>
                    <CRow alignHorizontal="center">
                        <CCol xs="1">
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
import ElecConsum from '@/components/cards/ElecConsum';
import RequireManage from '@/components/cards/RequireManage';
import EquipSetting from '@/components/cards/EquipSetting';

export default {
    components: {
        ElecConsum,
        RequireManage,
        EquipSetting   
    }
}

</script>

<style scope>
                ElecConsum
.background {
	background-color: #272727;
}
.card-1 {
	background-color:#000000;
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