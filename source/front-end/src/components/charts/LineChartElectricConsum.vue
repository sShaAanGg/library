<template>
    <div class="chart" id="main" style="width: 30vw;height:30vh;" />                  
</template>

<script>
export default {
    name: "LineChartElectricConsum",
    data() {
        return {
            myChart:'',

            option:{
                xAxis: {
                max: 'dataMax',
            },
            yAxis: {
                type: 'category',
                data: ['契約容量', '前年度', '現使用容量'],
                inverse: true,
                animationDuration: 300,
                animationDurationUpdate: 300,
                max: 2 // only the largest 3 bars will be displayed
            },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 0,
                max: 22000,
                text: ['High Score', 'Low Score'],
                // Map the score column to color
                dimension: 0,
                inRange: {
                    color: ['#00FF00', '#FFFF00','#FF0000']
                }
            },
            series: [{
                realtimeSort: true,
                name: 'X',
                type: 'bar',
                data: [22000,10000,500],
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                }
            }],
            legend: {
                show: true
            },
            animationDuration: 0,
            animationDurationUpdate: 300,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
            }
        }
    },
    created(){
    },
    mounted() {
        this.chart()
    },
    methods: {
        chart() {
            this.myChart = this.$echarts.init(document.getElementById("main"));
            this.myChart.setOption(this.option);
        }
    },
}
</script>

<style scoped>
.card-h {
    background-color: #0e2e2b;
}

.card-font {
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
</style>
