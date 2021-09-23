<template>
    <div class="card-ae">
        <h6 class="card-ae-title">廠區狀態</h6>
        <div class="sensor-data">
            <h6>溫度：{{curTemp}} &#8451;</h6>
            <h6>濕度：{{curHumidity}} % </h6>
            <h6>照度：{{curIllumi}} LUX </h6>
            <h6>CO<sub>2</sub>：{{curCO2}} ppm</h6>
            <h6>PM2.5：{{curPm2dot5}} &#956;g/m<sup>3</sup></h6>
        </div>
        <ul v-if="isNormal" class="status-normal">{{normalLog[logIndex]}}</ul>
        <ul v-else class="status-abnormal"> {{abnoramlLog}}</ul>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['fromDataAe', 'curTemp', 'curHumidity', 'curIllumi','curCO2', 'curPm2dot5', 
            'isNormal', 'logIndex', 'abnoramlLog', 'abLogIdx'],
    data() {
        return {
            normalLog: ['廠區一  無異常', '廠區二  無異常', '廠區三  無異常']
        }
    },
}
</script>

<style scoped>
.card-ae {
    background-color: #0e2e2b;
}

.card-ae-title {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
.status-normal {
    color: rgb(3, 100, 3);
    font-size: 1.5vw;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
}
.status-abnormal {
    color: rgb(219, 20, 20);
    font-size: 1vw;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    
}
.sensor-data {
    position:relative;
    color:white;
    left:20%;
    font-size: 1vw;
}
</style>
