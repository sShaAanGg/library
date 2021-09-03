<template>
    <div class='card'>
        <h2 class='card-title'>需量管理</h2>
        <LineChartElectricConsum></LineChartElectricConsum>
        <CRow>
            <CCol sm="1"></CCol>
            <CCol sm="5">
                <CCard class='total'>
                    <CCardHeader class='total-title'>
                        契約容量
                    </CCardHeader>
                    <CCardBody class='total-body' align='center'>
                        22000 kWh
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs="1"></CCol>
            <CCol sm="5">
                <CCard class='remain'>
                    <CCardHeader class='remain-title'>
                        剩餘量
                    </CCardHeader>
                    <CCardBody class='remain-body' align='center'>
                        1000 kWh
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol sm="1"></CCol>
        </CRow>
    </div>
</template>

<script>
import LineChartElectricConsum from '@/components/charts/LineChartElectricConsum';

export default {
    components: {
        LineChartElectricConsum
    }

}
</script>

<style>
.card {
    background-color: black;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom: 5px green solid;
}
.card-title {
    color: green;
    font-size: 24px;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: black;
    border-bottom: 1px green solid;
}
.total {
    background-color: black;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom: 5px green solid;
}
.total-title {
    color:green;
    font-size: 24px;
    padding-left:10px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: black;
    /* border-top:1px green solid;
    border-left:5px green solid;
    border-right:5px green solid; */
    border-bottom: 1px green solid;

}
.total-body {
    color: white;
    font-size: 24px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.remain {
    background-color: black;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom: 5px green solid;
}
.remain-title {
    color: green;
    font-size: 24px;
    padding-left:10px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: black;
    background-color: black;
    /* border-top:1px green solid;
    border-left:5px green solid;
    border-right:5px green solid; */
    border-bottom: 1px green solid;
}
.remain-body {
    color: white;
    font-size: 24px;
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
