<template>
    <div >
        <b-row class="search-bar align-items-center ">
            <b-col class="col-9">
                <div class="input-group align-items-center">
                    <p style="margin-bottom: 0 ;margin-right: 1vw; font-size: 18px; font-weight: 600; color: #3F7CAC">公告查詢</p>
                    <b-form-group  class="col-8 " style="margin:auto">
                        <b-form-input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            v-model="search_text"
                            @update="search()" />
                    </b-form-group>
                    <button type="button" style="margin-top: 0vw; height:80%" class="btn" @click="search()">查詢</button>
                    <!-- @input="detect() -->
                </div>
            </b-col>

        </b-row>
        <b-row >
            <b-col class="col-9">
                <table class="table table-hover table-striped">
                    <thead style="background: #3F7CAC">
                        <tr style="color:#000;">
                            <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px; border-top: none;">公告</th>
                            <th scope="col" style="width: 15%; border-top-right-radius: 10px; border-top: none;">發布時間</th>
                        </tr>
                    </thead>
                    <tbody class="post">
                        <tr v-for="(announce, index) in posts" :key="index">
                            <!-- <router-link :to="{path: `/announce-detail/${index}`, query: {title: announce.title, content: announce.content, time: announce.time}}"> -->
                            <!-- @click="show_detail(item) -->
                            <!-- <button type="button" class="btn" > -->
                            <th scope="row"  class="title" @click="show_detail(announce)">{{announce.title}}</th>
                            <!-- </button> -->
                            <!-- </router-link> -->

                            <td style="color:#000">{{ announce.time }}</td>
                        </tr>
                        <!-- <tr>
                            <th scope="row">公告二</th>
                            <td>2022-07-02</td>
                        </tr> -->

                    </tbody>
                </table>
            </b-col>
            <b-col class=" col-3" v-if="auth === 'false' || auth === null">
                <div class=" login-bar  align-items-center " >
                    <div class="mb-3">
                        <label for="account" class="form-label" >帳號</label>
                        <input type="text" class="form-control" id="account" v-model="account">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">密碼</label>
                        <input type="password" class="form-control" id="password"  v-model="password">
                    </div>
                    <button @click="login" class="btn col-xs-6">登入</button>
                    <button @click="show_register_modal" class="btn">註冊</button>
                </div>
            </b-col>
            <b-col class=" col-3" v-if="auth === 'true'">
                <b-row class=" login-bar align-items-center " >
                    <b-col class="mb-3">
                        <p>Hi! {{userName}}</p>
                        <p>帳號： {{account}}</p>
                        <!-- <input type="text" class="form-control" id="account" v-model="account"> -->
                    </b-col>
                    <b-col class="mb-3">
                        <!-- <label for="exampleInputPassword1" class="form-label">密碼</label> -->
                        <!-- <input type="password" class="form-control" id="password"  v-model="password"> -->
                        <button  class="btn" @click="logout">登出</button>
                    </b-col>
                    <!-- <button @click="login" type="submit" class="btn">登入</button> -->
                </b-row>
            </b-col>

        </b-row>
           <!-- :closeOnBackdrop="false" -->
        <b-modal
            size="xl"
            v-model="showDetailModal"
            content-class="detail-modal"
        >
            <b-row>
                <b-col lg="1" />
                <b-col lg="10">
                    <h4 class="text-wrapper">
                        {{ content }}
                    </h4>
                </b-col>
                <b-col lg="1" />
            </b-row>
            <template #modal-header>
                <h2>{{ title }}</h2>
            </template>
            <template #modal-footer>
                <p class="modal-title">{{ time }}</p>
            </template>
        </b-modal>


        <b-modal
            size="lg"
            v-model="showRegisterModal"
            content-class="my-modal"
            hide-footer
        >
            <b-form @submit="register">
                <b-form-group
                    id="input-group-1"
                    label="帳號:"
                    label-for="input-1"
                    :state="accountState"
                    :invalid-feedback="invalidAccountFeedback"
                >
                    <b-form-input
                    id="input-1"
                    v-model="form.account"
                    type="text"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="名稱:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="form.name"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-3"
                    label="密碼:"
                    label-for="input-3"
                    :state="passwordState"
                    :invalid-feedback="invalidPasswordFeedback"
                >
                    <b-form-input
                    id="input-3"
                    v-model="form.password"
                    type="password"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="密碼確認:"
                    label-for="input-4"
                    :state="checkPasswordState"
                    :invalid-feedback="invalidCheckPasswordFeedback"
                >
                    <b-form-input
                    id="input-4"
                    v-model="form.checkPassword"
                    type="password"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-5" label="Email:" label-for="input-5">
                    <b-form-input
                    id="input-5"
                    v-model="form.email"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-6" label="Phone:" label-for="input-6">
                    <b-form-input
                    id="input-6"
                    v-model="form.phone"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </b-modal>

    </div>


