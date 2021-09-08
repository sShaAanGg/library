<template>
    <div class="chart" id="LineChartElectricConsum" style="width: 38vw;height:43vh;">
        
    </div>

</template>

<script>
export default {
    name: "LineChartElectricConsum",
    data() {
        return {
            myChart: '',
        }
    },
    mounted() {
        this.draw_chart();
    },
    methods: {
        draw_chart() {
            console.log('in draw_chart');
            this.myChart = this.$echarts.init(document.getElementById("LineChartElectricConsum"));
            let randomNumber = Array.from({length: 30}, () => Math.floor(Math.random() * 1000));
            let xLabel = Array.from({length: 50}, () => Math.floor(1));
            var option;
            option = {
                // title: {
                //     text: '需量管理',
                //     textStyle: {
                //         fontSize: 24,
                //         color: 'green'
                //     },
                //     padding:[10,525,10, 10],
                //     borderWidth: 1,
                //     borderColor: 'green',
                //     shadowColor: 'white'
                // },
                xAxis: {
                    type: 'category',
                    data: xLabel,
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    axisLabel: {
                        show: false,
                        textStyle: {
                            color: '#D0D0D0'
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#D0D0D0'
                        }
                    },
                },
                series: [{
                    // data: [4500, 4100, 4300, 5500, 5200, 5800, 5100, 5050, 5250, 5550],
                    data: randomNumber,
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: '#ACD6FF'},
                    labelStyle: { color: '#ACD6FF'}
                }]
            };
            this.myChart.setOption(option);
        }


    },
}
</script>

<style scoped>
/* .chart {
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom:5px green solid;
} */
</style>
