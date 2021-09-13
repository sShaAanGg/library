<template>
    <div class='card-h'>
        <h2 class='card-font'>需量管理</h2>
        <CCardBody align='center'>
            <LineChartElectricConsum></LineChartElectricConsum>
        </CCardBody>
    </div>
</template>

<script>
import LineChartElectricConsum from '@/components/charts/LineChartElectricConsum';

export default {
    components: {
        LineChartElectricConsum
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
