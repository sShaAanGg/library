<template>
    <div>
        <CCard class="mr-1 mb-1 h-100 cardstyle">
            <CCardBody>
                <h4 style="color:#8c5c7d"><CIcon name="cil-cog" size="lg"/> 參數設定</h4>
                <hr class="mt-0 mb-2">

                <CRow>
                    <CCol lg = '6' class="pt-2">
                        <CButtonGroup style="margin-bottom:20px" class="pt-2">
                            <CButton v-bind="buttonColor['error']"          @click="mode_cutover('error')">不良代碼</CButton>
                            <CButton v-bind="buttonColor['equipment']"      @click="mode_cutover('equipment')">設備</CButton>
                            <CButton v-bind="buttonColor['mould']"          @click="mode_cutover('mould')">模具</CButton>
                        </CButtonGroup>
                    </CCol>
                    <CCol lg = '6' class="pt-2">
                        <CButton class="mr-2 mb-4" variant="outline" color="info" style="float:right" @click="show_insert()">
                            <CIcon name="cil-medical-cross" size="xl"/>
                            新增設定
                        </CButton>
                    </CCol>
                </CRow>

                <CRow>
                    <CCol lg = '12' class="pt-2">
                        <CDataTable
                            :items="items"
                            :fields="fields"
                            style="textalign: center; font-size: 125%"
                            :items-per-page="10"
                            :bordered="true"
                            column-filter
                            sorter
                            pagination
                        >
                            <template #show="{item}">
                                <CButton v-if="item.type==='自訂'" @click="show_update(item)" style="color: #2eb85c">
                                    <CIcon size="xl" name="cil-pencil"/>
                                </CButton>
                                <CButton v-if="item.type==='自訂'" @click="delete_setting(item)" style="color: #e55353">
                                    <CIcon size="xl" name="cil-trash"/>
                                </CButton>
                            </template>
                        </CDataTable>
                    </CCol>
                </CRow>

                <CModal
                    size="lg"
                    color="info"
                    :show.sync="showInsert"
                    :closeOnBackdrop="false"
                >
                    <CRow>
                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5>類別 :</h5>
                            <CSelect
                                class="mr-2"
                                :value.sync="insertType"
                                :options="modeOptions"
                                @change="cutover_class"
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>

                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5 v-if="insertType === '不良代號'">代號分類 :</h5>
                            <h5 v-if="insertType === '設備'">途程 :</h5>
                            <h5 v-if="insertType === '模具'">分組 :</h5>
                            <CSelect
                                class="mr-2"
                                :value.sync="insertClass"
                                :options="classOptions"
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>

                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5 v-if="insertType === '不良代號'">不良代碼 :</h5>
                            <h5 v-if="insertType === '設備'">設備 :</h5>
                            <h5 v-if="insertType === '模具'">模具 :</h5>
                            <CInput
                                class="mr-2"
                                v-if="insertClass"
                                v-model="insertInput"
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>
                    </CRow>
                    <template #header>
                        <h3 class="modal-title"> 新增設定 </h3>
                        <CButtonClose   @click="showInsert = false" class="text-white"/>
                    </template>
                    <template #footer>
                        <CButton   @click="insert_setting()"        color="info">確認</CButton>
                        <CButton   @click="showInsert = false"      color="danger">返回</CButton>
                    </template>
                </CModal>

                <CModal
                    size="lg"
                    color="success"
                    :show.sync="showUpdate"
                    :closeOnBackdrop="false"
                >
                    <CRow>
                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5>類別 :</h5>
                            <CInput
                                class="mr-2"
                                v-model="updateType"
                                disabled
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>

                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5 v-if="insertType === '不良代號'">代號分類 :</h5>
                            <h5 v-if="insertType === '設備'">途程 :</h5>
                            <h5 v-if="insertType === '模具'">分組 :</h5>
                            <CInput
                                class="mr-2"
                                v-model="updateClass"
                                disabled
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>

                        <CCol lg = '2' class="pt-2">
                        </CCol>
                        <CCol lg = '8' class="pt-2">
                            <h5 v-if="insertType === '不良代號'">不良代碼 :</h5>
                            <h5 v-if="insertType === '設備'">設備 :</h5>
                            <h5 v-if="insertType === '模具'">模具 :</h5>
                            <CInput
                                class="mr-2"
                                v-model="updateInput"
                            />
                        </CCol>
                        <CCol lg = '2' class="pt-2">
                        </CCol>
                    </CRow>
                    <template #header>
                        <h3 class="modal-title"> 更新設定 </h3>
                        <CButtonClose   @click="showUpdate = false" class="text-white"/>
                    </template>
                    <template #footer>
                        <CButton   @click="update_setting()"        color="success">確認</CButton>
                        <CButton   @click="showUpdate = false"      color="danger">返回</CButton>
                    </template>
                </CModal>

            </CCardBody>
        </CCard>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            buttonColor:{'error':{color:'info'},'equipment':{color:''},'mould':{color:''}},
            mode:'error',

            items:[],
            fields:[
                { key: "type",      label: "類型",      _style: "width:31%" },
                { key: "process",   label: "代號分類",  _style: "width:31%" },
                { key: "error",     label: "不良代號",  _style: "width:31%" },
                { key: 'show',      label:'',                               },
            ],

            errorTotalArray:[],
            equipmentTotalArray:[],
            mouldTotalArray:[],

            showInsert:false,
            showUpdate:false,

            modeOptions:[
                '不良代號',
                '設備',
                '模具'
            ],
            insertType:'',

            classOptions:[],
            insertClass:'',
            insertInput:'',

            updateID:'',
            updateType:'',
            updateClass:'',
            updateInput:'',
        }
    },
    created(){
        this.reset();
        this.mode_cutover('error');
    },
    methods:{
        mode_cutover(mode) {
            var itemArray = [];
            let data = {
                mode: mode
            }
            switch (mode){
                case 'error':
                    this.buttonColor = {'error':{color:'info'},'equipment':{color:''},'mould':{color:''}};
                    this.mode        = mode;

                    this.$http
                        .post('/api/order/select_setting',{data:data})
                        .then(res => {
                            if (res.status !== 200){
                                alert('回傳值出現非預期狀態，請確認後再進行操作!');
                                return;
                            }
                            for (let i = 0; i < res.data.length; ++i){
                                var result = res.data[i];
                                if (result.type === 'preset')       
                                    result.type = '預設';
                                if (result.type === 'increase')     
                                    result.type = '自訂';
                                itemArray.push(result);
                            }

                            this.fields = [
                                { key: "type",      label: "類型",      _style: "width:31%" },
                                { key: "process",   label: "代號分類",  _style: "width:31%" },
                                { key: "error",     label: "不良代號",  _style: "width:31%" },
                                { key: 'show',      label:'',                               },
                            ];
                            this.items = itemArray;
                        })
                        .catch(err => {
                            alert('搜尋不良代號失敗，錯誤碼:' + err);
                            this.reset();
                        })
                break

                case 'equipment':
                    this.buttonColor = {'error':{color:''},'equipment':{color:'info'},'mould':{color:''}};
                    this.mode        = mode;

                    this.$http
                        .post('/api/order/select_setting',{data:data})
                        .then(res => {
                            if (res.status !== 200){
                                alert('回傳值出現非預期狀態，請確認後再進行操作!');
                                return;
                            }

                            for (let i = 0; i < res.data.length; ++i){
                                var result = res.data[i];
                                if (result.type === 'preset')       
                                    result.type = '預設';
                                if (result.type === 'increase')     
                                    result.type = '自訂';
                                itemArray.push(result);
                            }
                            this.fields = [
                                { key: "type",      label: "類型",      _style: "width:31%" },
                                { key: "router",    label: "途程",      _style: "width:31%" },
                                { key: "equipment", label: "設備",      _style: "width:31%" },
                                { key: 'show',      label:'',                               },
                            ];
                            this.items = itemArray;
                        })
                        .catch(err => {
                            alert('搜尋設備失敗，錯誤碼:' + err);
                            this.reset();
                        })
                break

                case 'mould':
                    this.buttonColor = {'error':{color:''},'equipment':{color:''},'mould':{color:'info'}};
                    this.mode        = mode;

                    this.$http
                        .post('/api/order/select_setting',{data:data})
                        .then(res => {
                            if (res.status !== 200){
                                alert('回傳值出現非預期狀態，請確認後再進行操作!');
                                return;
                            }
                            for (let i = 0; i < res.data.length; ++i){
                                var result = res.data[i];
                                if (result.type === 'preset')       
                                    result.type = '預設';
                                if (result.type === 'increase')     
                                    result.type = '自訂';
                                itemArray.push(result);
                            }
                            this.fields = [
                                { key: "type",      label: "類型",      _style: "width:31%" },
                                { key: "class",     label: "分組",      _style: "width:31%" },
                                { key: "mould",     label: "模具",      _style: "width:31%" },
                                { key: 'show',      label:'',                               },
                            ];
                            this.items = itemArray;
                        })
                        .catch(err => {
                            alert('搜尋模具失敗，錯誤碼:' + err);
                            this.reset();
                        })
                break

                default:
                break
            }
        },

        show_insert() {
            this.showInsert = true;

            this.insertType = '不良代號';
            this.insertClass = '球心成型_F311';

            this.insertInput = '';

            this.classOptions = [
                '球心成型_F311',
                '球心研磨_F312',
                '射出_F321',
                '修邊_F322',
                '表面研磨_F331',
                '震動_F332',
                '印刷_F361',
                '噴漆_F371',
                '品檢_F381',
                '包裝_F391'
            ]
        },

        cutover_class() {
            switch (this.insertType){
                case '不良代號':
                    this.insertClass = '球心成型_F311';
                    this.classOptions = [
                        '球心成型_F311',
                        '球心研磨_F312',
                        '射出_F321',
                        '修邊_F322',
                        '表面研磨_F331',
                        '震動_F332',
                        '印刷_F361',
                        '噴漆_F371',
                        '品檢_F381',
                        '包裝_F391'
                    ]
                break;

                case '設備':
                    this.insertClass = '打料';
                    this.classOptions = [
                        '打料',
                        '架橋',
                        '粗胚',
                        '成型',
                        '粗磨',
                        '細磨',
                        '尺寸選別',
                        '洗球心',
                        '烘料',
                        '射出',
                        '修邊',
                        '表面研磨',
                        '震動',
                        '底漆',
                        '印刷',
                        '金油',
                        '裝條',
                        '手包',
                        '折盒',
                        '包裝'
                    ]
                break;

                case '模具':
                    this.insertClass = '球心組';
                    this.classOptions = [
                        '球心組',
                        '研磨組',
                        '射出組',
                        '包裝組'
                    ]
                break;

                default:
                break;
            }
        },

        insert_setting() {
            var mode;

            if (!this.insertInput){
                alert('請填入新增的設定!');
                return;
            }

            switch (this.insertType){
                case '不良代號':
                    if (this.errorTotalArray.indexOf(this.insertInput) >=0){
                        alert('請勿新增重複設定!');
                        return;
                    }
                    mode = 'error';
                break;

                case '設備':
                    if (this.equipmentTotalArray.indexOf(this.insertInput) >=0){
                        alert('請勿新增重複設定!');
                        return;
                    }
                    mode = 'equipment';
                break;

                case '模具':
                    if (this.mouldTotalArray.indexOf(this.insertInput) >=0){
                        alert('請勿新增重複設定!');
                        return;
                    }
                    mode = 'mould';
                break;

                default:
                break;
            }

            let data = {
                mode: this.insertType,
                class: this.insertClass,
                value: this.insertInput
            }
            this.$http
                .post('/api/order/insert_setting',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('回傳值出現非預期狀態，請確認後再進行操作!');
                        return;
                    }

                    this.showInsert = false;
                    alert('新增完畢!');
                    this.reset();
                    this.mode_cutover(mode);
                })
                .catch(err => {
                    alert('新增失敗，錯誤碼:' + err);
                    this.reset();
                })
        },

        show_update(item) {
            switch (this.mode){
                case 'error':
                    this.updateType = '不良代號';
                    this.updateClass = item.process;
                    this.updateInput = item.error;
                break;

                case 'equipment':
                    this.updateType = '設備';
                    this.updateClass = item.router;
                    this.updateInput = item.equipment;
                break;

                case 'mould':
                    this.updateType = '模具';
                    this.updateClass = item.class;
                    this.updateInput = item.mould;
                break;

                default:
                break;
            }
            this.updateID = item.id;
            this.showUpdate = true;
        },

        update_setting() {
            if (!this.updateInput){
                alert('請填入更新的設定!');
                return;
            }

            switch (this.updateType){
                case '不良代號':
                    if (this.errorTotalArray.indexOf(this.updateInput) >=0){
                        alert('請勿更新重複設定!');
                        return;
                    }
                break;

                case '設備':
                    if (this.equipmentTotalArray.indexOf(this.updateInput) >=0){
                        alert('請勿更新重複設定!');
                        return;
                    }
                break;

                case '模具':
                    if (this.mouldTotalArray.indexOf(this.updateInput) >=0){
                        alert('請勿更新重複設定!');
                        return;
                    }
                break;

                default:
                break;
            }

            let data = {
                id: this.updateID,
                mode: this.mode,
                value: this.updateInput
            }
            this.$http
                .patch('/api/order/update_setting',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('回傳值出現非預期狀態，請確認後再進行操作!');
                        return;
                    }

                    this.showUpdate = false;
                    alert('更新完畢!');
                    this.reset();
                    this.mode_cutover(this.mode);
                })
                .catch(err => {
                    alert('更新失敗，錯誤碼:' + err);
                    this.reset();
                })
        },

        delete_setting(item) {
            if(confirm('確認執行刪除操作嗎?')){
                let data = {
                    mode: this.mode,
                    id: item.id
                }
                this.$http
                    .post('/api/order/delete_setting',{data:data})
                    .then(res => {
                        if (res.status !== 203){
                            alert('回傳值出現非預期狀態，請確認後再進行操作!');
                            return;
                        }

                        alert('刪除完畢!');
                        this.reset();
                        this.mode_cutover(this.mode);
                    })
                    .catch(err => {
                        alert('刪除失敗，錯誤碼:' + err);
                        this.reset();
                    })
            }
            return;
        },
        
        reset() {
            var itemArray = [];

            let data = {
                mode: 'error'
            }
            this.$http
                .post('/api/order/select_setting',{data:data})
                .then(res => {
                    if (res.status !== 200){
                        alert('回傳值出現非預期狀態，請確認後再進行操作!');
                        return;
                    }

                    itemArray = [];
                    for (let i = 0; i < res.data.length; ++i){
                        var result = res.data[i];
                        itemArray.push(result.error);
                    }
                    this.errorTotalArray = itemArray;
                    data = {
                        mode: 'equipment'
                    }
                    this.$http
                        .post('/api/order/select_setting',{data:data})
                        .then(res => {
                            if (res.status !== 200){
                                alert('回傳值出現非預期狀態，請確認後再進行操作!');
                                return;
                            }

                            itemArray = [];
                            for (let i = 0; i < res.data.length; ++i){
                                var result = res.data[i];
                                itemArray.push(result.equipment);
                            }
                            this.equipmentTotalArray = itemArray;

                            data = {
                                mode:'mould'
                            }
                            this.$http
                                .post('/api/order/select_setting',{data:data})
                                .then(res => {
                                    if (res.status !== 200){
                                        alert('回傳值出現非預期狀態，請確認後再進行操作!');
                                        return;
                                    }
                                    itemArray = [];
                                    for (let i = 0; i < res.data.length; ++i){
                                        var result = res.data[i];
                                        itemArray.push(result.mould);
                                    }
                                    this.mouldTotalArray = itemArray;
                                })
                                .catch(err => {
                                    alert('搜尋模具失敗，錯誤碼:' + err);
                                    this.reset();
                                })
                        })
                        .catch(err => {
                            alert('搜尋設備失敗，錯誤碼:' + err);
                            this.reset();
                        })
                })
                .catch(err => {
                    alert('搜尋不良代號失敗，錯誤碼:' + err);
                    this.reset();
                })
        }
    },
}
</script>

<style lang="scss" scoped>
    // .cardstyle {
    // // border: 0px;
    // box-shadow: 2px 2px 2px rgba(20%,20%,40%,0.1),4px 4px 6px rgba(20%,20%,40%,0.1),6px 6px 12px rgba(20%,20%,40%,0.2);
    // }
</style>
