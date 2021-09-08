<template>
    <div class="card-es">
        <h4 class="card-title-es">本月綠能儲電量</h4>
            <CCardBody class='card-body-es' align='center'>
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
:root {
    --screen-width: 1920px;
    --screen-height: 1080px;
}
.card-es {
    background-color: black;
    width: 14vmax;
    height: 25vmin;
    min-width: 200px;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom:5px green solid;
}
.card-title-es {
    color: green;
    font-size: 1.5vw;
    text-align: center;
    padding-left:5px;
    padding-top:5px;
    padding-bottom:5px;
    background-color: black;
    border-bottom:1px green solid;
}
.card-body-es {
    color: white;
    font-size: 1.5vw;
}

</style>
