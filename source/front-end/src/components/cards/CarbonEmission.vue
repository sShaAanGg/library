<template>
    <div class="card-h">
        <h2 class="card-font"> 本月碳排放量 </h2>
        <CCardBody class="card-body-ce" align='center' @click="$router.push('/analysis/carbonEmissions/all')">
            {{fromDataCe}} kgCO<sub>2</sub>e
        <div style="text-align: right">
            <img
                class="card-img-es"
                src="img/dashboard_imgs/co2.png"
                width="80"
                height="80"
                display="inline"
            />
        </div>        
        </CCardBody>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['fromDataCe'],
}
</script>

<style>
.card-h {
    background-color: #0e2e2b;
}

.card-font {
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
}
.card-body-ce {
    color: white;
    font-size: 1.1vw;
    background-color: #0e2e2b;
}
</style>
