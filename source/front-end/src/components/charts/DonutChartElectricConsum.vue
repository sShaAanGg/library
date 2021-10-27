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
            myChart: '',
            factoryList: ['廠區一', '廠區二', '廠區三'],
            maxElec: 0,
            maxIdx: 0,
            defaultFactory: '', // the maximum elec showing on centre
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
                            show: true,
                            color: '#FFFFFF',
                            fontSize: '20',
                            textBorderWidth: 0,
                            position: 'center',
                            formatter: () => {
                                return this.defaultFactory;
                            },
                        },

                        // emphasis: {
                        //     focus: 'series',
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
        let copyData = [];
        for (let ix = 0; ix < this.elecConsumData.length; ++ix) {
            copyData.push(this.elecConsumData[ix]);
            this.option.series[0].data[ix].value = this.elecConsumData[ix];
            if (this.maxElec < this.elecConsumData[ix]) {
                this.maxElec = this.elecConsumData[ix];
                this.maxIdx = ix;
            }
        }
        this.defaultFactory = this.factoryList[this.maxIdx] + "\n" + this.maxElec.toString();

        let sortElecData = copyData.sort((a, b) => b - a);
        for (let iy = 0; iy < sortElecData.length; ++iy) {
            let foundIdx = this.elecConsumData.findIndex(x => x == sortElecData[iy]);
            this.option.series[0].data[iy].value = sortElecData[iy];
            this.option.series[0].data[iy].name = this.factoryList[foundIdx] + '\n' + sortElecData[iy].toString();
        }

        // this.option.series[0].data[3].value = this.elecConsumData[3];
        this.myChart.setOption(this.option);

    },
    mounted() {
        this.myChart = this.$echarts.init(document.getElementById("donutChart"));
    },
    methods: {
    },
}
</script>

<style scoped>
</style>
