<template>
	<div>
	<CCard class="card-base">
		<CCardBody>
			<h4 style="color: #98a8a0">
				<CIcon name="cil-warning" size="lg" /> 異常告警
			</h4>
			<hr class="mt-0 mb-2" />

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
		</CCardBody>
	</CCard>
	</div>
</template>

<script>
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
					console.log(res.data)
					this.items = res.data;
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
</style>