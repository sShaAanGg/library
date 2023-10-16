<template>
    <div class='card-h'>
        <h2 class='card-font'>本月需量管理</h2>
        <CCardBody align='center'>
            <BarChartDemand :data="fromDataDr"></BarChartDemand>
        </CCardBody>
    </div>
</template>

<script>
import BarChartDemand from '@/components/charts/BarChartDemand';
export default {
    inject: ['reload'],
    props: [ 'fromDataDr' ],
    components: {
        BarChartDemand
    },
    data() {
        return {
        }
    },

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
