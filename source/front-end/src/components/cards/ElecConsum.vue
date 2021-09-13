<template>
    <div class="card-h">
        <h2 class="card-font">本月總耗電量</h2>
        <CRow>
            <CCol lg = '12'>
                <CCardBody>
                    <DonutChartElectricConsum v-if="isShowChart"></DonutChartElectricConsum>
                </CCardBody>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import DonutChartElectricConsum from '@/components/charts/DonutChartElectricConsum';

export default {
    components: {
        DonutChartElectricConsum
    },
    data() {
        return {
            isShowChart: true,
        }
    }
}

</script>

<style>
.card-h {
    background-color: #0e2e2b;
}

.card-font {
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
</style>
