<template lang="html">
    <div class='tab' v-show='isActive'>
        <slot></slot>
        <div v-for="(item, index) in controlList">
            <BtnSwitch :btnName=item.button_name :btnType=item.button_type :btnMac=item.mac></BtnSwitch>    
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
            data: {
                "port":"D",
                "pin":4,
                // "control":1,
                "deviceCount":0,
                "devices":[
                    // {
                    //     "mac":"00124B0018E46854"
                    // },
                    // {
                    //     "mac":"00124B0018E467A0"
                    // }
                ]
            }        
        }
    },

    mounted() {
        this.get_control_list();
    },

    methods: {
        get_control_list() {
            this.availableList = [];
            this.$http
                .post('/api/enms/select_equip_controllers', {data:{factory:this.title}})
                .then(res=> {
                    // format of res.data: {{mac, name, type, port, pin}, {mac, name, type, port, pin}, ...} 
                    this.controlList = res.data;
                    console.log(this.controlList);
                    for (let ix = 0; ix < this.controlList.length; ix++) {
                        let pushMac = {'mac':this.controlList[ix]['mac']};
                        this.data['devices'].push(pushMac);                        
                        ++this.data['deviceCount'];
                    }
                    this.$http
                        .post('http://192.168.4.17/restful.service.cgi?readgpio', this.data, this.$axiosConfig)
                        .then((response) => {
                            // this.data['deviceCount'] must equals to response.data['commNumber']
                            for (let iy = 0; iy < response.data['commNumber']; ++iy){
                                if(response.data['comms'][iy]['status'] == 'OK') {
                                    // button_name, button_type
                                    this.availableList.push(this.controlList[iy]);
                                }

                            }   
                        })
                        .catch( (error) => console.log(error));                      
                })
        }
    }
}
</script>

<style lang="css">
  
</style>