</template>

<script>
import { BIconArrowReturnLeft } from 'bootstrap-vue';


export default {

    computed: {
        accountState(){
            return this.form.account.length >= 5;
        },
        invalidAccountFeedback() {
            if (this.form.account.length > 0) {
                return '至少5個字元'
            }
        },
        passwordState(){
            return this.form.password.length >= 8;
        },
        invalidPasswordFeedback() {
            if (this.form.password.length > 0) {
                return '至少8個字元'
            }
        },
        checkPasswordState(){
            return this.form.password === this.form.checkPassword;
        },
        invalidCheckPasswordFeedback() {
            if (this.form.password != this.form.checkPassword) {
                return '密碼不同'
            }
        },
    },
    data() {
        return {
            items: [],
            allAccount: [],
            account: '',
            password: '',
            posts: [],
            gettime: '',
            yy: '',
            mm: '',
            dd: '',
            item: '',
            showDetailModal: false,
            showRegisterModal: false,
            title: '',
            content: '',
            time: '',
            search_text: '',
            auth: sessionStorage.getItem('AUTH'),
            userName: sessionStorage.getItem('USER_NAME'),
            form: {
                account: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                checkPassword: '',
            },
            isUse: false,
        };
    },

    created() {
        this.reset();
        this.getCurrentTime();
        this.account = sessionStorage.getItem('ACCOUNT');
        if(sessionStorage.getItem('AUTH') !== 'true'){
            sessionStorage.setItem('ROLE','guest');
            console.log('guest');
        }
    },

    methods: {
        login: function(){
            sessionStorage.setItem('AUTH', 'false');
            let account = this.account;
            let password = this.password;

            if(account === '' || password === '')
            {
                alert('Not NULL!!');
                return;
            }

            let data = {
                account:    this.account,
                password:   this.password,
            };
<<<<<<< HEAD
            console.log(data);
=======
>>>>>>> b1d0251962a764da3029a4f964128e7288272946
            this.$http
                .post('/api/accounts/login', {data:data})
                .then(async res =>
                {
<<<<<<< HEAD
                    console.log(data);
=======
                    // console.log(res);
>>>>>>> b1d0251962a764da3029a4f964128e7288272946
                    if (res.status !== 200)
                    {
                        alert('傳入值出現非預期狀況，請確認後再進行操作!');
                        sessionStorage.setItem('AUTH', 'false');
                        return;
                    }
                    // alert('login!');
                    var result = res.data[0];
<<<<<<< HEAD
                    
                    console.log(res.data[0]);
=======

>>>>>>> b1d0251962a764da3029a4f964128e7288272946
                    if (res.data.length !== 0)
                    {
                        sessionStorage.setItem('ACCOUNT', result.account);
                        sessionStorage.setItem('ROLE', result.role);
                        sessionStorage.setItem('USER_NAME', result.name);
                        sessionStorage.setItem('AUTH', 'true');
<<<<<<< HEAD
                        location.reload(); 
=======
                        location.reload();
>>>>>>> b1d0251962a764da3029a4f964128e7288272946
                        // await this.sessionStorge_setItemem('AUTH');
                    }
                    else
                    {
                        alert('帳號或密碼輸入錯誤');
                    }
                })
                .catch(err =>
                {
                    console.log(err);
                    return;
                });
        },
        async sessionStorge_setItem(result){
            return new Promise(resolve => {
                sessionStorage.setItem('ACCOUNT', result.account);
                sessionStorage.setItem('ROLE', result.role);
                sessionStorage.setItem('USER_NAME', result.name);
                sessionStorage.setItem('AUTH', 'true');
                console.log('ok');
                resolve();

            })

        },
        show_register_modal() {
            this.showRegisterModal = true;
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
        register() {
            this.isUse = false;

            if(!this.accountState || !this.passwordState || !this.checkPasswordState)
            {
                alert('格式不對！');
                return;
            }

            for (let i = 0 ; i < this.allAccount.length ; ++i){

                if(this.allAccount[i].account === this.form.account){
                    this.isUse = true;
                }

            }
            if(this.isUse){
                alert('帳號已被使用');
                return;
            }

            let data = {
                account: this.form.account,
                password: this.form.password,
                name: this.form.name,
                email: this.form.email,
                phone: this.form.phone,
                role: 'user',
            }
            this.$http
                .post("/api/accounts/insert_accounts", {data:data})
                .then(res => {
                    if(res.status === 201){
                        alert('成功註冊!');
                        this.showRegisterModal = false;
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
        logout() {
            sessionStorage.clear();
            this.account = '';
            this.password = '';
            this.auth = 'false';
            // location.reload();
        },
        reset(){ //show post
            this.posts = [];
            this.form.account = "";
            this.form.name = "";
            this.form.password = "";
            this.form.checkPassword = "";
            this.form.email = "";
            this.form.phone = "";
            this.$http
                .get('/api/posts/show_post')
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        let yy = result.time.substring(2,4);
                        let mm = result.time.substring(5,7);
                        let dd = result.time.substring(8,10);
                        let hh = result.time.substring(11,13);
                        let MM = result.time.substring(14,16);
                        result.time =   yy + '-'  +
                                        mm + '-'  +
                                        dd + ' '  +
                                        hh + ':'  +
                                        MM;
                        this.posts.push(result);
                    }
                })
                .catch(err => {
                    this.reset();
                    console.log(err);
                })
        },
        getCurrentTime() {
            //获取当前时间并打印
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth()+1;
            let dd = new Date().getDate();
            let hh = new Date().getHours();
            let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
            let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
            this.gettime = yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;
            // console.log(this.gettime)
        },
        show_detail(item) {
            this.title = item.title;
            this.content = item.content;
            this.time = item.time;
            this.showDetailModal = true;
        },
        search(){
            this.posts = [];
            let data = {
                search: this.search_text,
            };
            this.$http
                .post('/api/posts/show_search', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        let yy = result.time.substring(2,4);
                        let mm = result.time.substring(5,7);
                        let dd = result.time.substring(8,10);
                        let hh = result.time.substring(11,13);
                        let MM = result.time.substring(14,16);
                        result.time =   yy + '-'  +
                                        mm + '-'  +
                                        dd + ' '  +
                                        hh + ':'  +
                                        MM;
                        this.posts.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
            });
        },
    }
}


</script>

<style scope>
    div{
        color: #fff;
    }
    .b-toaster{
        color: #000;
    }
    .login-bar{
        background: #3F7CAC;
        border-radius: 8px;
        padding: 1vw;
        color: #fff;
    }
    .search-bar{
        margin: 1vw;
    }

    .btn{
        background: #47ABF7;
        margin-left: 1vw;
        margin-right: 1vw;
        margin-top: 1vw;
        color: #fff;
    }

    a{
        color: #000;
    }

    .post{
        background: #70aee1;
        border-color:#3F7CAC;
        border-top-color: #3F7CAC;
        color: #000;
    }

    .title{
        width: 60%;
        font-size: 1.rem;
    }

    .my-modal{
        background: #CADFF0;
    }
    .detail-modal{
        background: #435767;
    }
    label{
        color:#000;
    }
    .green_button{
        background: #4DA167;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
    }
    .text-wrapper {
        white-space: pre-wrap;
    }
</style>
