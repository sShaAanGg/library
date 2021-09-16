<template>
    <div class='card-h'>
        <h2 class='card-font'>年度碳排量比較</h2>
        <CCardBody align='center'>
            <BarChartHistory :barData="fromDataHa"></BarChartHistory>
        </CCardBody>
    </div>
</template>

<script>
import BarChartHistory from '@/components/charts/BarChartHistory';

export default {
    inject: ['reload'],
    props: ['fromDataHa'],
    name: "HistoryAnalysis",
    components: {
        BarChartHistory
    }

}
</script>

<style>
.card-h {
    background-color: #0e2e2b;
}

.card-font {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
</style>
