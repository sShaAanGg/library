<template>
    <div class='card-h'>
        <h2 class='card-font'>即時用電量</h2>
        <CCardBody align='center'>
            <RealTimeKilowattHourChart :realtimeElec="fromDataRt"></RealTimeKilowattHourChart>
        </CCardBody>
    </div>
</template>

<script>
import RealTimeKilowattHourChart from '@/components/charts/RealTimeKilowattHourChart';

export default {
    inject: ['reload'],
    props: [ 'fromDataRt'],
    name: `RealTimeKilowattHour`,

    data() {
        return{
        }
    },

    components: {
        RealTimeKilowattHourChart
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
