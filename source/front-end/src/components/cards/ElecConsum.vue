<template>
    <div class="card">
        <h2 class="card-title">本月總耗電量</h2>
        <DonutChartElectricConsum></DonutChartElectricConsum>
    </div>
</template>

<script>
import DonutChartElectricConsum from '@/components/charts/DonutChartElectricConsum';

export default {
    components: {
        DonutChartElectricConsum
    }
}

</script>

<style>
.card {
    background-color: black;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom: 5px green solid;
}
.card-title {
    color: green;
    font-size: 24px;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: black;
    border-bottom: 1px green solid;
}
</style>