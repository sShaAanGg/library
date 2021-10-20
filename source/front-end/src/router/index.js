import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Main = () => import('@/views/Main')
const AccountManage = () => import('@/views/AccountManage')

// Dashboard
const Dashboard = () => import('@/components/dashboards/Dashboard.vue')
const ProductLineStatusAnaylysis = () => import('@/components/dashboards/ProductLineStatusAnalysis.vue')
const ElectricBill = () => import ('@/components/dashboards/ElectricBill.vue')
const DemandPredict = () => import ('@/components/dashboards/DemandPredict.vue')
const EquipmentManage = () => import('@/components/dashboards/EquipmentManage.vue')
const MachineManage = () => import('@/components/dashboards/MachineManage.vue')
const AIAnalysis = () => import('@/components/dashboards/AIAnalysis.vue')
const AbnormalAlert = () => import('@/components/dashboards/AbnormalAlert.vue')


//Cards
const Analysis = () => import('@/components/cards/Analysis')

// Views - Pages
const Page401 = () => import('@/views/pages/Page401')
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

Vue.use(Router)

const router = new Router({
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'active',
    scrollBehavior: () => ({ y: 0 }),
    routes: configRoutes()
})

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         // this route requires auth, check if logged in
//         // if not, redirect to login page.
//         let account = sessionStorage.getItem('ACCOUNT')
//         let role = sessionStorage.getItem('ROLE')
//         //console.log(`account=${account}, role=${role}`)

//         if ((to.path === '/account-manage') && role !== 'admin') {
//             next({ path: '/401' })
//         } else if (!account || !role) {
//             next({ path: '/pages/login' })
//         } else {
//             next()
//         }
//     } else {
//         next() // 確保一定要調用 next()
//     }
// })

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',
            name: '首頁',
            component: TheContainer,
            children: [
                {
                    path: 'dashboard',
                    name: '儀表板',
                    component: Dashboard,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/product-line-status-analysis',
                    name: '產線狀態分析',
                    component: ProductLineStatusAnaylysis,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'electric-bill',
                    name: '電費計算',
                    component: ElectricBill,
                    meta: { requireAuth: true}
                },
                {
                    path: 'demand-predict',
                    name: '需量預測',
                    component: DemandPredict,
                    meta: { requireAuth: true}
                },
                {
                    path: '/equipment-manage',
                    name: '網路設備',
                    component: EquipmentManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/machine-manage',
                    name: '設備管理',   // 機台設備
                    component: MachineManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/ai-analysis',
                    name: 'AI分析',
                    component: AIAnalysis,
                    meta: {requiresAuth: true}
                },
                {
                    path: '/abnormal-alert',
                    name: '異常告警',
                    component: AbnormalAlert,
                    meta: {requiresAuth: true}
                },
                {
                    path: '/analysis/:mode/:factory',
                    name: 'Analysis',
                    component: Analysis,
                    meta:{
                        requiresAuth: true
                    }
                },
                {
                    path: '/account-manage',
                    name: '帳號管理',
                    component: AccountManage,
                    meta: { requiresAuth: true }
                },
            ]
        },
        {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) { return c('router-view') }
            },
            children: [
                {
                    path: '401',
                    name: 'Page401',
                    component: Page401
                },
                {
                    path: '404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: 'login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Register
                }
            ]
        },
    ]
}

export default router
