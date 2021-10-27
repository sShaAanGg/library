<template>
    <div id="barChart" style="width:53vw;height:40vh">
        <div style="display:none"> {{ barData }} </div>
    </div>
</template>

<script>
var barData3 = [1, 2,3];
export default {
    inject:['reload'],
    props: ['barData'],
    name: "BarChartHistory",

    data() {
        return {
            cEmissionLastYear: [],
            cEmissionThisYearBefore: [],

            myBarChart:'',
            option: {
                legend: {},
                grid: {
                    left: '7%',
                    bottom: '7%'
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        fontSize: this.$utils.adjustFontSize(0.16)
                    },
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    // data: [{value:'Jan', textStyle: {fontSize: this.$utils.adjustFontSize(0.16)}}, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: this.$utils.adjustFontSize(0.16)
                    },
                },
                series: [
                    {
                        data: '',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            color: '#0F8ABF',
                        },
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    },
                    {
                        data: '',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            color: '#388C6C'
                        },
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    },
                    {
                        data: '',
                        type: 'line',
                        showSymbol: false,
                        itemStyle: {
                            color: '#92BED4'
                        },
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    },                                   
                ]
            }
                
        }
    },
    beforeUpdate() {
        this.option.series[0].data = this.barData[0];
        this.option.series[1].data = this.barData[1];
        this.option.series[2].data = this.barData[2];
      
        this.myBarChart.setOption(this.option);
    },
    mounted() {
        this.draw_chart();
    },
    methods: {
        draw_chart() {
            this.myBarChart = this.$echarts.init(document.getElementById("barChart"));
        }
    },

}
</script>

<style scoped>
.chart-labels {
    color: white;
}