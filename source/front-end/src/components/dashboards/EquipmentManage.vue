<template>                
    <div>
        <CCard class="card-base">
            <CCardBody>
                <h4 style="color: #98a8a0">
                    <CIcon name="cil-cog" size="lg" /> 網路設備管理
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
                            @click="show_modal('')"
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

            <CRow v-if="show">
                <CCol lg="12">
                    <CDataTable
                    :items="item"
                    :fields="fields"
                    style="textAlign:center;font-size:125%"
                    :items-per-page="10"
                    :bordered="true"
                    column-filter
                    sorter
                    pagination
                    >
                    <template #show_details="{ item }">
                        <td class="p-2">
                            <CButton
                            square
                            size="sm"
                            style="color: #2eb85c"
                            @click="show_equiment_button(item)"
                            >
                                <CIcon size="xl" name="cil-Zoom" />
                            </CButton>

                            <CButton
                            square
                            size="sm"
                            style="color: #2eb85c"
                            @click="edit_equiment(item)"
                            >
                                <CIcon size="xl" name="cil-pencil" />
                            </CButton>

                            <CButton
                            square
                            size="sm"
                            style="color: #2eb85c"
                            @click="delete_equiment(item)"
                            >
                                <CIcon size="xl" name="cilTrash" />
                            </CButton>
                        </td>
                    </template>
                    <template #details="{ item }">
                        <CCollapse :show="item.showButton">
                            <CCard body-wrapper class="bg-dark text-white">
                                <CRow v-if="item.buttonArray.length">
                                    <CCol lg = '6' class="pt-2" v-for="data in item.buttonArray" :key="data.index">
                                        <h6>名稱:{{data.buttonName}} 埠號: {{data.buttonPort}} 腳位: {{data.buttonPin}} 種類: {{data.buttonType}}</h6>
                                    </CCol>
                                </CRow>
                                <CRow v-if="item.buttonArray.length == 0">
                                    <CCol>
                                        <h5>無開關選項</h5>
                                    </CCol>
                                </CRow>
                            </CCard>
                        </CCollapse>
                    </template>
                    </CDataTable>
                </CCol>
            </CRow>
            
            </CCardBody>
	    </CCard>

        <CModal
            size="lg"
            color="dark"
            :show.sync="showInsertModal"
            :closeOnBackdrop="false"
        >

            <CRow>
                <CCol lg = "12"><h4>新增設備:</h4></CCol>
                <CCol lg = '6'>
                    <CInput
                        label="廠區:"
                        v-model="factory"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備名稱:"
                        v-model="equimentName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備年資:"
                        v-model="equimentAge"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備地址:"
                        v-model="equimentMac"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '12'>
                    <CInput
                        label="網域:"
                        v-model="equimentAllowList"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>
                
                <CCol lg = "12">
                    <h4 class = "pt-3">新增設備開關:</h4>
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關名稱:"
                        v-model="buttonName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關埠號:"
                        v-model="buttonPort"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關腳位:"
                        v-model="buttonPin"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關種類:"
                        v-model="buttonType"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '4' class="pt-5">
                    <CButton @click="add_button('insert')" color="info">新增開關</CButton>
                </CCol>

            </CRow>

            <CRow class="bg-secondary mx-4 mt-2 pt-2" v-for="item in buttonArray" :key="item.index">
                    <CCol lg = "5"><h5>開關名稱:{{item.buttonName}}</h5><h5>開關種類:{{item.buttonType}}</h5></CCol>
                    <CCol lg = "5"><h5>開關埠號:{{item.buttonPort}}</h5><h5>開關腳位:{{item.buttonPin}}</h5></CCol>
                    <CCol lg = "2" class="pt-2">
                        <CButton @click="delete_button(item, 'insert')">
                            <CIcon name="cil-trash" />
                        </CButton>
                    </CCol>
            </CRow>

            <template #header>
                <h3 class="modal-title">新增設備</h3>
                <CButtonClose @click="showInsertModal = false" class="text-white"/>
            </template>
            <template #footer>
                <CButton @click="insert_equiment_all()" color="info">新增</CButton>
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
                <CCol lg = '6'>
                    <CInput
                        label="廠區:"
                        v-model="factory"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備名稱:"
                        v-model="equimentName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備年資:"
                        v-model="equimentAge"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '6'>
                    <CInput
                        label="設備地址:"
                        v-model="equimentMac"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '12'>
                    <CInput
                        label="網域:"
                        v-model="equimentAllowList"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>
                
                <CCol lg = "12">
                    <hr class = "mt-0 mb-2" />
                    <h4 class = "pt-3">新增設備開關:</h4>
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關名稱:"
                        v-model="buttonName"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關埠號:"
                        v-model="buttonPort"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關腳位:"
                        v-model="buttonPin"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '2' class="pt-3">
                    <CInput
                        label="開關種類:"
                        v-model="buttonType"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    />
                </CCol>

                <CCol lg = '4' class="pt-5">
                    <CButton @click="add_button('edit')" color="info">新增開關</CButton>
                </CCol>

            </CRow>

            <CRow class="bg-secondary mx-4 mt-2 pt-2" v-for="item in editbuttonArray" :key="item.index">
                    <CCol lg = "5"><h5>開關名稱:{{item.buttonName}}</h5><h5>開關種類:{{item.buttonType}}</h5></CCol>
                    <CCol lg = "5"><h5>開關埠號:{{item.buttonPort}}</h5><h5>開關腳位:{{item.buttonPin}}</h5></CCol>
                    <CCol lg = "2" class="pt-2">
                        <CButton @click="delete_button(item,'edit')">
                            <CIcon name="cil-trash" />
                        </CButton>
                    </CCol>
            </CRow>

            <template #header>
                <h3 class="modal-title">修改設備</h3>
                <CButtonClose @click="showUpdateModal = false" class="text-white"/>
            </template>
            <template #footer>
                <CButton @click="send_edit_equiment()" color="info">修改</CButton>
                <CButton @click="showUpdateModal = false, reset_modal()" color="danger">返回</CButton>
            </template>
        </CModal>
    </div>
   
