<template>
    <div class="chart" id="main" style = "width: 23vw;height:30vh" />
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
import { CChartDoughnut } from '@coreui/vue-chartjs'
export default {
    name: "DonutChartElectricConsum",
    data() {
        return {
            myChart:'',
            option: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false,
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 653, name: '廠區一'},
                            {value: 270, name: '廠區二'},
                            {value: 50, name: '廠區三'},
                            {value: 27, name: '廠區四'},
                        ],
                        backgroundColor: [
                            '#175580',
                            '#346780',
                            '#3C968D',
                            '#388C6C'  
                        ]
                    }
                ]
            }
            
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
            this.myChart = this.$echarts.init(document.getElementById("main"));
            this.myChart.setOption(this.option);
        }
    },
}
</script>

<style scoped>
</style>
