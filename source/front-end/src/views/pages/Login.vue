<template>
    <CContainer class="d-flex align-items-center min-vh-100">
        <CRow class="justify-content-center">
            <CCol lg = '12'>
                <CCardGroup>
                    <CCard
                        color="info"
                        text-color="white"
                        class="text-center py-2"
                        style="width:100%"
                    >
                        <CCardBody>
                            <h2 class="pt-4">富鐿實業報工系統</h2>
                            <CRow class="pt-4">
                                <CCol>
                                    <CImg src="img/brand/scanna_index.png" fluid class="mb-2" />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <CCard class="p-5">
                        <CCardBody>
                            <CForm>
                                <h1>登入</h1>
                                <p class="text-muted">請輸入帳號密碼</p>
                                <CInput type="text" placeholder="帳號" v-model="account" list="account_list">
                                    <template #prepend-content><CIcon name="cil-user"/></template>
                                </CInput>
                                <CInput placeholder="密碼" type="password" v-model="password" @keyup.enter.native="login">
                                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                                </CInput>
                                <CRow>
                                    <CCol col="6">
                                        <CButton color="link" class="px-0" @click="showAlert">忘記密碼?</CButton>
                                    </CCol>
                                    <CCol col="6" class="text-right">
                                        <CButton color="info" class="px-4" @click="login">登入</CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCardGroup>
            </CCol>
        </CRow>
    </CContainer>
</template>

<script>
export default {
    data()  {
        return {
            account: '',
            password: '',
            protection:true
        }
    },
    created(){
        sessionStorage.setItem('ACCOUNT', '');
        sessionStorage.setItem('ROLE', '')
        sessionStorage.setItem('NAME', '')

        sessionStorage.setItem('CLASS', '')

        this.account    = ''
        this.password   = ''
        this.protection    = true
    },
    methods:{
        login(){
            if (this.protection){
                this.protection = false

                let data = {
                    account:this.account,
                    password:this.password
                }
                this.$http
                    .post('/api/accounts/login',{data:data})
                    .then(res => {
                        if (res.status !== 200){
                            alert("回傳值出現非預期狀況，請確認後再進行操作!");
                            return;
                        }
                        var result = res.data[0];
                        if (result){
                            sessionStorage.setItem('ACCOUNT', this.account);
                            sessionStorage.setItem('ROLE', result.role);
                            sessionStorage.setItem('DEPT', result.dept);
                            sessionStorage.setItem('NAME', result.name);

                            let role = sessionStorage.getItem('ROLE');

                            if(role === 'admin' || role === 'user' || role === 'guest'){
                                this.$router.push('/production-reoprter');
                            } else {
                                alert('帳號權限有問題，請聯繫系統管理員!!!');
                            }
                        } else {
                            sessionStorage.setItem('ACCOUNT', '');
                            sessionStorage.setItem('ROLE', '');
                            sessionStorage.setItem('DEPT', '');
                            sessionStorage.setItem('NAME', '');
                            this.password = '';
                            alert('密碼不正確!!!');
                        }
                        this.protection = true
                    })
                    .catch(err => { console.log(err.response.data.message) })
            }
        },
        showAlert(){
            alert('請聯繫系統管理員!!!');
        }
    }
}
</script>

<style>

</style>
