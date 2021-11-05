<template>
    <div class="card-h">
        <h2 class="card-title-rce">本月減碳排放量</h2>
        <CCardBody :style="{'color':fromDataRce > lastMonthFromDataRce ? 'green':'red'}" class='card-body-rce' align='center' @click="$router.push('/analysis/carbonNegative/all')">
            {{fromDataRce}} kgCO<sub>2</sub>e
            <!-- <div style="text-align: right">
                <img
                    class="card-img-es"
                    src="img/dashboard_imgs/co2_reduce.png"
                    width="110"
                    height="75"
                    display="inline"
                />
            </div> -->
        </CCardBody>

        <CCardBody>
            <p style="font-size:12px;" class="p-0 m-0" align='left'>
                上月減碳排量:{{lastMonthFromDataRce}} kgCO<sub>2</sub>e
            </p>
        </CCardBody>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['fromDataRce', 'lastMonthFromDataRce'],
    name: "HistoryAnalysis",

}
</script>

<style>
.card-h {
    background-color: #0e2e2b;
}

.card-title-rce {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
.card-body-rce {
    color: white;
    font-size: 1.2vw;
}

</style>
