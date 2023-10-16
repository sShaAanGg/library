<template>
    <h6> {{btnName}}
        <CButton
            show:false
            :class="btnSwitch.btnClass"
            size='sm'
            @click="set_switch()"
        >
            {{ btnText }}
        </CButton>
    </h6>
</template>

<script>
export default {
    props:['btnName', 'btnType', 'btnMac', 'btnPort', 'btnPin' , 'btnStatus', 'btnSwitch'],
    data() {
        return {
            mac: this.btnMac,
            isAlive: true,
            btnCheck:true,
            btnText: '',
            data: {
                btnMac:this.btnMac,
                btnPort:this.btnPort,
                btnPin:this.btnPin,
                btnCommand:''
            },
        }
    },
    created() {
        // turn on ths switch at initial state
        this.btnText = 'OFF';   // then command will be set to 1
        this.set_switch();
    },
    mounted() {
    },
    beforeUpdate() {
        this.btnText = this.btnSwitch.btnText;
        if (this.btnStatus == 2){
            this.btnText = 'KO';
            // alert("控制開關出現問題，請洽管理員!!!");
            return;
        }
    },
    methods: {
        set_switch() {
            if (this.btnCheck == false){
                console.log('btnCheck false');
                return;
            }

            this.btnCheck = false;
            this.data.btnCommand = (this.btnText === 'ON') ? 0 : 1;
            this.$http
                .post('/api/enms/update_btn_swicth', {data : this.data})
                .then((res) => {
                    // console.log(res);
                    if( res.data === 'KO') {
                        // alert("開關操作出現問題，請洽管理員!!!");
                    }
                    this.btnText = res.data;
                    this.btnCheck = true;
                })
                .catch((error) => console.log(error));
        },
    },

}

</script>

<style scoped>
.btn-switch-on {
    color: green;
    padding-bottom:10px;
    width: 80px;

    border-top:2px green solid;
    border-left:2px green solid;
    border-right:2px green solid;
    border-bottom: 2px green solid;
}
.btn-switch-off {
    color: #4F4F4F;
    padding-bottom:10px;
    width: 80px;

    border-top:2px #4F4F4F solid;
    border-left:2px #4F4F4F solid;
    border-right:2px #4F4F4F solid;
    border-bottom: 2px #4F4F4F solid;

}
</style>
