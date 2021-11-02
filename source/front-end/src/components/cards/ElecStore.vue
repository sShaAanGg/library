<template>
    <div class="card-es">

        <h4 class="card-font">本月綠能儲電量</h4>

        <CCardBody class="card-body-es" align='center'>
            {{fromDataEs}} KWh
        <!-- <div style="text-align: right">
            <img
                class="card-img-es"
                src="img/dashboard_imgs/elec_store.png"
                width="80"
                height="80"
                display="inline"
            />
        </div> -->
        </CCardBody>

        <CCardBody>
            <p style="font-size:12px;" class="p-0 m-0" align='left'>
                上月儲電量:{{lastMonthFromDataEs}} KWh
            </p>
        </CCardBody>

    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['fromDataEs', 'lastMonthFromDataEs'],
    data() {
        return {
            screenWidth: Screen.screenWidth,
        }
    },
    mounted() {
        const root = document.documentElement;
        root.style.setProperty('--screen-width', '${this.screenWidth}px');

    }
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
