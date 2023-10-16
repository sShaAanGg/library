<template>
	<div>
		<b-card class="card-base">
            <template #header>
                <h4>
                    <CIcon name="cil-people" size="lg" /> 帳號管理
                </h4>
            </template>

			<b-card-body>
                <b-tabs>
                    <b-tab title="個人資料修改">
                        <b-col lg="10">
                            <b-row>
                                <b-col class="col-4 py-2">
                                    <h4>帳號：{{item.account}}</h4>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col class="col-4 py-2">
                                    <h4>名稱：{{item.name}}</h4>
                                </b-col>
                                <b-col lg="5" class="col-4 py-2">
                                    <b-form-input v-model="updateName"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col class="col-4 py-2">
                                    <h4>E-mail：{{item.email}}</h4>
                                </b-col>
                                <b-col lg="5" class="col-4 py-2">
                                    <b-form-input type="email" v-model="updateEmail"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col class="col-4 py-2">
                                    <h4>電話：{{item.phone}}</h4>
                                </b-col>
                                <b-col lg="5" class="col-4 py-2">
                                    <b-form-input type="text" max="10" v-model="updatePhone"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col class="col-4">
                                </b-col>
                                <b-col lg="5" class="col-4 py-2">
                                    <b-button @click.prevent="update_account()">送出修改</b-button>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-tab>
                    <b-tab title="密碼修改">
                        <b-col lg="10">
                            <b-row>
                                <b-col lg="5" class="col-4 py-2">
                                    <label for="new-password">新密碼：</label>
                                    <b-form-input id="new-password" type="password" v-model="updatePassword"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="5" class="col-4 py-2">
                                    <label for="check-password">確認新密碼：</label>
                                    <b-form-input id="check-password" type="password" v-model="checkPassword"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="5" class="col-4 py-2">
                                    <b-button @click.prevent="update_password()">送出修改</b-button>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-tab>
                </b-tabs>
			</b-card-body>
		</b-card>
	</div>
</template>

<script>
import BtnSwitch from '../buttons/BtnSwitch.vue';

