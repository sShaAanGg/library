<template>
    <div >
        <b-row class="search-bar justify-content-center" align-v="center">
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
                    <b-form-group class="col-8">
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
                <b-tabs content-class="mt-3" v-model="tabIndex" @input="search()">
                    <b-tab title="借閱書籍">
                        <table class="table table-hover table-striped">
                            <thead style="background: #3F7CAC">
                                <tr style="color:#fff;">
                                    <th scope="col" style="border-top-left-radius: 10px; border-bottom-left-radius: 0px;width: 30%;">書名</th>
                                    <th scope="col" style="width: 15%;">作者</th>
                                    <th scope="col" style="width: 20%;">出版社</th>
                                    <th scope="col" style="width: 10%;">索書號</th>
                                    <th scope="col" style="border-top-right-radius: 10px; width: 30%;"></th>
                                </tr>
                            </thead>
                            <tbody class="books">
                                <tr v-for="(book, index) in borrowBooks" :key="index">
                                    <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                    <th scope="row" @click="book_Info(book)">{{book.name}}</th>
                                    <!-- </router-link> -->
                                    <td>{{book.author}}</td>
                                    <td>{{book.publish}}</td>
                                    <td>{{book.callnumber}}</td>
                                    <td style="float: right">
                                        <p style="float: right">剩餘天數：{{book.time_end}}</p>
                                        <button type="button" class="green_button" @click="return_book(book)">還書</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                    <b-tab title="預約書籍">
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
                                <tr v-for="(book, index) in reserveBooks" :key="index">
                                    <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                    <th scope="row" @click="book_Info(book)">{{book.name}}</th>
                                    <!-- </router-link> -->
                                    <td>{{book.author}}</td>
                                    <td>{{book.publish}}</td>
                                    <td>{{book.callnumber}}</td>
                                    <td style="float: right">
                                        <p style="float: left">目前順序： {{book.number}}</p>
                                        <button type="button" class="blue_button" @click="cancel_reserve(book)">取消預約</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                    <b-tab title="收藏書籍">
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
                                <tr v-for="(book, index) in collectBooks" :key="index">
                                    <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                    <th scope="row" @click="book_Info(book)">{{book.name}}</th>
                                    <!-- </router-link> -->
                                    <td>{{book.author}}</td>
                                    <td>{{book.publish}}</td>
                                    <td>{{book.callnumber}}</td>
                                    <td style="float: right">
                                        <button v-if="!book.borrow" type="button" class="green_button">借閱</button>
                                        <button  v-if="book.borrow" type="button" class="blue_button" @click="reserve_book(book)">預約</button>
                                        <button type="button" @click="remove_from_collect(book)" class="red_button">取消收藏</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                    <b-tab title="歷史紀錄">
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
                                <tr v-for="(book, index) in historyBooks" :key="index">
                                    <!-- <router-link :to="{path: `/book-info/${index}`, query: {id:book.id}}"> -->
                                    <th scope="row" @click="book_Info(book)">{{book.name}}</th>
                                    <!-- </router-link> -->
                                    <td>{{book.author}}</td>
                                    <td>{{book.publish}}</td>
                                    <td>{{book.callnumber}}</td>
                                    <td style="float: right">
                                        <button v-if="!book.borrow" type="button" class="green_button" @click="borrow_book(book)">再借一次</button>
                                        <button  v-if="book.borrow" type="button" class="blue_button" @click="reserve_book(book)">預約</button>
                                        <!-- <b-icon  v-if="!book.collect" @click="add_to_collect(book)" icon="heart" class="collect_heart"></b-icon>
                                        <b-icon  v-if="book.collect" @click="add_to_collect(book)" icon="heart-fill" class="collect_heart"></b-icon> -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                </b-tabs>
            </div>
        </div>

        <b-modal
            size="lg"
            v-model="showDetailModal"
            content-class="my-modal"
            hide-footer
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
		</b-modal>
    </div>
</template>

