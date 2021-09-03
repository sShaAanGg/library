<template>
    <div class="chart" id="DonutChartElectricConsum" style="width: 610px;height:500px;"></div>
</template>

<script>
export default {
    name: "DonutChartElectricConsum",
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
            this.myChart = this.$echarts.init(document.getElementById("DonutChartElectricConsum"));
            var option;
            option = {
                // title: {
                //     text: '本月總耗電量',
                //     textStyle: {
                //         fontSize: 24,
                //         color: 'green'
                //     },
                //     padding:[10,500,10, 10],
                //     borderWidth: 1,
                //     borderColor: 'green'
                // },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '1%',
                    left: 'left',
                    textStyle: {
                        fontSize: 20,
                        color: 'white'
                    },
                },
                series: [
                    {
                        name: '耗電量',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        // emphasis: {
                        //     label: {
                        //         show: true,
                        //         fontSize: '40',
                        //         fontWeight: 'bold'
                        //     }
                        // },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 653, name: '廠區一'},
                            {value: 270, name: '廠區二'},
                            {value: 50, name: '廠區三'} ,
                            {value: 27, name: '廠區四'}
                        ]
                    }
                ]
            };
            this.myChart.setOption(option);
            // this.option = {
            //     title: {
            //         text: '總用電量',
            //         subtext: ''
            //     },
            //     xAxis: {
            //         type: 'category',
            //         boundaryGap: false,
            //         axisLabel: {
            //             show: true, 
            //             inside: false,
            //             rotate: 0,
            //             margin: 10,
            //             color: '#999',
            //             interval: 1
            //         },
            //         data: [1, 2, 3, 4, 5, 6]
            //     },
            //     y
            // }


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