</template>

<script>

export default {
    data: () => {
        return {
            show: false,
			item: [],
			fields: [
				{ key:  "factory",           label: "廠區",		    _style: "width:10%"},
				{ key:  "equimentName",      label: "設備",		    _style: "width:10%"},
                { key:  "equimentAllowList", label: "網域",          _style: "width:10%"},
				{ key:  "electricity",       label: "年耗電量",      _style: "width:10%"},
				{ key:  "equimentAge",       label: "設備年資",      _style: "width:10%"},
				{ key:  "workTime",          label: "運作時數(年)",  _style: "width:10%"},
                { key:  "equimentMac",       label: "設備地址",      _style: "width:20%"},
                { key:  "show_details",      label: "",             _style: "width:10%"}
			],

            searchFactory:"",
            factoryOptions: ["廠區一", "廠區二", "廠區三"],
            
            showInsertModal: false,
            showUpdateModal: false,
            factory:"",
            equimentAge:'',
            equimentName:'',
            equimentMac:'',
            equimentAllowList:'',
            buttonArray:[],
            buttonName:'',
            buttonPort:'',
            buttonPin:'',
            buttonType:'',

            editItem:'',
            editbuttonArray:[],
        };
    },

    methods:{
        show_modal(source,item) {
            if (source === '新增'){
                this.showInsertModal = true;
            }
        },

        insert_equiment_all() {
            if (this.factory == "" ||
                this.equimentAge == "" ||
                this.equimentName == "" ||
                this.equimentMac == "" ||
                this.equimentAllowList == ""){
                alert("請輸入全部設備資訊!!!");
                return;
            }
            this.item.push({ factory:this.factory,
                             equimentName:this.equimentName,
                             equimentAllowList:this.equimentAllowList,
                             electricity:"0",
                             equimentAge:this.equimentAge,
                             workTime:"0",
                             equimentMac:this.equimentMac,
                             buttonArray:this.buttonArray,
                             showButton:false});
            
            this.reset_modal();
            this.showInsertModal = false;
            this.show = true;
        },

        show_equiment_button(item) {
            item.showButton = !item.showButton;
        },

        edit_equiment(item) {
            this.editItem = item;

            this.showUpdateModal = true;

            this.factory = item.factory;
            this.equimentName = item.equimentName;
            this.equimentAllowList = item.equimentAllowList;
            this.equimentAge = item.equimentAge;
            this.equimentMac = item.equimentMac;
            this.editbuttonArray = JSON.parse(JSON.stringify(item.buttonArray))
            // Object.assign(this.editbuttonArray, item.buttonArray);
        },

        send_edit_equiment() {
            this.item[this.item.indexOf(this.editItem)].factory = this.factory;
            this.item[this.item.indexOf(this.editItem)].equimentName = this.equimentName;
            this.item[this.item.indexOf(this.editItem)].equimentAllowList = this.equimentAllowList;
            this.item[this.item.indexOf(this.editItem)].equimentAge = this.equimentAge;
            this.item[this.item.indexOf(this.editItem)].equimentMac = this.equimentMac;
            this.item[this.item.indexOf(this.editItem)].buttonArray = this.editbuttonArray

            this.showUpdateModal = false;
        },

        delete_equiment(index) {
            let remove = this.item.indexOf(index);
            this.item.splice(remove, 1);
        },

        add_button(type) {
            let buttonContent = {
                buttonName:this.buttonName,
                buttonPort:this.buttonPort,
                buttonPin:this.buttonPin,
                buttonType:this.buttonType
            };

            if (buttonContent.buttonName == "" ||
                buttonContent.buttonPort == "" ||
                buttonContent.buttonPin == "" ||
                buttonContent.buttonType == ""){
                alert("請輸入開關資訊!!!");
                return;
            }
            
            if (type == "insert"){
                this.buttonArray.push(buttonContent);   
            } else if (type == "edit"){
                this.editbuttonArray.push(buttonContent);
            }

            this.buttonName = '';
            this.buttonPort = '';
            this.buttonPin = '';
            this.buttonType = '';
        },

        delete_button(item,type) {
            if(type == "insert"){
                let remove = this.buttonArray.indexOf(item);
                this.buttonArray.splice(remove, 1);
            } else if (type == "edit"){
                let remove = this.editbuttonArray.indexOf(item);
                this.editbuttonArray.splice(remove, 1);
            }
        },

        reset_modal(){
            this.factory = "";
            this.equimentName = "";
            this.equimentAllowList = "";
            this.equimentAge = "";
            this.equimentMac = "";
            this.buttonArray = [];
            this.editbuttonArray = [];
            this.buttonName = '';
            this.buttonPort = '';
            this.buttonPin = '';
            this.buttonType = '';
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
</style>