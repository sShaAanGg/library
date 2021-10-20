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
                name: '產線年度歷史分析',
                to: '/product-line-status-analysis',
                icon: 'cil-chart-line',
            },
            {
                _name: 'CSidebarNavItem',
                name: '電費計算',
                to: '/electric-bill',
                icon: 'cil-lightbulb',
            },
            {
                _name: 'CSidebarNavItem',
                name: '需量預測',
                to: '/demand-predict',
                icon: 'cil-bar-chart',
            },
            {
                _name: 'CSidebarNavItem',
                name: '設備管理',
                to: '/machine-manage',
                icon: 'cil-cog',
                // items: [
                //     {
                //         name: '機台設備',
                //         to: '/machine-manage',
                //     },
                //     {
                //         name: '網路設備',
                //         to: '/equipment-manage',
                //     }
                // ]
            },
            // {
            //     _name: 'CSidebarNavItem',
            //     name: 'AI分析',
            //     to: '/ai-analysis',
            //     icon: 'cil-chart-pie'
            // },
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
