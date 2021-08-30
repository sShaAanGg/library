export const admin = [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: '儀表板',
                to: '/dashboard',
                icon: 'cilFactory',
            },
            {
                _name: 'CSidebarNavItem',
                name: '產線狀態分析',
                to: '/product-line-status-analysis',
                icon: 'cil-bar-chart',
            },
            {
                _name: 'CSidebarNavItem',
                name: '設備管理',
                to: '/equipment-manage',
                icon: 'cil-cog'
            },
            {
                _name: 'CSidebarNavItem',
                name: 'AI分析',
                to: '/ai-analysis',
                icon: 'cil-chart-pie'
            },
            {
                _name: 'CSidebarNavItem',
                name: '異常告警',
                to: '/abnormal-alert',
                icon: 'cil-warning',
            },
            {
                _name: 'CSidebarNavItem',
                name: '帳號管理',
                to: '/account-manage',
                icon: 'cil-people'
            },
            // {
            //     _name: 'CSidebarNavItem',
            //     name: '登出',
            //     to: '/pages/login',
            //     icon: 'cil-account-logout'
            //     // icon: { name: 'cil-home', class: 'text-info' },
            // },
        ]
    }
]

export const user = [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: '生產報工',
                to: '/production-reoprter',
                icon: 'cilFactory',
            },
            // {
            //     _name: 'CSidebarNavItem',
            //     name: '製令管理',
            //     to: '/order-manage',
            //     icon: 'cil-calendar',
            // },
            // {
            //     _name: 'CSidebarNavDropdown',
            //     name: '資料分析',
            //     icon: 'cil-chart-line',
            //     items: [
            //         {
            //             name: '整體分析',
            //             to: '/overall-analysis',
            //         },
            //         {
            //             name: '個別分析',
            //             to: '/individual-analysis',
            //         },
            //         {
            //             name: '統計分析',
            //             to: '/statistics-analysis',
            //         },
            //     ]
            // },
            {
                _name: 'CSidebarNavItem',
                name: '報工紀錄',
                to: '/production-record',
                icon: 'cil-description'
            },
            {
                _name: 'CSidebarNavItem',
                name: '設備紀錄',
                to: '/equipment-record',
                icon: 'cil-description',
            },
            // {
            //     _name: 'CSidebarNavItem',
            //     name: '系統設定',
            //     to: '/system-setting',
            //     icon: 'cil-cog'
            // },
            {
                _name: 'CSidebarNavItem',
                name: '登出',
                to: '/pages/login',
                icon: 'cil-account-logout'
                // icon: { name: 'cil-home', class: 'text-info' },
            },
        ]
    }
]

export const guest = [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: '生產報工',
                to: '/production-reoprter',
                icon: 'cilFactory',
            },
            {
                _name: 'CSidebarNavItem',
                name: '登出',
                to: '/pages/login',
                icon: 'cil-account-logout'
            },
        ]
    }
]
