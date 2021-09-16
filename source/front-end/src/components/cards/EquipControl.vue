<template lang="html">
    <div class='wrapper card-eset'>
        <h4 class="card-eset-title">設備控制</h4>
        <!-- <button class='change__style' @click='changeStyle()'>Change Style</button> -->
        <tabs :mode="mode">
            <tab title="廠區一">
                <CRow>
                    <CCol lg = '8' class="light-master-switch">
                        <h6> 燈光總電源：
                            <CButton
                                :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_light()"
                            >
                                {{ statusLight }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg = '8' class="fan-master-switch">
                        <h6>
                            風扇總電源：
                            <CButton
                                :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_fan()"
                            >
                                {{ statusFan }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>
                <div>
                    
                </div>
            </tab>
            <tab title="廠區二">
                <CRow>
                    <CCol lg = '8' class="fan-master-switch">
                        <h6>
                            風扇總電源：
                            <CButton
                                :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_fan()"
                            >
                                {{ statusFan }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>                  
                <CRow>
                    <CCol lg = '8' class="light-master-switch">
                        <h6> 燈光總電源：
                            <CButton
                                :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_light()"
                            >
                                {{ statusLight }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>
            </tab>
            <tab title="廠區三">
                <CRow>
                    <CCol lg = '8' class="light-master-switch">
                        <h6> 燈光總電源：
                            <CButton
                                :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_light()"
                            >
                                {{ statusLight }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg = '8' class="fan-master-switch">
                        <h6>
                            風扇總電源：
                            <CButton
                                :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_fan()"
                            >
                                {{ statusFan }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>              
            </tab>
            <tab title="廠區四">
                <CRow>
                    <CCol lg = '8' class="fan-master-switch">
                        <h6>
                            風扇總電源：
                            <CButton
                                :class="[isOnFan ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_fan()"
                            >
                                {{ statusFan }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>                 
                <CRow>
                    <CCol lg = '8' class="light-master-switch">
                        <h6> 燈光總電源：
                            <CButton
                                :class="[isOnLight ? 'but-light-master-switch' : 'but-master-switch-off']"
                                size='sm'
                                @click="switch_light()"
                            >
                                {{ statusLight }}
                            </CButton>
                        </h6>
                    </CCol>
                </CRow>             
            </tab>
        </tabs>
    </div>
</template>

<script>
import Tab from './Tab.vue'
import Tabs from './Tabs.vue'

export default {
    components: {
        Tab,
        Tabs
    },
    data () {
        return {
            mode: 'dark',
            isOnLight: false,
            isOnFan: false,
            statusLight: 'OFF',
            statusFan: 'OFF',
        }
    },
    mounted() {
        this.switch_light();
        this.switch_fan();
    },
    methods: {
        changeStyle () {
          if (this.mode === 'dark') {
            this.mode = 'light'
          } else {
            this.mode = 'dark'
          }
        },
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

<style lang="css">
  * {
    margin: 0;
    padding: 0;
    font-family: 'Karla', sans-serif;
  }
  .wrapper {
    width: 100%;
    min-height: 47.5vh;
    background-color: #f8f8f8;
    margin: 0;
    /* padding: 20px; */
  }

  .change__style {
    background-color: #eee;
    font-size: 1em;
    margin-bottom: 10px;
    padding: 5px;
  }
.card-eset {
    background-color: #0e2e2b;
}

.card-eset-title {
    font-size: 1vw;
    color: #98a8a0;
    background-color: #0e2e2b;
    border-bottom: 1px rgb(77, 107, 77) solid;
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