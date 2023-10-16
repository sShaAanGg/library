<template>
	<div>
        <b-col>
            <b-row class="search-bar justify-content-center" align-v="center">
                <b-col class="col-lg-6 col-9">
                    <div class="input-group align-items-center">
                        <p style="margin-bottom: 0 ;margin-right: 1vw; font-size: 18px; font-weight: 600; color: #3F7CAC">公告設定</p>
                        <b-form-group class="col-6" style="margin:auto">
                            <b-form-input
                                type="search"
                                class="form-control rounded"
                                placeholder="Search"
                                v-model="searchText"
                                @update="search()" />
                        </b-form-group>
                        <button type="button" class="btn" style="margin-top: 0vw; height:80%" @click="search()">查詢</button>
                        <button type="button" class="btn"  style="margin-top: 0vw; height:80%; background: #4DA167;" @click="show_insert_modal">新增公告</button>
                    </div>
                </b-col>
            </b-row>
            <b-row class="justify-content-center" style="margin-top: 1vw;">
                <b-col class="col-10">
                    <table class="table table-hover table-striped" style="table-layout: fixed; ">
                        <thead style="background: #3F7CAC;">
                            <tr style="color:#fff;">
                                <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px;width: 60%;">標題</th>
                                <!-- <th scope="col" style="width: 45%;">內容</th> -->
                                <th scope="col" style="width: 20%;">修改時間</th>
                                <!-- <th scope="col" style="width: 10%;">索書號</th> -->
                                <th scope="col" style="border-top-right-radius: 10px; width: 20%;"></th>
                            </tr>
                        </thead>
                        <tbody class="post">
                            <tr v-for="(post, index) in posts" :key="index">
                                <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                <th style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis " scope="row" @click="show_detail_modal(post)">{{post.title}}</th>
                                <!-- </router-link> -->
                                <!-- <td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis ">{{post.title}}</td> -->
                                <td>{{post.time}}</td>
                                <!-- <td>{{book.callnumber}}</td> -->
                                <td style="float: right">
                                    <!-- <button v-if="book.borrow && book.reserve" type="button" class="green_button" @click="return_book(book)">已預約 還書</button> -->
                                    <button type="button" @click="show_update_modal(post)" class="green_button" >修改</button>
                                    <button type="button" @click="delete_post(post)" class="red_button">刪除</button>
                                    <!-- <b-icon  v-if="!book.collect" @click="add_to_collect(book)" icon="heart" class="collect_heart"></b-icon>
                                    <b-icon  v-if="book.collect" @click="add_to_collect(book)" icon="heart-fill" class="collect_heart"></b-icon> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-col>

        <b-modal
            size="xl"
            v-model="showDetailModal"
            content-class="detail-modal"
        >
            <b-row>
                <b-col lg="1" />
                <b-col lg="10">
                    <h4 class="text-wrapper">
                        {{ item.content }}
                    </h4>
                </b-col>
                <b-col lg="1" />
            </b-row>
            <template #modal-header>
                <h2>{{ item.title }}</h2>
            </template>
            <template #modal-footer>
                <p class="modal-title">{{ item.time }}</p>
                <button @click="show_update_modal(item)" type="button" class="green_button" >修改</button>
                <button @click="delete_post(item)" type="button" class="red_button">刪除</button>
            </template>
        </b-modal>

        <b-modal
            size="lg"
            v-model="showUpdateModal"
            content-class="detail-modal"
            hide-footer
        >
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="標題:"
                    label-for="input-1"
                >
                    <b-form-input
                    id="input-1"
                    v-model="updateTitle"
                    type="text"
                    placeholder="公告標題"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="內容:" label-for="input-2">
                    <b-form-textarea
                        id="input-2"
                        placeholder="公告內容"
                        v-model="updateContent"
                        rows="10"
                        max-rows="15"
                    ></b-form-textarea>
                </b-form-group>
                <b-button @click.prevent="update_post(item)">儲存公告</b-button>
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
                    label="標題:"
                    label-for="input-1"
                    :state="titleState"
                    :invalid-feedback="invalidFeedback"
                >
                    <b-form-input
                    id="input-1"
                    v-model="newTitle"
                    type="text"
                    placeholder="公告標題"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-2"
                    label="內容:"
                    label-for="input-2"
                    :state="contentState"
                    :invalid-feedback="invalidFeedback"
                >
                    <b-form-textarea
                        id="input-2"
                        placeholder="公告內容"
                        v-model="newContent"
                        rows="10"
                        max-rows="15"
                    ></b-form-textarea>
                </b-form-group>
                <b-button @click.prevent="insert_post(item)">儲存公告</b-button>
            </b-form>
        </b-modal>

	</div>
