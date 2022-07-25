<template>
    <div >
        <b-row class="search-bar justify-content-center" align-v="center">
            <b-col lg="auto">
                <h3 style="color:black;">館藏查詢</h3>
            </b-col>
            <b-col class="col-2" lg="auto" style="margin-top: 0;">
                <b-form-select
                    class="form-select select"
                    aria-label="Default select example"
                    v-model="searchSelect"
                    :options="options"
                    @input="search()">
                </b-form-select>
            </b-col>
            <b-col class="col-lg-6 col-9">
                <div class="input-group">
                    <b-form-group class="col-8" style="margin-top:auto; margin-bottom:auto;">
                        <b-form-input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            v-model="searchText"
                            @update="search()" />
                    </b-form-group>
                    <button type="button" class="btn" style="margin-top: 0vw; height:80%" @click="search()">查詢</button>
                </div>
            </b-col>
        </b-row>
        <div>
            <div>
                <table class="table table-hover table-striped">
                    <thead style="background: #3F7CAC">
                        <tr style="color:#fff;">
                            <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px;width: 30%;">書名</th>
                            <th scope="col" style="width: 20%;">作者</th>
                            <th scope="col" style="width: 20%;">出版社</th>
                            <th scope="col" style="width: 10%;">索書號</th>
                            <th scope="col" style="border-top-right-radius: 10px; width: 25%;"></th>
                        </tr>
                    </thead>
                    <tbody class="books">
                        <tr v-for="(book, index) in allBooks" :key="index">
                            <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                            <th scope="row" @click="book_Info(book)">{{book.name}}</th>
                            <!-- </router-link> -->
                            <td>{{book.author}}</td>
                            <td>{{book.publish}}</td>
                            <td>{{book.callnumber}}</td>
                            <td style="float: right">
                                <button v-if="!book.borrow" type="button" class="blue_button" @click="borrow_book(book)">借閱</button>
                                <button v-else-if="book.borrow" type="button" class="green_button" @click="reserve_book(book)">預約</button>
                                <button  @click="add_to_collect(book)" type="button" class="red_button">收藏</button>
                                <!-- <b-icon  v-if="book.collect" @click="add_to_collect(book)" icon="heart-fill" class="collect_heart"></b-icon> -->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <b-modal
            size="lg"
            v-model="showDetailModal"
            content-class="my-modal"
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
                <Button v-if="item.borrow"  @click="reserve_book(item)" class="green_button">預約</Button>
                <Button v-if="!item.borrow" @click="borrow_book(item)" class="blue_button">借閱</Button>
            </template>
		</b-modal>
    </div>
</template>

