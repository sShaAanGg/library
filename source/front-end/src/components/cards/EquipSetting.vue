<template>
    <div class="card">
        <h2 class="card-title">設備控制</h2>
        <CRow>
            <CCol class="light-master-switch">
                <h4> 燈光總電源：
                    <CButton
                        :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                        size='lg'
                        @click="switch_light()"
                    >
                        {{ statusLight }}
                    </CButton>
                </h4>
            </CCol>
            <CCol class="fan-master-switch">
                <h4>
                    風扇總電源：
                    <CButton
                        :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                        size='lg'
                        @click="switch_fan()"
                    >
                        {{ statusFan }}
                    </CButton>
                </h4>
            </CCol>
        </CRow>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOnLight: false,
            isOnFan: false,
            statusLight: 'OFF',
            statusFan: 'OFF',
        }
    },
    mounted() {
        // turn on all lights and fans in the beginning
        this.switch_light();
        this.switch_fan();
    },
    methods: {
        switch_light() {
            let data = this.isOnLight ? 'light_off' : 'light_on';
            this.$http
                .post('/api/enms/send_switch_socket', {data:data})
                .then(res => {
                    let resMsg = JSON.stringify(res);

                    let curStat = this.isOnLight;
                    this.isOnLight = !curStat;

                    this.statusLight = (this.isOnLight) ? 'ON' : 'OFF';
                    console.log('[Front end] Response: ', resMsg);
                    console.log(resMsg[0])
                    this.status_light = (resMsg['status'] == 'SUCESS') ? 'OFF' : 'ON';
                })
        },

        switch_fan() {
            let data = this.isOnFan ? 'fan_off' : 'fan_on';
            this.$http
                .post('/api/enms/send_switch_socket', {data:data})
                .then(res=> {
                    let resMsg = JSON.stringify(res);

                    let curStat = this.isOnFan;
                    this.isOnFan = !curStat;

                    this.statusFan = (this.isOnFan) ? 'ON' : 'OFF';
                })
        }
    }
}
</script>

<style scoped>
.card {
    background-color: black;
    width:1465px;
    position: absolute;
    left: 25px;
    border-top:5px green solid;
    border-left:5px green solid;
    border-right:5px green solid;
    border-bottom: 5px green solid;
}
.card-title {
    color: green;
    font-size: 24px;
    padding-left:5px;
    padding-top:5px;
    padding-bottom:5px;
    background-color: black;
    border-bottom: 1px green solid;
    position: relative;
    left: 1px;
}
.light-master-switch {
    color: white;
    text-align: center;
}
.but-light-master-switch {
    color: green;
    padding-bottom:10px;
    width: 120px;

    border-top:2px green solid;
    border-left:2px green solid;
    border-right:2px green solid;
    border-bottom: 2px green solid;
}
.but-master-switch-off {
    color: #4F4F4F;
    padding-bottom:10px;
    width: 120px;

    border-top:2px #4F4F4F solid;
    border-left:2px #4F4F4F solid;
    border-right:2px #4F4F4F solid;
    border-bottom: 2px #4F4F4F solid;
}
.fan-master-switch {
    color: white;
    text-align: center;
}
</style>
