<template>
    <h6> {{btnName}}
        <CButton
            show:false
            :class="[(statusLight == 'ON') ? 'btn-switch-on' : 'btn-switch-off']"
            size='sm'
            @click="set_switch()"
        >
            {{ statusLight }}
        </CButton>
    </h6>    
</template>

<script>
export default {
    props:['btnName', 'btnType', 'btnMac'],
    data() {
        return {
            mac: this.btnMac,
            statusLight: 'OFF',
            isAlive: true,
            data: {
                "port":"D",
                "pin":4,
                "control":1,
                "deviceCount":1,
                "devices":[{'mac':this.btnMac}]
            }
        }
    },
    mounted() {
        // this.initialize_status();
    },
    methods: {
        initialize_status() {
            this.$http
                .post('http://192.168.4.17/restful.service.cgi?setgpio', this.data, this.$axiosConfig)
                .then( (res) => {
                    this.$http
                        .post('http://192.168.4.17/restful.service.cgi?readgpio', this.data, this.$axiosConfig)
                        .then((res) => {
                            this.statusLight = res.data['comms'][0]['gpioStatus'];
                            console.log(this.statusLight);
                            if(!this.statusLight) this.statusLight = 'KO';
                        })
                        .catch((error) => console.log(error))
                })
                .catch( (error) => console.log(error));
        },
        set_switch() {
            // this.data['devices'].push({'mac':this.mac});
            console.log(this.data);
            this.$http
                .post('http://192.168.4.17/restful.service.cgi?readgpio', this.data, this.$axiosConfig)
                .then((res) => {
                    if (res.data['comms'][0]['status'] == 'OK') {
                        let curStat = res.data['comms'][0]['gpioStatus'];
                        if (curStat == 'ON') {
                            this.data['control'] = 0;
                        }
                        else {
                            this.data['control'] = 1;
                        }
                        this.$http
                            .post('http://192.168.4.17/restful.service.cgi?setgpio', this.data, this.$axiosConfig)
                            .then( (res) => {
                                this.$http
                                    .post('http://192.168.4.17/restful.service.cgi?readgpio', this.data, this.$axiosConfig)
                                    .then((res) => {
                                        this.statusLight = res.data['comms'][0]['gpioStatus'];
                                        console.log(this.statusLight);
                                    })
                                    .catch((error) => console.log(error))
                            })
                            .catch( (error) => console.log(error));
                    }
                    else {
                        console.log('Status of switch is KO:::');
                        this.isAlive = false;
                    }
                })
                .catch( (error) => console.log(error));
        },
    }
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