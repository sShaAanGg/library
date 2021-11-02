import 'es6-promise/auto'
import "@babel/polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import CoreuiVue from '@coreui/vue'
import Multiselect from 'vue-multiselect'
import VueUploadComponent from 'vue-upload-component'
import { iconsSet as icons } from './assets/icons/icons.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlayCircle, faPauseCircle, faStopCircle, faAngleDoubleRight, faSignInAlt, faSignOutAlt, faFileDownload, faEye, faUser, faFileAlt,
    faWeight, faSyncAlt, faArrowDown, faArrowUp, faClipboardCheck, faTrashAlt, faPlus, faPencilAlt, faSearch,
    faTools, faBug, faFileInvoice, faCogs, faClipboardList, faUndoAlt, faUserPlus, faKey, faTachometerAlt, faRainbow,
    faPowerOff, faToggleOn, faToggleOff, faCog, faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import dataV from '@jiaminghi/data-view'

import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

import VueI18n from 'vue-i18n'
import zhTC from 'vxe-table/lib/locale/lang/zh-TC'
import enUS from 'vxe-table/lib/locale/lang/en-US'
import "default-passive-events"
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import { CChartBar } from '@coreui/vue-chartjs'
Vue.component('CChartBar', CChartBar)
import "default-passive-events"
import * as Utils from '@/common/utils.js';
Vue.prototype.$utils = Utils;

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/zh-cn';
Vue.component('DatePicker', DatePicker)

var axiosConfig = {
    headers: {
        "License-Key": '2ebed68cc4c1d3ad38d3ca348b468f93cf3833a1a9cb7d29adb1a277fde79b72'
    }
}
Vue.prototype.$axiosConfig = axiosConfig;


const messages = {
    zh_TC: {
        ...zhTC
    },
    en_US: {
        ...enUS
    }
}

library.add(faPlayCircle, faPauseCircle, faStopCircle, faAngleDoubleRight, faSignInAlt, faSignOutAlt, faFileDownload, faEye, faUser,
    faFileAlt, faWeight, faSyncAlt, faArrowDown, faArrowUp, faClipboardCheck, faTrashAlt, faPlus, faPencilAlt, faSearch,
    faTools, faBug, faFileInvoice, faCogs, faClipboardList, faUndoAlt, faUserPlus, faKey, faTachometerAlt, faRainbow,
    faPowerOff, faToggleOn, faToggleOff, faCog, faTimesCircle,)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('multiselect', Multiselect)
Vue.component('file-upload', VueUploadComponent)

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(dataV)
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'zh_TC',
    messages,
})

Vue.use(VXETable , {i18n: (key, args) => i18n.t(key, args)})

var root = location.protocol + '//' + location.hostname
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? root + ':5000' : root + ':5000'


Vue.prototype.$http = axios

new Vue({
    el: '#app',
    router,
    icons,
    store,
    template: '<App/>',
    components: {
        App
    },
})