<script>
import { flagSet } from '@coreui/icons';



    export default {
        data() {
            return {
                showDetailModal: false,
                allBooks: [],
                reserveBooks: [],
                collectArray: [],
                item: '',
                bookName: '',
                bookAuthor: '',
                bookPublish: '',
                callnumber: '',
                imgPath: '',
                collect: '',
                id: '',
                gettime: '',
                searchText: '',
                searchSelect: 'book_name',
                tabIndex: 0,
                reserved: false,
                options: [
                    { value: 'book_name', text: '書名' },
                    { value: 'book_author', text: '作家' },
                    { value: 'book_publish', text: '出版社' },
                ]
            };
        },
        created() { //enter the page
            this.show_books();
	    },
        methods: {
            getCurrentTime(time) {
                //获取当前时间并打印
                let yy = time.getFullYear();
                let mm = time.getMonth()+1;
                let dd = time.getDate();
                let hh = time.getHours();
                let mf = time.getMinutes()<10 ? '0'+ time.getMinutes() : time.getMinutes();
                let ss = time.getSeconds()<10 ? '0'+ time.getSeconds() : time.getSeconds();
                return yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;
                // console.log(this.gettime)
            },
            show_all_books(){
                this.allBooks = [];
                this.$http
                .get('/api/books/show_all_books')
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.allBooks.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
                })
            },
            show_collect_books(){
                this.collectBooks = [];
                this.collectArray = [];

                if(sessionStorage.getItem('ROLE') !== 'guest'){
                    let data = {
                        account: sessionStorage.getItem('ACCOUNT')
                    };
                    this.$http
                    .post('/api/books/show_collect_books', {data:data})
                    .then(res => {

                        if(res.data.length !== 0){
                            return;
                        }

                        this.collectArray = res.data[0].collect_books.split(",");
                        // console.log(this.collectArray);
                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                    })
                }

            },
            show_reserve_books() {
                this.reserveBooks = [];
                let data = {
                    account: sessionStorage.getItem('ACCOUNT')
                };
                this.$http
                .post('/api/books/show_reserve_books', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.reserveBooks.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
                });
            },
            add_to_collect(item) {
                let array = '';
                let toastBody = '';

                if(this.collectArray.indexOf(item.id.toString()) === -1)
                {
                    this.collectArray.push(item.id.toString());
                    toastBody = "已加入收藏";
                }
                else
                {
                    let index = this.collectArray.indexOf(item.id.toString());
                    this.collectArray.splice(index, 1);
                    toastBody = "已取消收藏";
                }
                console.log(this.collectArray);
                for(let i = 0; i < this.collectArray.length; ++i){
                    array += this.collectArray[i].toString();

                    if(i < this.collectArray.length - 1){
                        array += ',';
                    }

                }
                // console.log(array);
                let data = {
                    collect: array,
                    account: sessionStorage.getItem('ACCOUNT'),
                };
                console.log();
                this.$http
                    .patch('/api/books/add_to_collect', {data:data})
                    .then(res => {
                        if(res.status === 201)
                        {
                            this.show_books();
                            this.$bvToast.toast(toastBody, {
                                title: item.name,
                                solid: true,
                                variant: 'success',
                                autoHideDelay: 300,
                            });
                        }
                        else
                        {
                            alert('傳入值出現非預期狀況');
                        }
                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                    })
            },
            book_Info(item) {
                this.item = item;
                this.showDetailModal = true;
            },
            borrow_book(item) {
                // this.getCurrentTime();
                let start = this.getCurrentTime(new Date());
                if(sessionStorage.getItem('AUTH') != 'true'){
                    alert('請先登入！');
                    return;
                }
                let toastBody = "已借閱";
                let end = new Date(start);
                end = new Date(end.setDate((end.getDate() + 14)));
                end = this.getCurrentTime(end);
                let data = {
                    id: item.id,
                    account: sessionStorage.getItem('ACCOUNT'),
                    time_start: start,
                    time_end: end,
                }
                // console.log(data.time_start,'+', data.time_end);

                this.$http
                    .patch('/api/books/borrow_books', {data:data})
                    .then(res => {

                        if(res.status === 201)
                        {
                            this.show_books();
                            this.$bvToast.toast(toastBody, {
                                title: item.name,
                                solid: true,
                                variant: 'success',
                                autoHideDelay: 300,
                            });
                        }
                        else
                        {
                            alert('傳入值出現非預期狀況');
                        }

                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                    });
            },
            reserve_book(item) {
                let number = 0;

                if(sessionStorage.getItem('AUTH') != 'true'){
                    alert('請先登入！');
                    return;
                }
                this.show_reserve_books();

                for (let i = 0 ; i < this.reserveBooks.length ; ++i){
                    if(this.reserveBooks[i].book_id === item.id){
                        this.reserved = true;
                        number = this.reserveBooks[i].number;
                    }
                }


                if(this.reserved){
                    alert('已經預約了! 序號：' + number);
                    this.reserved = false;
                    return;
                }

                let toastBody = "已預約";
                let data = {
                    id: item.id,
                    account: sessionStorage.getItem('ACCOUNT'),
                    number: item.reserve
                }
                this.$http
                    .patch('/api/books/reserve_books', {data:data})
                    .then(res => {

                        if(res.status === 201)
                        {
                            this.show_books();
                            this.$bvToast.toast(toastBody, {
                                title: item.name,
                                solid: true,
                                variant: 'success',
                                autoHideDelay: 300,
                            });
                        }
                        else
                        {
                            alert('傳入值出現非預期狀況');
                        }

                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err.message);
                    });
            },
            search_by_name() {
                let books = [];
                let data = {
                    name: this.searchText,
                };
                this.$http
                    .post('/api/books/search_by_name', {data:data})
                    .then(res => {
                        for (let i = 0 ; i < res.data.length ; ++i){
                            var result = res.data[i];
                            books.push(result);
                        }
                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                });
                return books;
            },
            search_by_author() {
                let books = [];
                let data = {
                    author: this.searchText,
                };
                this.$http
                    .post('/api/books/search_by_author', {data:data})
                    .then(res => {
                        for (let i = 0 ; i < res.data.length ; ++i){
                            var result = res.data[i];
                            books.push(result);
                        }
                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                });
                return books;
            },
            search_by_publish() {
                let books = [];
                let data = {
                    publish: this.searchText,
                };
                this.$http
                    .post('/api/books/search_by_publish', {data:data})
                    .then(res => {
                        for (let i = 0 ; i < res.data.length ; ++i){
                            var result = res.data[i];
                            books.push(result);
                        }
                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                });
                return books;
            },
            search() {

                if(this.searchText === '')
                {
                    this.show_books();
                    return;
                }

                this.allBooks = [];

                if(this.searchSelect === 'book_name')
                {
                    this.allBooks = this.search_by_name();
                }
                else if(this.searchSelect === 'book_author')
                {
                    this.allBooks = this.search_by_author();
                }
                else
                {
                    this.allBooks = this.search_by_publish();
                }

            },
            show_books(){
                this.show_all_books();
                this.show_reserve_books();
                this.show_collect_books();
            }
        }
    }
</script>

<style scope>

    div{
        font-size: 1.5vw;
    }

    .books{
        background: #70aee1;
        border-color:#3F7CAC;
        border-top-color: #3F7CAC;
    }

    /*第一欄最後列：左下*/
    tr:last-child th:first-child{
        border-bottom-left-radius: 10px;
    }

    /*最後欄第一列：右下*/
    tr:last-child td:last-child{
        border-bottom-right-radius: 10px;
    }

    .books.table th .books.table td{
        border-top-color:#3F7CAC;
    }

    table.table.table-hover{
        color: #000;
    }
    button{
        margin-left: 1vw;
    }

    button.btn {
        background: #47ABF7;
        color: #FFF;

    }
    .btn:hover{
        color:#000
    }

    .search-bar{
        margin: 1vw;
    }

    .select{
        background: #3F7CAC;
        border-radius: 8px;
        font-weight: 400;
        font-size: 1rem;
        color: #FFFFFF;
    }

    .green_button{
        background: #4DA167;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
    }
    .blue_button{
        background: #3F7CAC;
        border-radius: 8px;
        border: none;
        color: #FFF;
        width: fit-content;
        height: 2vw;
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

    /* a{
        color: #47ABF7;
    } */

    .my-modal{
        background: #435767;
    }

    .collect_heart{
        color: #B02E0C;
        margin-left: 0.5vw;
    }

</style>
