<template>
	<div>
	<CCard class="card-base">
		<CCardBody>
			<h4 style="color: #98a8a0">
				<CIcon class="text-danger" name="cil-warning" size="lg" /> 異常告警
			</h4>
			<hr class="mt-0 mb-2" />

			<CRow>
			<CCol lg="3" class="pt-2">
				<h5>起始日期 :</h5>
				<CInput type="date" class="mr-2" v-model="startDate" />
			</CCol>
			<CCol lg="3" class="pt-2">
				<h5>結束日期 :</h5>
				<CInput type="date" class="mr-2" v-model="endDate" />
			</CCol>
			<CCol lg="2" class="pt-2">
				<h5>廠區 :</h5>
				<CInput v-model="factory" list="factory_list" @click="factory = ''"/>
				<datalist id="factory_list">
				<option v-for="item in factoryOptions" :key="item.index">
					<h5>{{ item }}</h5>
				</option>
				</datalist>
			</CCol>

			<CCol lg="4" class="pt-2">
				<h3 class="pt-3" />
				<CRow style="float: right">
					<CButton
						variant="outline"
						class="mr-2 mb-4"
						style="float: right"
						color="success" 
						v-bind = "{ shape: 'pill' }"
						@click="search()"
					>
						<CIcon name="cilZoom" size="xl" />
						搜尋
					</CButton>
					<CButton
						variant="outline"
						class="mr-2 mb-4"
						style="float: right"
						color="success" 
						v-bind = "{ shape: 'pill' }"
						@click="reset()"
					>
						<CIcon name="cil-account-logout" size="xl" />
						返回
					</CButton>
				</CRow>
			</CCol>
        </CRow>

        <CRow v-if="show">
            <CCol lg="12">
                <CDataTable
                :items="items"
                :fields="fields"
                style="textalign: center"
                :items-per-page="10"
                :bordered="true"
                column-filter
                sorter
                pagination
                >
                </CDataTable>
            </CCol>
        </CRow>

        <CRow v-if="noItems">
            <CCol lg="12">
                <CAlert color=".bg-dark" style="textalign: center; font-size: 200%">
                    此搜尋條件無資料
                </CAlert>
            </CCol>
        </CRow>
		
		</CCardBody>
	</CCard>
	</div>
</template>

<script>
export default {
	data: () => {
		return {
			startDate: "",
			endDate: "",
			factory:"",

			show: false,
			noItems: false,

			items: [],
			fields: [
				{ key:  "id",        		label: "序號",		_style: "width:10%"},
				{ key:  "equiment",   		label: "設備",		_style: "width:10%"},
				{ key:  "abnormalReason",	label: "異常原因",	_style: "width:20%"},
				{ key:  "startTime",        label: "開始時間",	_style: "width:20%"},
				{ key:  "endTime",         	label: "結束時間",  _style: "width:20%"},
				{ key:  "lengthTime",       label: "異常總時",  _style: "width:10%"},
				{ key:  "highestValue",     label: "最高數值",  _style: "width:10%"},
			],
			factoryOptions: ["廠區一", "廠區二", "廠區三"],
		};
	},
	created() {
		this.reset();

	},
	methods: {
		search() {
			this.show       = false;
			this.noItems    = false;

			if (this.startDate !== "" && this.endDate == "" || this.startDate == "" && this.endDate !== ""){
				alert("請輸入完整時間區間!");
				this.reset();
				return;
			}

			if (this.factory == "" && this.startDate=="" && this.endDate==""){
				alert("請輸入廠區或時間區間!");
				this.reset();
				return;
			}

			if (this.endDate < this.startDate){
				alert("請確認時間區間!");
				this.reset();
				return;
			}

			let searchData = {
				startDate: this.startDate,
				endDate: this.endDate,
				factory: this.factory == '' ? '' : this.factory
			};
			
			// this.$http
			// 	.post('/api/machine/serach_history_info',{data:searchData})
			// 	.then(res => {
			// 		if (res.status === 200){
			// 			res.data.length != 0 ? this.show = true : this.noItems = true;
			// 			for (let ix =0; ix < res.data.length; ++ix){
			// 				res.data[ix].time = res.data[ix].time.toString().slice(0,4) + "/" + 
			// 									res.data[ix].time.toString().slice(4,6) + "/" + 
			// 									res.data[ix].time.toString().slice(6,8) + " " + 
			// 									res.data[ix].time.toString().slice(8,10) + ":" + 
			// 									res.data[ix].time.toString().slice(10,12) + ":" + 
			// 									res.data[ix].time.toString().slice(12,14);
			// 				this.items.push();
			// 			}
			// 			this.items = res.data;
			// 		} else {
			// 			alert('傳入值出現非預期狀況，請確認後再進行操作!');
			// 		}
			// 	})
			// 	.catch(err => {
			// 		insert_system_error_log(err);
			// 		alert('搜尋製程失敗，錯誤碼:' + err);
			// 		this.reset();
			// 	})
		},
	
		reset() {
			this.startDate = "";
			this.endDate = "";
			this.factory = "";
			this.show = false;
			this.noItems = false;
			this.items =  [];
		},
	},

};
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
}
</style>