<template>
	<div>
	<CCard class="card-base">
		<CCardBody>
			<h4 style="color: #98a8a0">
				<CIcon name="cil-warning" size="lg" /> 異常告警
			</h4>
			<hr class="mt-0 mb-2" />
            <CRow>
                <CCol lg="1" class="pt-2">
                    <h5>S/N :</h5>
                    <CInput v-model="machineSn" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="factory_list" @click="searchFactory = ''"/>
                </CCol>
                <CCol lg="1" class="pt-2">
                    <h5>設備名稱 :</h5>
                    <CInput v-model="machineName"  onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="factory_list" @click="searchFactory = ''"/>
                </CCol>
                <CCol lg="2.5" class="pt-2 mx-2">
                    <h5>日期 :</h5>
                    <date-picker
                        v-model="dateTimeRange"
                        type="date"
                        range
                        value-type="YYYYMMDD000000"
                        placeholder="選擇時間區間"
                    >
                    </date-picker>
                </CCol>
                <CCol lg="1" class="pt-4 ps-0 ms-0">
                        <CButton
                            variant="ghost"
                            color="success"
                            v-bind = "{ shape: 'pill' }"
                            @click="search_error_log()"
                        >
                            <CIcon name="cilZoom" size="3xl" />
                        </CButton>
                </CCol>
                <CCol lg="6" />
                <CCol lg="12">
                    <CDataTable
                        :items="items"
                        :fields="fields"
                        style="textalign: center; font-size: 115%"
                        :items-per-page="10"
                        :bordered="true"
                        sorter
                        pagination
                    >
                    </CDataTable>
                </CCol>
            </CRow>
		</CCardBody>
	</CCard>
	</div>
</template>

<script>
import { format } from '@/common/utils';

export default {
	data: () => {
		return {
			items: [],
			fields: [
				{ key: "machine_sn", 		label: "S/N", 			_style: "width:20%; color: #4C756A" },
				{ key: "machine_name",		label: "設備名稱", 		_style: "width:20%; color: #4C756A" },
				{ key: "start_datetime", 	label: "開始時間", 		_style: "width:20%; color: #4C756A" },
				{ key: "start_datetime", 	label: "結束時間", 		_style: "width:20%; color: #4C756A" },
				{ key: "event", 			label: "異常原因", 		_style: "width:20%; color: #4C756A" },
			],

            dateTimeRange: '',
            machineSn:'',
            machineName:'',
            filterData:[],
		};
	},

	created() {
		this.select_error_log();
	},

	methods:{
		select_error_log() {
			this.$http
				.get('api/enms/select_error_log')
				.then(res => {
					this.items = res.data;
				})
				.catch(err =>{
                    console.log(err);
                })
		},
        search_error_log() {
            this.$http
				.get('api/enms/select_error_log')
				.then(res => {
					this.items = res.data;
                    if (this.machineSn != ''){
                        this.filterData = this.items.filter(result => result.machine_sn == this.machineSn);
                        this.items = this.filterData;
                    }

                    if (this.machineName != ''){
                        this.filterData  = this.items.filter(result => result.machine_name == this.machineName);
                        this.items = this.filterData;
                    }

                    if (this.dateTimeRange[0] == null && this.dateTimeRange[1] == null)
                        return

                    if (this.dateTimeRange[0].length == 14 && this.dateTimeRange[1].length == 14){
                        this.filterData = this.items.filter(result =>   format(result.start_datetime, "yyyyMMddHHmmss") >= this.dateTimeRange[0] &&
                                                                        format(result.end_datetime, "yyyyMMddHHmmss") <= this.dateTimeRange[1]);
                        this.items = this.filterData;
                    }
				})
				.catch(err =>{
                    console.log(err);
                })
        },
	},
};
</script>

<style scope>
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}
.table {
    color: white;
}
.mx-input {
    height: 38px;
}
</style>
