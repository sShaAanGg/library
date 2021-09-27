<template>
    <div class="c-main">
        <CCard class="card-em">
            <h4 style="color: #98a8a0">
                <CIcon name="cil-cog" size="lg" /> 設備管理
            </h4>
			<CCol lg="8" class="pt-2 card-base">
                <CRow lg="8">
				<CInput label="廠區" class="mr-2 em-input" v-model="porductionStartDate" />
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
.card-em {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
}
.em-input {
    color: white;
}
</style>