<script>


    export default {
        data() {
            return {
                showDetailModal: false,
                collectBooks: [],
                collectArray: [],
                borrowBooks: [],
                historyBooks: [],
                reserveBooks: [],
                allbooks: [],
                item: '',
                bookName: '',
                bookAuthor: '',
                bookPublish: '',
                callnumber: '',
                imgPath: '',
                collect: '',
                id: '',
                searchText: '',
                searchSelect: 'book_name',
                tabIndex: 0,
                gettime: '',
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
                let array = [];
                let data = {
                    account: sessionStorage.getItem('ACCOUNT')
                };
                this.$http
                .post('/api/books/show_collect_books', {data:data})
                .then(res => {

                    if(res.data.length === 0){
                        return;
                    }

                    this.collectArray = res.data[0].collect_books.split(",");
                    for(let i = 0; i < this.collectArray.length; i++){
                        this.allBooks.find(item => {
                                if(item.id.toString() === this.collectArray[i]){
                                    this.collectBooks.push(item);
                                }
                        });
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
                })
            },
            show_borrow_books(){
                this.borrowBooks = [];
                let nowTime = new Date();
                let data = {
                    account: sessionStorage.getItem('ACCOUNT')
                };
                this.$http
                .post('/api/books/show_borrow_books', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        result.time_end = new Date(result.time_end);
                        result.time_end = (Math.ceil((result.time_end - nowTime) / (1000*3600*24)));

                        // if(result.time_end < 0){
                        //     this.return_book(result);
                        // }

                        this.borrowBooks.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
                })
            },
            show_history_books(){
                this.historyBooks = [];
                let data = {
                    account: sessionStorage.getItem('ACCOUNT')
                };
                this.$http
                .post('/api/books/show_history_books', {data:data})
                .then(res => {
                    for (let i = 0 ; i < res.data.length ; ++i){
                        var result = res.data[i];
                        this.historyBooks.push(result);
                    }
                })
                .catch(err => {
                    alert('發生錯誤');
                    console.log(err);
                });
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
            book_Info(item) {
                // this.bookName = item.name;
                // this.bookAuthor = item.author;
                // this.bookPublish = item.publish;
                // this.callnumber = item.callnumber;
                // this.imgPath = item.imgpath;
                // this.collect = item.collect;
                this.item = item;
                this.showDetailModal = true;
            },
            // add_to_collect(item) {
            //     let co = 1;
            //     let toastBody = "已加入收藏";
            //     if(item.collect == 1){
            //         toastBody = "已取消收藏";
            //     }

            //     let data = {
            //         collect: co,
            //         id: item.id,
            //     };
            //     this.$http
            //         .patch('/api/books/add_to_collect', {data:data})
            //         .then(res => {
            //             if(res.status === 201)
            //             {
            //                 this.show_books();
            //                 this.$bvToast.toast(toastBody, {
            //                     title: item.name,
            //                     solid: true,
            //                     variant: 'success',
            //                     autoHideDelay: 300,
            //                 });
            //             }
            //             else
            //             {
            //                 alert('傳入值出現非預期狀況');
            //             }
            //         })
            //         .catch(err => {
            //             alert('發生錯誤');
            //             console.log(err);
            //         })
            // },
            borrow_book(item) {
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
                // console.log(data.time_start, data.time_end);
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
                let toastBody = "已預約";
                let reserved = false;
                let number = 0;
                let data = {
                    id: item.id,
                    account: sessionStorage.getItem('ACCOUNT'),
                    number: item.reserve
                }
                for (let i = 0 ; i < this.reserveBooks.length ; ++i){

                    if(this.reserveBooks[i].book_id === item.id){
                        reserved = true;
                        number = this.reserveBooks[i].number;
                    }

                }

                if(reserved){
                    alert('已經預約了! 序號：' + number);
                    reserved = false;
                    return;
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
            cancel_reserve(item) {
                let toastBody = "已取消預約";
                console.log(item);
                let data = {
                    id: item.book_id,
                    account: sessionStorage.getItem('ACCOUNT'),
                    number: item.number
                }

                this.$http
                    .patch('/api/books/cancel_reserve', {data:data})
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
            return_book(item) {
                let toastBody = "已還書";
                let start = this.getCurrentTime(new Date());
                let end = new Date(start);
                end = new Date(end.setDate((end.getDate() + 14)));
                end = this.getCurrentTime(end);
                let data = {
                    id: item.book_id,
                    account: sessionStorage.getItem('ACCOUNT')
                };
                this.$http
                    .patch('/api/books/return_books', {data:data})
                    .then(res => {

                        if(res.status === 201){
                            this.show_books();
                            this.$bvToast.toast(toastBody, {
                                title: item.name,
                                solid: true,
                                variant: 'success',
                                autoHideDelay: 300,
                            });

                        } else {
                            alert('傳入值出現非預期狀況');
                        }

                    })
                    .catch(err => {
                        alert('發生錯誤');
                        console.log(err);
                    });
                let toBorrowdata = {
                    id: item.book_id,
                    account: sessionStorage.getItem('ACCOUNT'),
                    time_start: start,
                    time_end: end,
                };
                if(item.reserve > 0){
                    this.$http
                    .patch('/api/books/reserve_to_borrow', {data:toBorrowdata})
                    .then(res => {

                        if(res.status === 201)
                        {
                            this.show_books();
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
                }

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
                    this.show_collect_books();
                    this.show_borrow_books();
                    this.show_reserve_books();
                    this.show_history_books();
                    return;
                }
                if(this.tabIndex === 0)
                {
                    this.borrowBooks = [];
                    if(this.searchSelect === 'book_name')
                    {
                        this.borrowBooks = this.search_by_name();
                    }
                    else if(this.searchSelect === 'book_author')
                    {
                        this.borrowBooks = this.search_by_author();
                    }
                    else
                    {
                        this.borrowBooks = this.search_by_publish();
                    }
                }
                else if (this.tabIndex === 1)
                {
                    this.reserveBooks = [];
                    if(this.searchSelect === 'book_name')
                    {
                        this.reserveBooks = this.search_by_name();
                    }
                    else if(this.searchSelect === 'book_author')
                    {
                        this.reserveBooks = this.search_by_author();
                    }
                    else
                    {
                        this.reserveBooks = this.search_by_publish();
                    }
                }
                else if (this.tabIndex === 2)
                {
                    this.collectBooks = [];
                    if(this.searchSelect === 'book_name')
                    {
                        this.collectBooks = this.search_by_name();
                    }
                    else if(this.searchSelect === 'book_author')
                    {
                        this.collectBooks = this.search_by_author();
                    }
                    else
                    {
                        this.collectBooks = this.search_by_publish();
                    }
                }
                else
                {
                    this.historyBooks = [];
                    if(this.searchSelect === 'book_name')
                    {
                        this.historyBooks = this.search_by_name();
                    }
                    else if(this.searchSelect === 'book_author')
                    {
                        this.historyBooks = this.search_by_author();
                    }
                    else
                    {
                        this.historyBooks = this.search_by_publish();
                    }
                }
            },
            remove_from_collect(item) {
                let index = this.collectArray.indexOf(item.id.toString());
                let array = '';
                this.collectArray.splice(index, 1);
                let toastBody = "已取消收藏";
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
            show_books(){
                this.borrowBooks = [];
                this.historyBooks = [];
                this.reserveBooks = [];
                this.show_all_books();
                this.show_borrow_books();
                this.show_history_books();
                this.show_reserve_books();
                this.show_collect_books();
            },
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
        color: #FFFFFF;
        font-size: auto;
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

    a{
        color: #000;
    }

    .my-modal{
        background: #435767;
    }

    .collect_heart{
        color: #B02E0C;
        margin-left: 0.5vw;
    }

</style>
