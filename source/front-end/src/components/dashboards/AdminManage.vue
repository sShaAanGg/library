<template>
	<div>
        <b-col>
            <b-row class="search-bar justify-content-center" align-v="center">
                <b-col class="col-lg-8 col-10">
                    <div class="input-group align-items-center">
                        <p style="margin-bottom: 0 ;margin-right: 1vw; font-size: 18px; font-weight: 600; color: #3F7CAC">管理員設定</p>
                        <b-form-group class="col-6" style="margin:auto">
                            <b-form-input
                                type="search"
                                class="form-control rounded"
                                placeholder="Search"
                                v-model="searchText"
                                @update="search()" />
                        </b-form-group>
                        <button type="button" class="btn" style="margin-top: 0vw; height:80%" @click="search()">查詢</button>
                        <button type="button" class="btn"  style="margin-top: 0vw; height:80%; background: #4DA167;" @click="show_insert_modal">新增管理員</button>
                    </div>
                </b-col>
            </b-row>
            <b-row class="justify-content-center" style="margin-top: 1vw;">
                <b-col class="col-10">
                    <table class="table table-hover table-striped" style="table-layout: fixed; ">
                        <thead style="background: #3F7CAC;">
                            <tr style="color:#fff;">
                                <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px;width: 30%;">帳號</th>
                                <th scope="col" style="width: 20%;">名稱</th>
                                <th scope="col" style="width: 20%;">Email</th>
                                <th scope="col" style="width: 10%;">電話</th>
                                <th scope="col" style="border-top-right-radius: 10px; width: 25%;"></th>
                            </tr>
                        </thead>
                        <tbody class="admin">
                            <tr v-for="(admin, index) in admins" :key="index">
                                <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                <th scope="row">{{admin.account}}</th>
                                <!-- </router-link> -->
                                <td>{{admin.name}}</td>
                                <td>{{admin.email}}</td>
                                <td>{{admin.phone}}</td>
                                <td style="float: right">
                                    <!-- <button v-if="book.borrow && book.reserve" type="button" class="green_button" @click="return_book(book)">已預約 還書</button> -->
                                    <button type="button" class="green_button" @click="show_update_modal(admin)">修改</button>
                                    <button type="button" class="blue_button" @click="show_password_modal(admin)">修改密碼</button>
                                    <button type="button" class="red_button" @click="delete_admin(admin)">刪除</button>
                                    <!-- <b-icon  v-if="!book.collect" @click="add_to_collect(book)" icon="heart" class="collect_heart"></b-icon>
                                    <b-icon  v-if="book.collect" @click="add_to_collect(book)" icon="heart-fill" class="collect_heart"></b-icon> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-col>

        <!-- <b-modal
            size="lg"
            v-model="showDetailModal"
            content-class="detail-modal"
        >
            <b-row style="color: #fff">
                <b-col lg="4">
                    <img :src="`${item.imgpath}`" style="max-width: 100%">
                </b-col>
                <img src="../../assets/img/ato.jpg">
                <b-col lg="8">
                    <b-row>
                        <h4>作者：{{ item.author }} </h4>
                    </b-row>
                    <b-row>
                        <h4>出版社：{{ item.publish }} </h4>
                    </b-row>
                    <b-row>
                        <h4>索書號： {{ item.callnumber }}</h4>
                    </b-row>
                </b-col>
            </b-row>
            <template #modal-title>
                <h3 class="modal-title text-white">{{ item.name }}</h3>
            </template>
            <template #modal-footer>
                <button type="button" class="green_button" @click="show_update_modal(item)">修改</button>
                <button type="button" class="red_button" @click="delete_book(item)">刪除</button>

            </template>
		</b-modal> -->

        <b-modal
            size="lg"
            v-model="showUpdateModal"
            content-class="detail-modal"
            hide-footer
        >
            <b-form >
                <b-form-group id="input-group-2" label="名稱:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="updateForm.name"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-3"
                    label="Email:"
                    label-for="input-3"
                >
                    <b-form-input
                    id="input-3"
                    v-model="updateForm.email"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="電話:"
                    label-for="input-4"
                >
                    <b-form-input
                    id="input-4"
                    v-model="updateForm.phone"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-button @click.prevent="update_admin" variant="primary">確認修改管理員</b-button>
            </b-form>
        </b-modal>

        <b-modal
            size="lg"
            v-model="showPasswordModal"
            content-class="detail-modal"
            hide-footer
        >
            <b-form>
                <b-form-group
                    id="input-group-3"
                    label="密碼:"
                    label-for="input-3"
                    :state="updatePasswordState"
                    :invalid-feedback="invalidPasswordFeedback"
                >
                    <b-form-input
                    id="input-3"
                    v-model="updateForm.password"
                    type="password"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="密碼確認:"
                    label-for="input-4"
                    :state="updateCheckPasswordState"
                    :invalid-feedback="invalidCheckPasswordFeedback"
                >
                    <b-form-input
                    id="input-4"
                    v-model="updateForm.checkPassword"
                    type="password"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-button @click.prevent="update_password" variant="primary">確認修改密碼</b-button>
            </b-form>
        </b-modal>

        <b-modal
            size="lg"
            v-model="showInsertModal"
            content-class="detail-modal"
            hide-footer
        >
            <b-form >
                <b-form-group
                    id="input-group-1"
                    label="帳號:"
                    label-for="input-1"
                    :state="accountState"
                    :invalid-feedback="invalidAccountFeedback"
                >
                    <b-form-input
                    id="input-1"
                    v-model="insertForm.account"
                    type="text"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="名稱:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="insertForm.name"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="密碼:" label-for="input-3">
                    <b-form-input
                    id="input-3"
                    type="password"
                    v-model="insertForm.password"
                    :state="insertPasswordState"
                    :invalid-feedback="invalidPasswordFeedback"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="密碼確認:"
                    label-for="input-4"
                    :state="insertCheckPasswordState"
                    :invalid-feedback="invalidCheckPasswordFeedback"
                >
                    <b-form-input
                    id="input-4"
                    v-model="insertForm.checkPassword"
                    type="password"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-5"
                    label="Email:"
                    label-for="input-5"
                >
                    <b-form-input
                    id="input-5"
                    v-model="insertForm.email"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-6"
                    label="電話:"
                    label-for="input-6"
                >
                    <b-form-input
                    id="input-6"
                    v-model="insertForm.phone"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-button @clicl.prevent="insert_admin" variant="primary">新增管理員</b-button>
            </b-form>
        </b-modal>

	</div>
