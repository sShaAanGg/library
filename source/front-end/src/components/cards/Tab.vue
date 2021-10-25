<template lang="html">
    <div class='tab' v-show='isActive'>
        <slot></slot>
        <div v-for="(item, index) in controlList">
            <BtnSwitch :btnName=item.button_name :btnType=item.button_type :btnMac=item.mac :btnPort=item.button_port :btnPin=item.button_pin :btnSwitch="siwtch_status(item.button_status)"></BtnSwitch>
        </div>
    </div>
</template>

<script>
import BtnSwitch from '@/components/buttons/BtnSwitch';

export default {
    components: {
        BtnSwitch
    },
    props: {
        title: {
            type: String,
            default: 'Tab'
        }
    },
    data () {
        return {
            isActive: true,
            controlList: '',
        }
    },

    created() {
        this.get_control_list();
    },

    mounted() {
        setInterval(() => {
            this.get_control_list();
        }, 1000);
    },

    methods: {
        get_control_list() {
            this.$http
                .post('/api/enms/select_equip_controllers', {data:{factory:this.title}})
                .then(res=> {
                    this.controlList = res.data;
                })
        },

        siwtch_status(btnStatus) {
            switch (btnStatus){
                case '0':
                    return {
                        btnClass :  'btn-switch-off',
                        btnText :   "OFF"
                    };
                break;
                case '1':
                    return {
                        btnClass : 'btn-switch-on',
                        btnText : "ON"
                    };
                break;
                case '2':
                    return {
                        btnClass : 'btn-switch-off',
                        btnText : "KO"
                    };
                break;
            }
        }
    }
}
</script>

<style lang="css">

</style>
