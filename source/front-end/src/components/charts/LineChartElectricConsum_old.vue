<template>
    <div class="chart" id="main" style="width: 20vw;height:21.5vh;" />                  
</template>

<script>
export default {
    name: "LineChartElectricConsum",
    data() {
        return {
            myChart:'',

            option:{
                grid: {
                    left: '3%',
                    right: '0%',
                    bottom: '15%',
                    top: '0%',
                    containLabel: true,
                    color: '#C9BDB5'
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel: {
                        textStyle: {
                            color: '#C9BDB5',
                            fontSize: this.$utils.adjustFontSize(16)
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#A19991'
                    }
            }                    
                },
                yAxis: {
                    type: 'category',
                    data: ['契約容量', '前年度', '現使用容量'],
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                    max: 2, // only the largest 3 bars will be displayed
                    axisLabel: {
                        textStyle: {
                            color: '#C9BDB5',
                            fontSize: this.$utils.adjustFontSize(0.16)
                        }
                    }
                }   ,
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    min: 0,
                    max: 22000,
                    text: ['High Score', 'Low Score'],
                    // Map the score column to color
                    dimension: 0,
                    inRange: {
                        color: ['#55A864', '#A89F5B','#AC2D2D']
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#C9BDB5',
                            fontSize: this.$utils.adjustFontSize(0.16)
                        }
                    }
                },
                series: [{
                    // realtimeSort: true,
                    name: 'X',
                    type: 'bar',
                    data: [22000,10000,500],
                    // label: {
                    //     show: true,
                    //     position: 'right',
                    //     valueAnimation: true
                    // }
                }],
                animationDuration: 0,
                animationDurationUpdate: 300,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear',

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
