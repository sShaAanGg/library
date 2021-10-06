<template>                
    <div>
        <CCard class="card-base">
            <CCardBody>
                <h4 style="color: #98a8a0">
                    <CIcon name="cil-cog" size="lg" /> 機台設備管理
                </h4>
                <hr class="mt-0 mb-2" />

            <CRow>
                <CCol lg="2" class="pt-2">
                    <h5>廠區 :</h5>
                    <CInput v-model="searchFactory" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="factory_list" @click="searchFactory = ''"/>
                    <datalist id="factory_list">
                    <option v-for="item in factoryOptions" :key="item.index">
                        <h5>{{ item }}</h5>
                    </option>
                    </datalist>
                </CCol>
                <CCol lg="8" />
                <CCol lg="1" class="pt-2">
                    <h3 class="pt-3" />
                    <CRow style="float: right">
                        <CButton
                            variant="ghost"
                            class="mr-2 mb-6"
                            style="float: right"
                            color="dark" 
                            v-bind = "{ shape: 'pill' }"
                            @click="show_modal('搜尋')"
                        >
                            <CIcon name="cilZoom" size="4xl" />
                        </CButton>
                    </CRow>
                </CCol>
                <CCol lg="1" class="pt-2">
                    <h3 class="pt-3" />
                    <CRow style="float: left">
                        <CButton
                            variant="ghost"
                            class="mr-2 mb-6"
                            style="float: right"
                            color="dark" 
                            v-bind = "{ shape: 'pill' }"
                            @click="show_modal('新增')"
                        >
                            <CIcon name="cil-medical-cross" size="4xl" />
                        </CButton>
                    </CRow>
                </CCol>
            </CRow>

                <CCol lg="12">
                    <CDataTable
                    :items="item"
                    :fields="fields"
                    style="textAlign:center;font-size:125%"
                    :items-per-page="10"
                    :bordered="true"
                    sorter
                    pagination
                    >
                    <template #show_details="{ item }">
                        <td class="p-2">
                            <CButton
                            square
                            size="sm"
                            style="color: #609485"
                            @click="show_modal('修改',item)"
                            >
                                <CIcon size="xl" name="cil-pencil" />
                            </CButton>

                            <CButton
                            square
                            size="sm"
                            style="color: #C44231"
                            @click="delete_machine(item)"
                            >
                                <CIcon size="xl" name="cilTrash" />
                            </CButton>
                        </td>
                    </template>
                    </CDataTable>
                </CCol>
            
            </CCardBody>
	    </CCard>

        <CModal
            size="lg"
            color="dark"
            :show.sync="showInsertModal"
            :closeOnBackdrop="false"
        >

            <CRow>
                <CCol lg="6" class="pt-2">
                    <h5>廠區 :</h5>
                    <CInput v-model="factory" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="factory_list" @click="factory = ''"/>
                    <datalist id="factory_list">
                    <option v-for="item in factoryOptions" :key="item.index">
                        <h5>{{ item }}</h5>
                    </option>
                    </datalist>
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="名稱:"
                        v-model="machineName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="S/N:"
                        v-model="machineSn"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg="6" class="pt-2">
                    <h5>種類:</h5>
                    <CInput v-model="machineType" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="machineTypeList" @click="machineType = ''"/>
                    <datalist id="machineTypeList">
                        <option v-for="item in machineTypeOptions" :key="item.index">
                            <h5>{{ item }}</h5>
                        </option>
                    </datalist>
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="年資:"
                        v-model="machineAge"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="建立時間:"
                        v-model="establishDate"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                        readonly
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="額定電壓:"
                        v-model="machineVolt"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

            </CRow>

            <template #header>
                <h3 class="modal-title">新增機台設備</h3>
                <CButtonClose @click="showInsertModal = false, reset_modal();" class="text-white"/>
            </template>
            <template #footer>
                <CButton @click="insert_machine_all()" color="info">新增</CButton>
                <CButton @click="showInsertModal = false, reset_modal()" color="danger">返回</CButton>
            </template>
        </CModal>

        <CModal
            size="lg"
            color="dark"
            :show.sync="showUpdateModal"
            :closeOnBackdrop="false"
        >

            <CRow>
                <CCol lg = "12"><h4>修改設備:</h4></CCol>
                <CCol lg="6" class="pt-2">
                    <h5>廠區 :</h5>
                    <CInput v-model="factory" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="factory_list" @click="factory = ''"/>
                    <datalist id="factory_list">
                        <option v-for="item in factoryOptions" :key="item.index">
                            <h5>{{ item }}</h5>
                        </option>
                    </datalist>
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="名稱:"
                        v-model="machineName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="S/N:"
                        v-model="machineSn"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg="6" class="pt-2">
                    <h5>種類:</h5>
                    <CInput v-model="machineType" onkeyup="this.value=this.value.replace(/[, ]/g,'')" list="machineTypeList" @click="machineType = ''"/>
                    <datalist id="machineTypeList">
                    <option v-for="item in machineTypeOptions" :key="item.index">
                        <h5>{{ item }}</h5>
                    </option>
                    </datalist>
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="年資:"
                        v-model="machineAge"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="額定電壓:"
                        v-model="machineVolt"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

            </CRow>

            <template #header>
                <h3 class="modal-title">修改機台資訊</h3>
                <CButtonClose @click="showUpdateModal = false, reset_modal()" class="text-white"/>
            </template>
            <template #footer>
                <CButton @click="send_edit_machine()" color="info">修改</CButton>
                <CButton @click="showUpdateModal = false, reset_modal()" color="danger">返回</CButton>
            </template>
        </CModal>
    </div>
   
