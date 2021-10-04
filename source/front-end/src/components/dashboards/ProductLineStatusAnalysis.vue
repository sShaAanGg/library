<template>
    <div class="c-main">
        <CCard class="card-base">
            <h4 style="color: #98a8a0">
                <CIcon name="cil-bar-chart" size="lg" /> 產線狀態分析
            </h4>
			<CCol lg="8" class="pt-2 card-base">
                <!-- <CRow lg="8">
				<CInput label="日期區間" type="date" class="mr-2 placeholder" v-model="porductionStartDate" />
                <CInput label="產線" type="input" class="mr-2" v-model="porductionStartDate" />
                </CRow> -->
                
			</CCol>
         
        </CCard >
        <CCard class="card-base">
            <CRow>
                <CCol>
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-chart-pie" size="lg" /> 圖表數據 - {{ equipName }}
                    </h4>

                </CCol>
                <CCol>
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-description" size="lg" /> 設備清單
                    </h4>
                    <CDataTable
                        :items="equipList"
                        :fields="fields"
                        style="textalign: center; font-size: 125%"
                        :items-per-page="15"
                        :bordered="true"
                        column-filter
                        sorter
                        pagination
                    >                        
                    </CDataTable>                    
                    <h4 style="color: #98a8a0">
                        <CIcon name="cil-description" size="lg" /> 異常清單
                    </h4> 
                    <table class="table">
                        <thead>
                            <tr>
                            <th>品名</th>
                            <th>價格</th>
                            <th>到期日</th>
                            </tr>
                            <tr>
                            <td></td>
                            </tr>
                        </thead>
                    </table>                   
                </CCol> 
            </CRow>               
            
        </CCard>
    </div>
    
    
   
</template>

<script>
export default {
    data() {
        return {
            equipName: '設備A',
            equipList: [],
            equipEventList: '',
            fields: [
                {key: "test"}
            ]
        }
    }
}

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