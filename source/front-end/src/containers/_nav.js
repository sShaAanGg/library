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
                _name: 'CSidebarNavDropdown',
                name: '設備',
                icon: 'cil-cog',
                items: [
                    {
                        name: '機台設備',
                        to: '/machine-manage',
                    },
                    {
                        name: '網路設備',
                        to: '/equipment-manage',
                    }
                ]
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