export default {
    data: () => {
        return {
            showDepartmentModal: false,
            item: '',
            allAccount: [],
            fields: [
                { key: "account", label: "帳號", _style: "width:17%; color: #4C756A" },
                { key: "name", label: "姓名", _style: "width:17%; color: #4C756A" },
                { key: "job_number", label: "工號", _style: "width:17%; color: #4C756A" },
                { key: "dept", label: "部門", _style: "width:17%; color: #4C756A" },
                { key: "role", label: "權限", _style: "width:17%; color: #4C756A" },
                { key: "show_details", label: "", _style: "width:15%; color: #4C756A" },
            ],
            showInsertModal: false,
            showUpdateModal: false,
            showUpdatePasswordModal: false,
            account: "",
            password: "",
            name: "",
            jobNumber: "",
            dept: "",
            role: "",
            roleOptions: ["guest", "user", "admin"],
            updateName: "",
            updatePhone: "",
            updateEmail: "",
            updatePassword: "",
            newPassword: "",
            checkPassword: "",
            oldPassword: "",
        };
    },
    created() {
        this.reset();
    },
    methods: {
        // show_model(source, item) {
        //     if (source === "修改資料") {
        //         this.account = item.account;
        //         this.name = item.name;
        //         this.jobNumber = item.job_number;
        //         this.dept = item.dept;
        //         this.role = item.role;
        //         this.updateAccount = item.account;
        //         this.updateName = item.name;
        //         this.updateJobNumber = item.job_number;
        //         this.updateDept = item.dept;
        //         this.updateRole = item.role;
        //         this.showUpdateModal = true;
        //     }
        //     if (source === "修改密碼") {
        //         this.updateAccount = item.account;
        //         this.newPassword = "";
        //         this.checkPassword = "";
        //         this.showUpdatePasswordModal = true;
        //     }
        // },
        // insert_account(){
        //     if (!this.account)   return alert('請輸入帳號')
        //     if (!this.password)  return alert('請輸入密碼')
        //     if (!this.name)      return alert('請輸入姓名')
        //     for (let i = 0 ; i < this.items.length ; ++i){
        //         if (this.items[i].account === this.account){
        //             this.account = ''
        //             alert('請勿使用已重複的帳號')
        //             return
        //         }
        //         if (this.items[i].name === this.name){
        //             this.name = ''
        //             alert('請勿使用已重複的姓名')
        //             return
        //         }
        //     }
        //     let data = {
        //         account:this.account,
        //         password:this.password,
        //         name:this.name,
        //         job_number:this.jobNumber,
        //         dept:this.dept,
        //         role:this.role
        //     }
        //     this.$http
        //         .post('/api/accounts/insert_accounts',{data:data})
        //         .then(res => {
        //             if (res.status === 201){
        //                 this.reset()
        //             } else {
        //                 alert('傳入值出現非預期狀況，請確認後再進行操作!')
        //             }
        //         })
        //         .catch(err => {
        //             alert('發生錯誤!')
        //             this.showInsertModal = false
        //             console.log(err)
        //         })
        // },
        update_account() {
            let toastBody = "已成功修改資料";
            for (let i = 0; i < this.allAccount.length; ++i) {
                if (this.allAccount[i].name === this.updateName && this.item.name != this.updateName) {
                    alert("請勿使用已重複的姓名");
                    return;
                }
            }
            let data = {
                account: sessionStorage.getItem('ACCOUNT'),
                name: this.updateName,
                email: this.updateEmail,
                phone: this.updatePhone,
            };
            this.$http
                .patch("/api/accounts/update_accounts", { data: data })
                .then(res => {
                if (res.status === 202) {
                    this.reset();
                    this.$bvToast.toast(toastBody, {
                        solid: true,
                        variant: 'success',
                        autoHideDelay: 300,
                    });
                }
                else {
                    alert("傳入值出現非預期狀況，請確認後再進行操作!");
                }
            })
            .catch(err => {
                alert("發生錯誤!");
                console.log(err);
            });
        },
        update_password() {
            let toastBody = "已成功修改密碼";
            if (!(this.updatePassword) || !(this.checkPassword))
                return alert("請輸入密碼!");
            if (this.updatePassword !== this.checkPassword) {
                this.checkPassword = "";
                return alert("確認密碼失敗，請重新輸入!");
            }
            let data = {
                password: this.updatePassword,
                account: this.updateAccount
            };
            this.$http
                .patch("/api/accounts/update_password", { data: data })
                .then(res => {
                if (res.status === 202) {
                    this.reset();
                    this.$bvToast.toast(toastBody, {
                        solid: true,
                        variant: 'success',
                        autoHideDelay: 300,
                    });
                }
                else {
                    alert("傳入值出現非預期狀況，請確認後再進行操作!");
                }
            })
                .catch(err => {
                alert("發生錯誤!");
                this.showUpdatePasswordModal = false;
                console.log(err);
            });
        },
        delete_account(account) {
            if (confirm("確認刪除此設定嗎?")) {
                let data = {
                    account: this.account
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
        reset() {
            // this.showInsertModal = false;
            // this.showUpdateModal = false;
            // this.showUpdatePasswordModal = false;
            // console.log(sha256())
            this.item = '';
            let data = {
                account: sessionStorage.getItem('ACCOUNT')
            }
            this.$http
                .patch("/api/accounts/show_user_accounts", {data:data})
                .then(res => {
                this.item = res.data[0];
                this.updateAccount = this.item.account;
                this.updateName = this.item.name;
                this.updatePhone = this.item.phone;
                this.updateEmail = this.item.email;
            })
            .catch(err => {
                // this.reset();
                console.log(err);
            });

            this.$http
                .get("/api/accounts/all_accounts", )
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.allAccount.push(result);
                    }
            })
            .catch(err => {
                // this.reset();
                console.log(err);
            });
        }
    },
    components: { BtnSwitch }
};
</script>

<style scope>
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
    .table {
        color: white;
    }
    .modal-am {
        color: white;
    }
    label{
        color: white;
    }
</style>
