import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'


// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
// const Main = () => import('@/views/Main')
// const EnmsAccountManage = () => import('@/views/ENMS_AccountManage')

// Dashboard
const Dashboard = () => import('@/components/dashboards/Dashboard.vue')

const SearchBooks = () => import('@/components/dashboards/SearchBooks.vue')
const MyBooks = () => import('@/components/dashboards/MyBooks.vue')
const AccountManage = () => import('@/components/dashboards/AccountManage.vue')
const BooksManage = () => import('@/components/dashboards/BooksManage.vue')
const PostManage = () => import('@/components/dashboards/PostManage.vue')
const AdminManage = () => import('@/components/dashboards/AdminManage.vue')

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
//         // console.log('au   '+ to.query.roles);
//         // let account = sessionStorage.getItem('ACCOUNT')
//         // let role = sessionStorage.getItem('ROLE')
//         let auth = sessionStorage.getItem('AUTH')
//         // console.log(`account=${account}, role=${role}`)  to.matched.some(record => record.meta.roles).includes(sessionStorage.getItem('ROLE'))
//         // if(to.roles.includes(role)){
//         //     console.log('333');
//         // }
//         if(auth === 'true'){
//             next();
//         }
//         else{
//             // console.log(sessionStorage.getItem('AUTH'));
//             next({path: '/dashboard'});
//             alert('請先登入!');
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
                    path: '/dashboard',
                    name: '儀表板',
                    component: Dashboard,
                    props: true,
                    // meta: { requiresAuth: false}
                },
                {
                    path: '/account-manage',
                    name: '帳號管理',
                    component: AccountManage,
                    // meta: { requiresAuth: true},
                },
                {
                    path: '/search-books',
                    name: 'findbooks',
                    component: SearchBooks,
                    // meta: { requiresAuth: false }
                },
                {
                    path: '/my-books',
                    name: '我的書櫃',
                    component: MyBooks,
                    // meta: { requiresAuth: true }
                },
                {
                    path: '/book_manage',
                    name: '藏書設定',
                    component: BooksManage,
                    // meta: { requiresAuth: true }
                },
                {
                    path: '/post_manage',
                    name: '公告設定',
                    component: PostManage,
                    // meta: { requiresAuth: true }
                },
                {
                    path: '/admin_manage',
                    name: '管理員管理',
                    component: AdminManage,
                    // meta: { requiresAuth: true }
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
