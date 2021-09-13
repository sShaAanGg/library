<template>
    <div class="card-h">
        <h4 class="card-font">本月綠能儲電量</h4>
            <CCardBody class="card-body-es" align='center'>
                2200 KWh
            </CCardBody>                   
    </div>
</template>

<script>
export default {
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
.card-h {
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
