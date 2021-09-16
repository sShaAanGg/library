<template>
    <div>
        <div style="display:none"> {{ barData }} </div>
        <CChartBar class="chart-labels"
            style="height:40vh"
            :datasets="[
            {
                data: [170, 220, 340, 460, 580, 700, 460, 230, 450, 780, 340, 120],
                // data: barData[0],
                backgroundColor: '#3C968D',
                label: 'last year',
            },
                    {
                data: [200, 190, 280, 340, 620, 750, 290, 310, test, 680, 300, 100],
                // data: barData[1],
                backgroundColor: '#388C6C',
                label: 'this year',
            }
            ]"
            labels="months"
            :options="{ 
                maintainAspectRatio: false ,
                legend: {
                    labels: {
                        fontColor: 'white',
                        fontSize: this.$utils.adjustFontSize(0.16)
                    }
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            fontColor: 'white',
                            fontSize: this.$utils.adjustFontSize(0.16)

                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            fontColor: 'white',
                            fontSize: this.$utils.adjustFontSize(0.16),
                        },
                        barPercentage: 0.4
                    }]
                }
            }"
        />
            <!-- <div class="chart" id="BarChartHistory" style="width: 38vw;height:60vh;"></div> -->
    </div>
</template>

<script>
export default {
    inject:['reload'],
    props: ['barData'],
    name: "BarChartHistory",
    data() {
        return {
            test: 230
        }
    }

}
</script>

<style scoped>
.chart-labels {
    color: white;
}
</style>
