<template>
    <div id="donutChart" style = "width: 23vw;height:30vh" />
</template>

<script>
export default {
    name: "DonutChartElectricConsum",
    data() {
        return {
            myChart:'',

        }
    },
    mounted() {
        this.draw_chart()
    },
    methods: {
        draw_chart() {
            this.option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    textStyle: {
                        fontSize: this.$utils.adjustFontSize(0.16),
                        color:'white',
                        padding: [5, 10, 5, 10]
                    },
                    right: '5%',

                },
                series: [
                    {
                        type: 'pie',
                        right: '30%',
                        radius: ['65%', '85%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        // emphasis: {
                        //     label: {
                        //         show: true,
                        //         fontSize: '20px',
                        //     }
                        // },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 653, name: '廠區一'},
                            {value: 270, name: '廠區二'},
                            {value: 50, name: '廠區三'},
                            {value: 27, name: '廠區四'},
                        ],
                        color: [
                            '#175580',
                            '#346780',
                            '#3C968D',
                            '#388C6C'  
                        ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(document.getElementById("donutChart"));
            this.myChart.setOption(this.option);
        }
    },
}
</script>

<style scoped>
</style>
