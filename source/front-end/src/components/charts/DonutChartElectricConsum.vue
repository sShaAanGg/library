<template>
    <div id="donutChart" style = "width: 23vw;height:30vh" />
    <!-- <div>
    <CChartDoughnut     
        :datasets="[
        {
            data: [653, 270, 50, 27],
            backgroundColor: [
            '#175580',
            '#346780',
            '#3C968D',
            '#388C6C'    
            ],
            radius: ['80%', '90%'],
            borderColor: '#0e2e2b'
        }
        ]"
        :labels="['廠區一','廠區二','廠區三','廠區四']"
        :options="options" />
    </div> -->
</template>

<script>
export default {
    name: "DonutChartElectricConsum",
    data() {
        return {
            myChart:'',

        }
    },
    // components: { CChartDoughnut },
    // data() {
    //     return {
    //         myChart: '',
    //         data:[
    //             {value: 653, name: '廠區一'},
    //             {value: 270, name: '廠區二'},
    //             {value: 50, name: '廠區三'} ,
    //             {value: 27, name: '廠區四'}
    //         ],
    //         options:{          
    //             legend: {
    //                 display: false,
    //                 position: 'bottom',
    //                 labels: {
    //                     fontSize: 14,
    //                     fontColor:'white'
    //                 }
    //             },
    //             center: ['50%', '50%']
    //         }
    //     }
    // },
    // mounted() {
    // },
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
                        fontSize: 16,
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
