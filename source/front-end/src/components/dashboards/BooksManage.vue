<template>
	<div>
        <b-col>
            <b-row class="search-bar justify-content-center" align-v="center">
                <b-col class="col-lg-6 col-9">
                    <div class="input-group align-items-center">
                        <p style="margin-bottom: 0 ;margin-right: 1vw; font-size: 18px; font-weight: 600; color: #3F7CAC">藏書設定</p>
                        <b-form-group class="col-6" style="margin:auto">
                            <b-form-input
                                type="search"
                                class="form-control rounded"
                                placeholder="Search"
                                v-model="searchText"
                                @update="search()" />
                        </b-form-group>
                        <button type="button" class="btn" style="margin-top: 0vw; height:80%" @click="search()">查詢</button>
                        <button type="button" class="btn"  style="margin-top: 0vw; height:80%; background: #4DA167;" @click="show_insert_modal">新增書本</button>
                    </div>
                </b-col>
            </b-row>
            <b-row class="justify-content-center" style="margin-top: 1vw;">
                <b-col class="col-10">
                    <table class="table table-hover table-striped" style="table-layout: fixed; ">
                        <thead style="background: #3F7CAC;">
                            <tr style="color:#fff;">
                                <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px;width: 30%;">書名</th>
                                <th scope="col" style="width: 20%;">作者</th>
                                <th scope="col" style="width: 20%;">出版社</th>
                                <th scope="col" style="width: 10%;">索書號</th>
                                <th scope="col" style="border-top-right-radius: 10px; width: 25%;"></th>
                            </tr>
                        </thead>
                        <tbody class="books">
                            <tr v-for="(book, index) in books" :key="index">
                                <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                <th scope="row" @click="show_detail_modal(book)">{{book.name}}</th>
                                <!-- </router-link> -->
                                <td>{{book.author}}</td>
                                <td>{{book.publish}}</td>
                                <td>{{book.callnumber}}</td>
                                <td style="float: right">
                                    <!-- <button v-if="book.borrow && book.reserve" type="button" class="green_button" @click="return_book(book)">已預約 還書</button> -->
                                    <button type="button" class="green_button" @click="show_update_modal(book)">修改</button>
                                    <button v-if="book.borrow === 0 && book.reserve === 0" type="button" class="red_button" @click="delete_book(book)">刪除</button>
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
            size="lg"
            v-model="showDetailModal"
            content-class="detail-modal"
        >
            <b-row style="color: #fff">
                <b-col lg="4">
                    <img :src="`${item.imgpath}`" style="max-width: 100%">
                </b-col>
                <!-- <img src="../../assets/img/ato.jpg"> -->
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
                <!-- <b-icon  v-if="!collect" @click="add_to_collect(item) , showDetailModal = false" icon="heart" class="collect_heart"></b-icon>
                <b-icon  v-if="collect" @click="add_to_collect(item), showDetailModal = false" icon="heart-fill" class="collect_heart"></b-icon> -->
                <button type="button" class="green_button" @click="show_update_modal(item)">修改</button>
                <button v-if="item.borrow === 0 && item.reserve === 0" type="button" class="red_button" @click="delete_book(item)">刪除</button>

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
                    label="書名:"
                    label-for="input-1"
                >
                    <b-form-input
                    id="input-1"
                    v-model="updateForm.name"
                    type="text"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="作者:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="updateForm.author"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-3"
                    label="出版社:"
                    label-for="input-3"
                >
                    <b-form-input
                    id="input-3"
                    v-model="updateForm.publish"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="索書號:"
                    label-for="input-4"
                >
                    <b-form-input
                    id="input-4"
                    v-model="updateForm.callnumber"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-button @click.prevent="update_book()" variant="primary">確認修改書本</b-button>
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
                    label="書名:"
                    label-for="input-1"
                >
                    <b-form-input
                    id="input-1"
                    v-model="insertForm.name"
                    type="text"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="作者:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="insertForm.author"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-3"
                    label="出版社:"
                    label-for="input-3"
                >
                    <b-form-input
                    id="input-3"
                    v-model="insertForm.publish"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-4"
                    label="索書號:"
                    label-for="input-4"
                >
                    <b-form-input
                    id="input-4"
                    v-model="insertForm.callnumber"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-file
                    v-model="file1"
                    :state="Boolean(file1)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                ></b-form-file>
                <b-button @click.prevent="insert_book()" variant="primary">確認新增書本</b-button>
            </b-form>
        </b-modal>

	</div>
</template>

<script>
import BtnSwitch from '../buttons/BtnSwitch.vue';

export default {
    computed: {
        nameState(){
            return this.insertForm.name.length > 0;
        },
        callnumberState(){
            return this.insertForm.callnumber.length > 0;
        },
        invalidFeedback() {
            if (this.newContent.length >= 0 ) {
                return '請至少輸入5個字'
            }
        },

    },
    data: () => {
        return {
            books : [],
            item: "",
            showDetailModal: false,
            showInsertModal: false,
            showUpdateModal: false,
            bookName: '',
            bookAuthor: '',
            bookPublish: '',
            callnumber: '',
            item: '',
            searchText: "",
            file1: '',
            options: [
                { value: 'book_name', text: '書名' },
                { value: 'book_author', text: '作家' },
                { value: 'book_publish', text: '出版社' },
            ],
            updateForm: {
                name: '',
                author: '',
                publish: '',
                callnumber: '',
            },
            insertForm: {
                name: '',
                author: '',
                publish: '',
                callnumber: '',
            },
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

            this.updateForm.name = item.name;
            this.updateForm.author = item.author;
            this.updateForm.publish = item.publish;
            this.updateForm.callnumber = item.callnumber;
        },
        show_insert_modal() {
            this.showInsertModal = true;
        },
        insert_book(){
            if(this.insertForm.name.length === 0 || this.insertForm.callnumber.length === 0)
            {
                alert('不可為空');
                return;
            }
            let toastBody = "已成功新增書籍";
            let data = {
                name: this.insertForm.name,
                author: this.insertForm.author,
                publish: this.insertForm.publish,
                callnumber: this.insertForm.callnumber,
            };
            this.$http
                .post("/api/books/insert_book", {data:data})
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
        update_book() {
            if(this.updateForm.name.length === 0 || this.updateForm.callnumber.length === 0)
            {
                alert('不可為空');
                return;
            }
            let toastBody = "已成功修改書籍";
            let data = {
                name: this.updateForm.name,
                author: this.updateForm.author,
                publish: this.updateForm.publish,
                callnumber: this.updateForm.callnumber,
                id: this.item.id,
            };
            this.$http
                .post("/api/books/update_book", {data:data})
                .then(res => {
                    if(res.status === 201){
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
        delete_book(item) {
            if (confirm("確認刪除此書嗎?")) {
                let data = {
                    id: item.id
                };
                this.$http
                    .post("/api/books/delete_book", { data: data })
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
            this.books = [];
            let data = {
                search: this.searchText,
            };
            this.$http
                .post('/api/books/search_all', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.books.push(result);
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
            this.books = [];
            // this.updateTitle = "";
            // this.updateContent = "";
            // this.newTitle = "";
            // this.newContent = "";
            this.$http
                .get('/api/books/show_all_books')
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        // result.content = result.content.replaceAll(/<br>/g, "\n");
                        this.books.push(result);
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
    .books{
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
