<template>
    <div class="card-ec">
        <h2 class="card-font">本月總耗電量</h2>
        <CRow>
            <CCol lg = '12'>
                <CCardBody>
                    <DonutChartElectricConsum></DonutChartElectricConsum>
                </CCardBody>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import DonutChartElectricConsum from '@/components/charts/DonutChartElectricConsum';

export default {
    name: "ElecConsum",
    components: {
        DonutChartElectricConsum
    },
}

</script>

<style>
.card-ec {
    background-color: #0e2e2b;
    height: 37.5vh;
}

.card-font {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
</style>
