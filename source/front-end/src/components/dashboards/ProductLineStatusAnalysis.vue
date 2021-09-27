<template>
    <div class="c-main">
        <CCard class="card-base">
            <h4 style="color: #98a8a0">
                <CIcon name="cil-bar-chart" size="lg" /> 產線狀態分析
            </h4>
			<CCol lg="8" class="pt-2 card-base">
                <CRow lg="8">
				<CInput label="日期區間" type="date" class="mr-2 placeholder" v-model="porductionStartDate" />
                <CInput label="產線" type="input" class="mr-2" v-model="porductionStartDate" />
                </CRow>
                
			</CCol>
         
        </CCard>
    </div>
   
</template>

<script>

</script>

<style scope>
/* .background {
	background-color: #272727;
}
.card-1 {
	background-color:#000000;
	border-color: #272727;
}
.fullpage {
	border-color: #272727;
} */
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
}
.placeholder {
    background-color: #081d1b;
    color: white;
}
</style>