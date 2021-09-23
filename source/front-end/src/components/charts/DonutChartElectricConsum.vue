<template>
    <div id="donutChart" style = "width: 23vw;height:30vh">
        <div style="display:none" > {{elecConsumData}}</div>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['elecConsumData'],
    name: "DonutChartElectricConsum",
    data() {
        return {
            myChart:'',
            option: {
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
                            {value: 1000, name: '廠區一'},
                            {value: 1000, name: '廠區二'},
                            {value: 1000, name: '廠區三'},
                        ],
                        color: [
                            '#175580',
                            '#346780',
                            '#3C968D',
                            // '#388C6C'  
                        ]
                    }
                ]
            }
        }
    },
    beforeUpdate() {
        this.option.series[0].data[0].value = this.elecConsumData[0];
        this.option.series[0].data[1].value = this.elecConsumData[1];
        this.option.series[0].data[2].value = this.elecConsumData[2];
        // this.option.series[0].data[3].value = this.elecConsumData[3];
        this.myChart.setOption(this.option);


    },
    mounted() {
        this.draw_chart()
    },
    methods: {
        draw_chart() {

            this.myChart = this.$echarts.init(document.getElementById("donutChart"));
            this.myChart.setOption(this.option);
        }
    },
}
</script>

<style scoped>
</style>
