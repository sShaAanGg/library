export const admin = [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: '首頁',
                to: '/dashboard',
                icon: 'cilFactory',
            },
            {
                _name: 'CSidebarNavItem',
                name: '公告設定',
                to: '/post_manage',
                icon: 'cil-chart-line',
            },
            {
                _name: 'CSidebarNavItem',
                name: '藏書設定',
                to: '/book_manage',
                icon: 'cil-lightbulb',
            },
            {
                _name: 'CSidebarNavItem',
                name: '管理員管理',
                to: '/admin_manage',
                icon: 'cil-people'
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
                name: '首頁',
                to: '/dashboard',
                icon: 'cilFactory',
            },
            {
                _name: 'CSidebarNavItem',
                name: '館藏查詢',
                to: '/search-books',
                icon: 'cil-chart-line',
            }
        ]
    }
]

export const user = [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: '首頁',
                to: '/dashboard',
                icon: 'cilFactory',
            },
            {
                _name: 'CSidebarNavItem',
                name: '館藏查詢',
                to: '/search-books',
                icon: 'cil-chart-line',
            },
            {
                _name: 'CSidebarNavItem',
                name: '我的書櫃',
                to: '/my-books',
                icon: 'cil-lightbulb',
            },
            {
                _name: 'CSidebarNavItem',
                name: '帳號管理',
                to: '/account-manage',
                icon: 'cil-people'
            },
        ]
    }
]
