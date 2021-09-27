<template>
    <div id="barChart" style="width: 40vw;height:40vh">
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
            barData2: [1,2,3,4],


            myBarChart:'',
            option: {
                xAxis: {
                    type: 'category',
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: barData3,
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }
                ]
            }
                
        }
    },
    beforeUpdate() {
        console.log('before:', barData3);
        barData3 = [3,4,5]
        this.option.series[0].data = barData3;
        console.log('after:', barData3);
        this.myBarChart.setOption(this.option);
    },
    mounted() {
        console.log('in mounted...');
        this.get_history_data();
        this.draw_chart();
    },
    methods: {
        draw_chart() {
            this.myBarChart = this.$echarts.init(document.getElementById("barChart"));
        },
        get_history_data() {
            console.log('in get_history_data...');
            this.$http
                .get('api/enms/select_two_years_electricity_consumption')
                .then(res=> {
                    console.log('--->get data');
                    // let todayDate = new Date();
                    // let curMonth = todayDate.getMonth();
                    
                    // this.cEmissionLastYear = [];
                    // this.cEmissionThisYearBefore = [];
                    for (let ix = 0; ix < Object.keys(res.data).length; ix++) {
                        if (ix > 23) break;
                        (ix < 12)   ? this.cEmissionLastYear.push((0.554 * JSON.parse(res.data[ix].electricity)).toFixed(2)) 
                                    : this.cEmissionThisYearBefore.push((0.554 * JSON.parse(res.data[ix].electricity)).toFixed(2));
                    }
                    // this.cEmissionLastYear = this.cEmissionLastYear.map(x=>x * 0.554);
                    // console.log('after:', this.cEmissionLastYear);
                    // this.cEmissionLastTime = this.cEmissionLastYear[curMonth];
                    // this.cEmissionLastYear = this.cEmissionLastYear.map(Number);
                    // this.cEmissionThisYearBefore = this.cEmissionThisYearBefore.map(Number);
                    // this.elecCapacity = [this.contractCapacity, 0, 0];
                    // for (let iy = 0; iy < 12; iy++){
                    //     this.elecCapacity[1] += this.cEmissionLastYear[iy];
                    //     if (iy < this.cEmissionThisYearBefore.length) {
                    //         this.elecCapacity[2] += this.cEmissionThisYearBefore[iy];
                    //     }                                                                
                    // }
                    // console.log(this.cEmissionLastYear, this.cEmissionThisYearBefore);
                });
        },

    },

}
</script>

<style scoped>
.chart-labels {
    color: white;
}