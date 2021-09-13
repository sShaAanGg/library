<template>
    <CChartDoughnut     
        :datasets="[
        {
            data: [653, 270, 50, 27],
            backgroundColor: [
            '#FF8888',
            '#5599FF',
            '#5EDBA7',
            '#E0E0E0'     // 灰色
            ],
            radius: ['40%', '70%']
        }
        ]"
        :labels="['廠區一','廠區二','廠區三','廠區四']"
        :options="options" />
</template>

<script>
import { CChartDoughnut } from '@coreui/vue-chartjs'
export default {
    name: "DonutChartElectricConsum",
    components: { CChartDoughnut },
    data() {
        return {
            myChart: '',
            data:[
                {value: 653, name: '廠區一'},
                {value: 270, name: '廠區二'},
                {value: 50, name: '廠區三'} ,
                {value: 27, name: '廠區四'}
            ],
            options:{
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        fontSize: 14,
                        fontStyle: 'bold',
                    }
                }
            }
        }
    },
    mounted() {
    },
    methods: {
    },
}
</script>

<style scoped>
</style>
