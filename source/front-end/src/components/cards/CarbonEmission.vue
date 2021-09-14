<template>
    <div class="card-h">
        <h2 class="card-font"> 本月碳排放量 </h2>
        <CCardBody class="card-body-ce" align='center'>
            220 kgCO<sub>2</sub>e
        </CCardBody>
        <div style="text-align: right">
            <img
                class="card-img-es"
                src="img/dashboard_imgs/co2.png"
                width="90"
                height="90"
                display="inline"
            />
        </div>        
    </div>
</template>

<script>
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
    font-size: 1.5vw;
    background-color: #0e2e2b;
}
</style>