</template>

<script>
import { format,factoryOptions,machineTypeOptions } from '@/common/utils';

export default {
    data: () => {
        return {
			item: [],
			fields: [
				{ key:  "factory",          label: "廠區",		    _style: "width:8%; color: #4C756A"},
				{ key:  "machine_name",     label: "名稱",		    _style: "width:8%; color: #4C756A"},
                { key:  "machine_sn",       label: "S/N",          _style: "width:8%; color: #4C756A"},
                { key:  "type",             label: "種類",          _style: "width:8%; color: #4C756A"},
                { key:  "voltage",          label: "額定電壓",      _style: "width:6%; color: #4C756A"},
                { key:  "work_years",       label: "年資",          _style: "width:6%; color: #4C756A"},
                { key:  "establish_date",   label: "建立日期",      _style: "width:9%; color: #4C756A"},
                { key:  "work_hours",       label: "運作時數(年)",  _style: "width:8%; color: #4C756A"},
				{ key:  "year_elec",        label: "年耗電量",      _style: "width:7%; color: #4C756A"},
                { key:  "month_elec",       label: "月耗電量",      _style: "width:7%; color: #4C756A"},
                { key:  "activation",       label: "稼動率",        _style: "width:6%; color: #4C756A"},
                { key:  "show_details",     label: "",             _style: "width:10%; color: #4C756A"}
			],

            searchFactory:"",
            factoryOptions: factoryOptions,
            machineTypeOptions: machineTypeOptions,

            showInsertModal: false,
            showUpdateModal: false,
            factory: '',
            machineName: '',
            machineSn: '',
            machineType: '',
            machineAge: 0,
            establishDate: '',
            machineVolt: '',

            workTime: 0,
            yearElec: 0,
            monthElec: 0,
            activation: 0,

            editItem: '',
        };
    },

    created() {
        this.search_machine_list();
    },

    methods:{
        show_modal(source,item) {
            if (source === '新增'){
                this.showInsertModal = true;
                this.establishDate = format(new Date(), "yyyyMMddHHmmss");
            }

            if (source === '修改'){
                this.editItem = item;
                this.showUpdateModal = true;

                this.factory = item.factory;
                this.machineName = item.machine_name;
                this.machineType = item.type;
                this.machineVolt = item.voltage;
                this.machineAge = item.work_years;
                this.machineSn = item.machine_sn;
            }
            if (source === '搜尋'){
                this.search_machine_list();
            }
        },

        search_machine_list() {
            let data = {
                searchFactory:this.searchFactory
            };

            this.$http
                .post('/api/enms/select_machine_manage',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }
                    this.item = res.data;
                })
                .catch(err => {
                    console.log('搜尋機台設備失敗，錯誤碼:' + err);
                    this.reset_modal();
                })
        },

        insert_machine_all() {
            if ( this.factory === ''      ||
                 this.machineName === ''  ||
                 this.machineSn === ''    ||
                 this.machineType === ''  ||
                 this.machineAge === ''   ||
                 this.establishDate === ''||
                 this.machineVolt === ''  ){
                alert("請輸入全部設備資訊!!!");
                return;
            }
            let check_sn = {
                machineSn:this.machineSn
            };
            this.$http
                .post('/api/enms/select_machine_sn',{data:check_sn})
                .then(res => {
                    if (res.status !== 200){
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }
                    if (res.data.length != 0){
                        alert("S/N重複,請重新輸入!");
                        return;
                    } else {
                        let data = {
                            machineName: this.machineName,
                            machineSn: this.machineSn,
                            machineType: this.machineType,
                            factory: this.factory,
                            establishDate: this.establishDate,
                            updateDate: 0,
                            yearElec: this.yearElec,
                            monthElec: this.monthElec, 
                            machineVolt: this.machineVolt,
                            machineAge: this.machineAge,
                            workHours: this.workTime,
                            activation: this.activation
                        };
                        this.$http
                            .post('/api/enms/insert_machine_manage',{data:data})
                            .then(res => {
                                if (res.status !== 200){
                                    alert('傳入值出現非預期狀況，請確認後再進行操作!');
                                }
                                this.search_machine_list();
                                this.reset_modal();
                                this.showInsertModal = false;
                                alert("新增機台資訊成功!");
                            })
                            .catch(err => {
                                console.log('新增機台資訊失敗，錯誤碼:' + err);
                                this.reset_modal();
                            })
                    }
                })
                .catch(err => {
                    console.log('機台S/N資訊重複，錯誤碼:' + err);
                    this.reset_modal();
                })
        },

        send_edit_machine() {
            let check_sn = {
                machineSn:this.machineSn
            };
            this.$http
                .post('/api/enms/select_machine_sn',{data:check_sn})
                .then(res => {
                    if (res.status !== 200){
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }
                    if (res.data.length != 0){
                        alert("S/N重複,請重新輸入!");
                        return;
                    } else {
                        let data = {
                            id: this.editItem.id,
                            machineName: this.machineName,
                            machineSn: this.machineSn,
                            machineType: this.machineType,
                            factory: this.factory,
                            machineVolt: this.machineVolt,
                            machineAge: this.machineAge,
                        };
                        this.$http
                            .post('/api/enms/update_machine_manage',{data:data})
                            .then(res => {
                                if (res.status !== 200){
                                    alert('傳入值出現非預期狀況，請確認後再進行操作!');
                                }
                                this.search_machine_list();
                                this.reset_modal();
                                this.showUpdateModal = false;
                                alert("修改機台資訊成功!");
                            })
                            .catch(err => {
                                console.log('修改機台資訊失敗，錯誤碼:' + err);
                                this.reset_modal();
                            })
                    }
                })
                .catch(err => {
                    console.log('機台S/N資訊重複，錯誤碼:' + err);
                    this.reset_modal();
                })
        },

        delete_machine(item) {
            if ( item.establish_date <= 20200101000000){
                alert("系統預設資料無法刪除!");
                return;
            }
            let data = {
                id: item.id,
            };
            this.$http
                .post('/api/enms/delete_machine_manage',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }
                    this.search_machine_list();
                    this.reset_modal();
                    this.showUpdateModal = false;
                    alert("刪除機台資訊成功!");
                })
                .catch(err => {
                    console.log('修改機台資訊失敗，錯誤碼:' + err);
                    this.reset_modal();
                })
        },

        async check_sn(sn) {
            let data = {
                machineSn: sn,
            };
            this.$http
                .post('/api/enms/select_machine_sn',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }
                    if (res.data.length != 0){
                        alert("S/N重複,請重新輸入!");
                    }
                })
                .catch(err => {
                    console.log('修改機台資訊失敗，錯誤碼:' + err);
                    this.reset_modal();
                })
        },

        reset_modal() {
            this.factory = "";
            this.machineName = '';
            this.machineSn = '';
            this.machineType = '';
            this.machineAge = 0;
            this.establishDate = '';
            this.machineVolt = '';
            this.workTime = 0;
            this.yearElec = 0;
            this.monthElec = 0;
            this.activation = 0;
        }
    },

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
.card-em {
    background-color: #081d1b;
    border-color: #0e2e2b;
    color: white;
}
.em-input {
    color: white;
}
.card-base {
    background-color: #081d1b;
    border-color: #0e2e2b;
}
.table {
    color: white;
}
</style>