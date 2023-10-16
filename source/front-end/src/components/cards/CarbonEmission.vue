<template>
    <div class="card-es">

        <h4 class="card-font"> 本月碳排放量 </h4>

        <CCardBody :style="{'color':fromDataCe > lastMonthFromDataCe ? 'red':'green'}" class="card-body-es" align='center' @click="$router.push('/analysis/carbonEmissions/all')">
            {{fromDataCe}} kgCO<sub>2</sub>e
            <!-- <div style="text-align: right">
                <img
                    class="card-img-es"
                    src="img/dashboard_imgs/co2.png"
                    width="80"
                    height="80"
                    display="inline"
                />
            </div> -->
        </CCardBody>

        <CCardBody>
            <p style="font-size:12px;" class="p-0 m-0" align='left'>
                上月碳排量:{{lastMonthFromDataCe}} kgCO<sub>2</sub>e
            </p>
        </CCardBody>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['fromDataCe', 'lastMonthFromDataCe'],
}
</script>

<style>
.card-es {
    background-color: #0e2e2b;
}

.card-font {
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}

.card-body-es {
    color: white;
    font-size: 1.5vw;
}
</style>