</template>

<script>
import BtnSwitch from '../buttons/BtnSwitch.vue';

export default {
    computed: {
        contentState(){
            return this.newContent.length >= 5;
        },
        titleState(){
            return this.newTitle.length >= 5;
        },
        invalidFeedback() {
            if (this.newContent.length >= 0 ) {
                return '請至少輸入5個字'
            }
        },

    },
    data: () => {
        return {
            posts : [],
            item: "",
            showDetailModal: false,
            showInsertModal: false,
            showUpdateModal: false,
            item: '',
            title: "",
            content: "",
            time: "",
            updateTitle: "",
            updateContent: "",
            updateTime: "",
            searchText: "",
            nowTime: "",
            newTitle: "",
            newContent: "",
        };
    },
    created() {
        this.reset();
    },
    methods: {
        show_detail_modal(item) {
            this.item = item;
            this.showDetailModal = true;
        },
        show_update_modal(item) {
            this.item = item;
            this.showUpdateModal = true;
            this.showDetailModal = false;
            this.updateTitle = item.title;
            this.updateContent = item.content;
        },
        show_insert_modal() {
            this.showInsertModal = true;
        },
        insert_post(){
            if(!this.titleState || !this.contentState)
            {
                alert('請至少輸入5個字！');
                return;
            }
            this.getCurrentTime();
            let toastBody = "已成功新增公告";
            let data = {
                title: this.newTitle,
                content: this.newContent,
                time: this.nowTime,
            };
            this.$http
                .post("/api/posts/insert_post", {data:data})
                .then(res => {
                    if(res.status === 202){
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
        update_post() {
            this.getCurrentTime();
            // var reg = new RegExp("\r\n","g");
            // this.updateContent = this.updateContent.replaceAll(/\r\n|\n|\r|\t/g, "<br>");
            // this.updateContent = this.updateContent.replaceAll(/\n/g, "<br>");
            console.log(this.updateContent);
            let toastBody = "已成功修改公告";
            let data = {
                title: this.updateTitle,
                content: this.updateContent,
                time: this.nowTime,
                id: this.item.id
            };
            this.$http
                .post("/api/posts/update_post", {data:data})
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
        delete_post(item) {
            if (confirm("確認刪除此公告嗎?")) {
                let data = {
                    id: item.id
                };
                this.$http
                    .post("/api/posts/delete_post", { data: data })
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
        getCurrentTime() {
            //获取当前时间并打印
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth()+1;
            let dd = new Date().getDate();
            let hh = new Date().getHours();
            let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
            let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
            this.nowTime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
            // console.log(this.nowTime)
        },
        search(){
            this.posts = [];
            let data = {
                search: this.searchText,
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
        reset() {
            this.showInsertModal = false;
            this.showUpdateModal = false;
            this.showDetailModal = false;
            this.posts = [];
            this.updateTitle = "";
            this.updateContent = "";
            this.newTitle = "";
            this.newContent = "";
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
                        // result.content = result.content.replaceAll(/<br>/g, "\n");
                        this.posts.push(result);
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
    .post{
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