</template>

<script>
import BtnSwitch from '../buttons/BtnSwitch.vue';

export default {
    computed: {
        accountState(){
            return this.insertForm.account.length >= 5;
        },
        invalidAccountFeedback() {
            if (this.insertForm.account.length > 0) {
                return '至少5個字元'
            }
        },
        insertPasswordState(){
            return this.insertForm.password.length >= 8;
        },
        updatePasswordState(){
            return this.updateForm.password.length >= 8;
        },
        invalidPasswordFeedback() {
            if (this.insertForm.password.length > 0 || this.updateForm.password.length > 0) {
                return '至少8個字元'
            }
        },
        insertCheckPasswordState(){
            return this.insertForm.password === this.insertForm.checkPassword;
        },
        updateCheckPasswordState(){
            return this.updateForm.password === this.updateForm.checkPassword;
        },
        invalidCheckPasswordFeedback() {
            if (this.insertForm.password != this.insertForm.checkPassword || this.updateForm.password != this.updateForm.checkPassword) {
                return '密碼不同'
            }
        },

    },
    data: () => {
        return {
            admins : [],
            item: "",
            // showDetailModal: false,
            showInsertModal: false,
            showUpdateModal: false,
            showPasswordModal: false,
            // adminName: '',
            // adminAuthor: '',
            // adminPublish: '',
            // callnumber: '',
            searchText: "",
            updateForm: {
                account: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                checkPassword: '',
            },
            insertForm: {
                account: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                checkPassword: '',
            },
            isUser: false,
            allAccount: [],
        };
    },
    created() {
        this.reset();
    },
    methods: {
        show_password_modal(item) {
            this.item = item;
            this.showPasswordModal = true;
        },
        show_update_modal(item) {
            this.item = item;
            this.showUpdateModal = true;
            this.updateForm.name = item.name;
            this.updateForm.email = item.email;
            this.updateForm.phone = item.phone;
        },
        show_insert_modal() {
            this.showInsertModal = true;
            this.$http
                .get('/api/accounts/all_accounts')
                .then(res => {

                    if (res.status === 200)
                    {
                        for (let i = 0 ; i < res.data.length ; ++i){
                            var result = res.data[i];
                            this.allAccount.push(result);
                        }
                    }
                    else
                    {
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                    }

                })
                .catch(err => {
                    console.log(err);
                });
        },
        insert_admin(){
            this.isUse = false;
            // console.log(this.insertForm.account);
            if(!this.accountState || !this.insertPasswordState || !this.insertCheckPasswordState)
            {
                alert('格式不對！');
                return;
            }

            for (let i = 0 ; i < this.allAccount.length ; ++i){

                if(this.allAccount[i].account === this.insertForm.account){
                    this.isUse = true;
                }

            }

            if(this.isUse){
                alert('帳號已被使用');
                return;
            }

            let toastBody = "已成功新增管理員";
            let data = {
                name: this.insertForm.name,
                account: this.insertForm.account,
                password: this.insertForm.password,
                email: this.insertForm.email,
                phone: this.insertForm.phone,
                role: 'admin',
            };
            // console.lot(this.insertForm.account);
            this.$http
                .post("/api/accounts/insert_accounts", {data:data})
                .then(res => {
                    if(res.status === 201){
                        this.showInsertModal = false;
                        this.$bvToast.toast(toastBody, {
                            title: '',
                            solid: true,
                            variant: 'success',
                            autoHideDelay: 300,
                        });
                        this.reset();
                    }
                    else
                    {
                        return
                    }
            })
            .catch(err => {
                alert('錯誤!');
                console.log(err);
            });
        },
        update_admin() {
            let toastBody = "已成功修改管理員";
            let data = {
                name: this.updateForm.name,
                account: this.item.account,
                email: this.updateForm.email,
                phone: this.updateForm.phone,
            };
            this.$http
                .patch("/api/accounts/update_accounts", {data:data})
                .then(res => {
                    if(res.status === 202){
                        this.showUpdateModal = false;
                        this.$bvToast.toast(toastBody, {
                            title: '',
                            solid: true,
                            variant: 'success',
                            autoHideDelay: 300,
                        });
                        this.reset();
                    }
                    else
                    {
                        return
                    }
            })
            .catch(err => {
                alert('錯誤!');
                console.log(err);
            });
        },
        update_password() {

            if (!(this.updateForm.password) || !(this.updateForm.checkPassword))
            {
                return alert("請輸入密碼!");
            }

            if (this.updateForm.password !== this.updateForm.checkPassword)
            {
                this.updateForm.checkPassword = "";
                return alert("確認密碼失敗，請重新輸入!");
            }

            if(!this.updatePasswordState || !this.updateCheckPasswordState)
            {
                alert('格式不對！');
                return;
            }

            let toastBody = "已成功修改密碼";
            let data = {
                password: this.updateForm.password,
                account: this.item.account,
            };
            this.$http
                .patch("/api/accounts/update_password", {data:data})
                .then(res => {
                    if(res.status === 202){
                        this.showPasswordModal = false;
                        this.$bvToast.toast(toastBody, {
                            title: '',
                            solid: true,
                            variant: 'success',
                            autoHideDelay: 300,
                        });
                        this.reset();
                    }
                    else
                    {
                        return
                    }
            })
            .catch(err => {
                alert('錯誤!');
                console.log(err);
            });
        },
        delete_admin(item) {
            if (confirm("確認刪除此書嗎?")) {
                let data = {
                    account: item.account
                };
                this.$http
                    .post("/api/accounts/delete_accounts", { data: data })
                    .then(res => {
                    if (res.status === 203) {
                        this.reset();
                    }
                    else {
                        alert("傳入值出現非預期狀況，請確認後再進行操作!");
                    }
                })
                    .catch(err => {
                    alert("發生錯誤!");
                    console.log(err);
                });
            }
        },
        search(){
            this.admins = [];
            let data = {
                search: this.searchText,
            };
            this.$http
                .post('/api/accounts/search_accounts', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.admins.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
            });
        },
        reset() {
            this.showInsertModal = false;
            this.showUpdateModal = false;
            // this.showDetailModal = false;
            this.admins = [];
            this.insertForm.account = "";
            this.insertForm.name = "";
            this.insertForm.password = "";
            this.insertForm.checkPassword = "";
            this.insertForm.email = "";
            this.insertForm.phone = "";

            this.updateContent = "";
            this.newTitle = "";
            this.newContent = "";
            this.$http
                .get('/api/accounts/show_admin_accounts')
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        // result.content = result.content.replaceAll(/<br>/g, "\n");
                        this.admins.push(result);
                    }
                })
                .catch(err => {
                    this.reset();
                    console.log(err);
                })
        }
    },
    components: { BtnSwitch }
};
</script>

<style scope>
    .text-wrapper {
        white-space: pre-wrap;
    }
    .admins{
        background: #70aee1;
        border-color:#3F7CAC;
        border-top-color: #3F7CAC;
        color:#000;
    }
    .card-base {
        background-color: #435767;
        border-color: #0e2e2b;
        color: white;
    }
    a:hover {
        color: white;
    }
    a{
        color: white;
    }
    /* .modal-am {
        color: white;
    } */
    .detail-modal{
        background: #435767;
        color: #fff;
    }

    .green_button{
        background: #4DA167;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
        margin-inline: 5px;
    }

    .blue_button{
        background: #3F7CAC;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
        margin-inline: 5px;
    }

    .red_button{
        background: #9b4a46;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
        margin-inline: 5px;
    }

    .ellipsis {
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .btn{
        background: #47ABF7;
        margin-left: 1vw;
        margin-right: 1vw;
        margin-top: 1vw;
        color: #fff;
    }
</style>
