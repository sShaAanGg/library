<template>
    <div class="chart" id="main" style="width: 23vw;height:30vh;">
        <div style="display:none">{{data}}</div>
    </div>
</template>

<script>
export default {
    name: "LineChartElectricConsum",
    inject: ['reload'],
    props: [ 'data'],
    data() {
        return {
            myChart:'',
            option:{},
        }
    },
    mounted() {
        this.update_chart()

        window.onresize = () => {
            this.myChart.resize({
                width:document.getElementById('main').getBoundingClientRect().width
            });
        };
    },
    beforeUpdate() {
        this.option.visualMap.max = this.data[0];
        this.option.series[0].data = this.data;
        this.myChart.setOption(this.option);
    },
    methods: {
        update_chart() {
            this.myChart = this.$echarts.init(document.getElementById("main"));

            this.option = {
                grid: {
                    left: '0%',
                    right: '8%',
                    bottom: '1%',
                    top: '3%',
                    containLabel: true,
                },
                xAxis: {
                    max: 'dataMax',
                    axisLabel:{
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#A19991'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['契約容量(KW)', '前年度需量(KW)', '當前需量(KW)'],
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                    max: 2,
                    axisLabel:{
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white'
                    }
                },
                visualMap: {
                    show: false,
                    orient: 'horizontal',
                    left: 'center',
                    min: 0,
                    max: 250000,// this.data[0],
                    text: ['High', 'Low'],
                    dimension: 0,
                    inRange: {
                        color: ['#55A864', '#A89F5B','#AC2D2D']
                    },
                },
                series: [{
                    realtimeSort: true,
                    type: 'bar',
                    data: this.data,
                    label: {
                        show: true,
                        valueAnimation: true,
                        position: 'top',
                        fontFamily: 'monospace',
                        color:'#98a8a0',
                        fontSize: this.$utils.adjustFontSize(0.14)
                    }
                }],
                legend: {
                    show: false
                },
            }

            this.myChart.setOption(this.option);
        },
    },
    computed: {
    }
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
