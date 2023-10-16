<template>
    <div class="chart" id="realTimeChart" style="width: 30vw;height:30vh;">
        <div style="display:none" >{{realtimeElec}}</div>                  
    </div>
</template>

<script>
let meterMax = 150;
let meterMin = 0;

export default {
    inject: ['reload'],
    props: [ 'realtimeElec'],
    name: `RealTimeKilowattHourChart`,

    data() {
        return { 
                myChart: '',
                curHeight: '',


                option:{
                    tooltip: {
                        show:false,
                        formatter: '{a} <br/>{c} {b}'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: false},
                            restore: {show: false},
                            saveAsImage: {show: false}
                        },
                    },
                    series: [
                        {
                            name: '即時用電量',
                            type: 'gauge',
                            center: ["40%", "60%"],
                            startAngle: 200,
                            endAngle: -20,
                            min: meterMin,
                            max: meterMax, // 22000,
                            splitNumber: 5,
                            radius: '110%',
                            axisLine: {            
                                lineStyle: {       
                                    color: [[0.2, '#55A864'], [0.8, '#3B7AB3'], [1, '#AC2D2D']],
                                    width: 5,
                                    // shadowColor: '#fff',
                                    // shadowBlur: 10
                                }
                            },
                            axisLabel: {           
                                show: false,
                            },
                            axisTick: {            
                                show: false
                            },
                            splitLine: {           
                                distance: -30,
                            },
                            pointer: {          
                                show: false,
                            },
                            title: {
                                offsetCenter: [0, '0%'],
                                // fontWeight: 'bolder',
                                fontSize: this.$utils.adjustFontSize(0.16),
                                // fontStyle: 'italic',
                                color: '#fff',
                                // shadowColor: '#fff',
                                // shadowBlur: 10
                            },
                            detail: {
                                // backgroundColor: 'rgb(110, 148, 127)',
                                // borderWidth: 0,
                                // borderColor: '#fff',
                                // shadowColor: '#fff',
                                // shadowBlur: 5,
                                offsetCenter: [0, '20%'],
                                fontSize: this.$utils.adjustFontSize(0.28),
                                // fontWeight: 'bolder',
                                color: '#fff'
                            },
                            data: [{
                            value: 0,
                            name: '即時用量(KW)'
                            }]
                        },
                        
                        {
                            type: 'gauge',
                            center: ["40%", "60%"],
                            startAngle: 200,
                            endAngle: -20,
                            radius: '105%',
                            min: meterMin,
                            max: meterMax,
                            itemStyle: {
                                color: '#F9F900',
                            },
                            progress: {
                                show: true,
                                width: 40
                            },

                            pointer: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            detail: {
                                show: false
                            },
                            data: [{
                                value: 0,
                            }]

                        }
                        
                    ]
                }
        }
    },
    
    created(){
    
    },

    beforeUpdate() {        
        this.option.series[0].data[0].value = this.realtimeElec;
        this.option.series[1].data[0].value = this.realtimeElec;
        if (this.realtimeElec > Math.round(meterMax * 0.8)){
            this.option.series[1].itemStyle.color = '#AC2D2D';
        } else if (this.realtimeElec > Math.round(meterMax * 0.2)){
            this.option.series[1].itemStyle.color = '#3B7AB3';
        } else {
            this.option.series[1].itemStyle.color = '#55A864';
        }
        this.myChart.setOption(this.option);
    },
    
    mounted() {
        this.chart();

        window.onresize = () => {
            this.myChart.resize({
                width:document.getElementById('realTimeChart').getBoundingClientRect().width
            });
        };
    },
    
    methods: {
        chart() {
            this.myChart = this.$echarts.init(document.getElementById("realTimeChart"));
            this.myChart.setOption(this.option);
        },
    },

}

</script>

<style scoped>

</style>
