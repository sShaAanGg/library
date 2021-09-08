<template>
    <div class="card-ec">
        <h2 class="card-title-elecconsum">本月總耗電量</h2>
        <CCardBody>
            <DonutChartElectricConsum v-if="isShowChart"></DonutChartElectricConsum>
        </CCardBody>
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
.card-ec {
    background-color: black;
    align-content: center;
    width: 38vw;
    height: 62.25vh;
    min-width: 600px;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom:5px green solid;
}
.card-title-elecconsum {
    color: green;
    font-size: 1.5vw;
    padding-left:5px;
    padding-top:5px;
    padding-bottom:5px;
    background-color: black;
    border-bottom: 1px green solid;
}
</style>
