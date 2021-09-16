<template>
    <div class="card-eset">
        <h2 class="card-title-eset">設備控制</h2>
        <CTabs variant="pills" :active-tab="1">
        <CTab title="廠區一" class="tab-1 text-white">
        <CRow>
            <CCol lg = '8' class="light-master-switch">
                <h5> 燈光總電源：
                    <CButton
                        :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                        size='sm'
                        @click="switch_light()"
                    >
                        {{ statusLight }}
                    </CButton>
                </h5>
            </CCol>
        </CRow>
        <CRow>
            <CCol lg = '8' class="fan-master-switch">
                <h5>
                    風扇總電源：
                    <CButton
                        :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                        size='sm'
                        @click="switch_fan()"
                    >
                        {{ statusFan }}
                    </CButton>
                </h5>
            </CCol>
        </CRow>
        </CTab>
        <CTab title="廠區二" class="tab-1"></CTab>
        </CTabs>
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
.card-eset {
    background-color: #0e2e2b;
}
.card-title-eset {
    color: #98a8a0;
    font-size: 1vw;
    padding-left:5px;
    padding-top:5px;
    padding-bottom:5px;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
    position: relative;
    left: 1px;
}
.tab-1 {
    color: green;
    background: #27635e;
}
.tab-1:active {
    background: #000000;
    color: green;
}
.tab-1:visited {
    color: green;
    
}
.tab-1:hover {
    color: green;
}
.light-master-switch {
    color: white;
    text-align: center;
}
.but-light-master-switch {
    color: green;
    padding-bottom:10px;
    width: 80px;

    border-top:2px green solid;
    border-left:2px green solid;
    border-right:2px green solid;
    border-bottom: 2px green solid;
}
.but-master-switch-off {
    color: #4F4F4F;
    padding-bottom:10px;
    width: 80px;

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
