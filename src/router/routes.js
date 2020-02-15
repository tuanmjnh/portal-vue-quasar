// import fakeLayout from '@/layouts/fake-layout'

export const constant = [
  {
    path: '',
    redirect: 'dashboard',
    hidden: true,
    constant: true
  },
  {
    path: '/login',
    name: 'login',
    icon: 'login',
    component: () => import('@/views/login'),
    hidden: true,
    constant: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    title: 'dashboard',
    icon: 'dashboard',
    constant: true,
    component: () => import('@/views/dashboard')
  }
  // {
  //   path: '/routes',
  //   name: 'routes',
  //   label: 'routes',
  //   icon: 'vertical_split',
  //   component: 'routes')
  // }
]

export const dynamic = [
  {
    path: '/contact',
    name: 'contact',
    title: 'contact',
    icon: 'chrome_reader_mode',
    component: 'layout',
    children: [
      {
        path: 'business',
        name: 'contact-business',
        title: 'business',
        icon: 'supervised_user_circle',
        meta: {},
        component: 'contact/business/index',
        children: [
          {
            path: 'list',
            name: 'contact-business-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: { noCache: true, flag: 1 },
            component: 'contact/business/index'
          },
          {
            path: 'add',
            name: 'contact-business-add',
            title: 'add',
            icon: 'playlist_add',
            hidden: true,
            meta: {},
            component: 'contact/business/add'
          },
          {
            path: 'edit/:id?',
            name: 'contact-business-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: { noCache: true, activeMenu: 'news/list' },
            component: 'contact/business/add'
          },
          {
            path: 'trash',
            name: 'contact-business-trash',
            title: 'trash',
            icon: 'delete_sweep',
            hidden: true,
            meta: { noCache: true, flag: 0 },
            component: 'contact/business/index'
          }
        ]
      },
      {
        path: 'personal',
        name: 'contact-personal',
        title: 'personal',
        icon: 'supervisor_account',
        meta: {},
        component: 'contact/personal/index',
        children: [
          {
            path: 'list',
            name: 'contact-personal-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: { noCache: true, flag: 1 },
            component: 'contact/personal/index'
          },
          {
            path: 'add',
            name: 'contact-personal-add',
            title: 'add',
            icon: 'playlist_add',
            hidden: true,
            meta: {},
            component: 'contact/personal/add'
          },
          {
            path: 'edit/:id?',
            name: 'contact-personal-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: { noCache: true, activeMenu: 'news/list' },
            component: 'contact/personal/add'
          },
          {
            path: 'trash',
            name: 'contact-personal-trash',
            title: 'trash',
            icon: 'delete_sweep',
            hidden: true,
            meta: { noCache: true, flag: 0 },
            component: 'contact/personal/index'
          }
        ]
      }
    ]
  },
  {
    path: '/diaban',
    name: 'diaban',
    title: 'diaban',
    icon: 'ballot',
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'diaban-list',
        title: 'list',
        icon: 'list',
        meta: {},
        component: 'diaban/index'
      },
      {
        path: 'add',
        name: 'diaban-add',
        title: 'add',
        icon: 'playlist_add',
        hidden: true,
        meta: { noCache: true, activeMenu: '/diaban/list' },
        component: 'diaban/add'
      },
      {
        path: 'edit',
        name: 'diaban-edit',
        title: 'update_nv',
        icon: 'how_to_reg',
        hidden: true,
        meta: { noCache: true, activeMenu: '/diaban/list' },
        component: 'diaban/index'
      },
      {
        path: 'manager',
        name: 'diaban-manager',
        title: 'diaban_manager',
        icon: 'perm_data_setting',
        meta: { noCache: true },
        component: 'diaban/manager'
      }
    ]
  },
  {
    path: '/data',
    name: 'data',
    title: 'data',
    icon: 'data_usage',
    component: 'layout',
    children: [
      {
        path: 'guide',
        name: 'data-guide',
        title: 'guide',
        icon: 'question_answer',
        component: 'guide/index'
      },
      {
        path: 'category',
        name: 'data-category',
        title: 'category',
        icon: 'category',
        component: 'category/index',
        children: [
          {
            path: 'list',
            name: 'data-category-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: {},
            component: 'category/index'
          },
          {
            path: 'add',
            name: 'data-category-add',
            title: 'add',
            icon: 'playlist_add',
            hidden: true,
            meta: {},
            component: 'category/add'
          },
          {
            path: 'edit/:id?',
            name: 'data-category-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: { noCache: true, activeMenu: '/category/list' },
            component: 'category/add'
          },
          {
            path: 'trash',
            name: 'data-category-trash',
            title: 'trash',
            icon: 'delete_sweep',
            hidden: true,
            meta: { noCache: true, flag: 0 },
            component: 'category/index'
          }
        ]
      },
      {
        path: 'news',
        name: 'data-news',
        title: 'news',
        icon: 'description',
        component: 'news/index',
        children: [
          {
            path: 'list',
            name: 'data-news-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: {},
            component: 'news/index'
          },
          {
            path: 'add',
            name: 'data-news-add',
            title: 'add',
            icon: 'playlist_add',
            hidden: true,
            meta: {},
            component: 'news/add'
          },
          {
            path: 'edit/:id?',
            name: 'data-news-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: { noCache: true, activeMenu: '/news/list' },
            component: 'news/add'
          },
          {
            path: 'trash',
            name: 'data-news-trash',
            title: 'trash',
            icon: 'delete_sweep',
            hidden: true,
            meta: { noCache: true, flag: 0 },
            component: 'news/index'
          }
        ]
      }
    ]
  },
  {
    path: '/products',
    name: 'products',
    title: 'product',
    icon: 'perm_media',
    meta: {},
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'products-list',
        title: 'list',
        icon: 'list',
        hidden: true,
        meta: { noCache: true, flag: 1 },
        component: 'products/index'
      },
      {
        path: 'add',
        name: 'products-add',
        title: 'add',
        icon: 'playlist_add',
        hidden: true,
        meta: {},
        component: 'products/add'
      },
      {
        path: 'edit/:id?',
        name: 'products-edit',
        title: 'edit',
        icon: 'edit',
        hidden: true,
        meta: { noCache: true, activeMenu: 'products/list' },
        component: 'products/add'
      },
      {
        path: 'trash',
        name: 'products-trash',
        title: 'trash',
        icon: 'delete_sweep',
        hidden: true,
        meta: { noCache: true, flag: 0 },
        component: 'products/index'
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    title: 'news',
    icon: 'library_books',
    meta: {},
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'news-list',
        title: 'list',
        icon: 'list',
        hidden: true,
        meta: { noCache: true, flag: 1 },
        component: 'news/index'
      },
      {
        path: 'add',
        name: 'news-add',
        title: 'add',
        icon: 'playlist_add',
        hidden: true,
        meta: {},
        component: 'news/add'
      },
      {
        path: 'edit/:id?',
        name: 'news-edit',
        title: 'edit',
        icon: 'edit',
        hidden: true,
        meta: { noCache: true, activeMenu: 'news/list' },
        component: 'news/add'
      },
      {
        path: 'trash',
        name: 'news-trash',
        title: 'trash',
        icon: 'delete_sweep',
        hidden: true,
        meta: { noCache: true, flag: 0 },
        component: 'news/index'
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'noRedirect',
    title: 'manager',
    icon: 'security',
    meta: {},
    component: 'layout',
    children: [
      {
        path: 'users',
        name: 'manager-users',
        title: 'users',
        icon: 'account_box',
        meta: {},
        component: 'users/index',
        children: [
          {
            path: 'list',
            name: 'manager-users-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: { flag: 1 },
            component: 'users/index'
          },
          {
            path: 'add',
            name: 'manager-users-add',
            title: 'add',
            icon: 'add',
            hidden: true,
            meta: {},
            component: 'users/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-users-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: {},
            component: 'users/add'
          },
          {
            path: 'trash',
            name: 'manager-users-trash',
            title: 'trash',
            icon: 'delete',
            hidden: true,
            meta: { flag: 0 },
            component: 'users/index'
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        title: 'roles',
        icon: 'verified_user',
        meta: {},
        component: 'roles/index',
        children: [
          {
            path: 'list',
            name: 'manager-roles-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: { flag: 1 },
            component: 'roles/index'
          },
          {
            path: 'add',
            name: 'manager-roles-add',
            title: 'add',
            icon: 'add',
            hidden: true,
            meta: {},
            component: 'roles/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-roles-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: {},
            component: 'roles/add'
          },
          {
            path: 'trash',
            name: 'manager-roles-trash',
            title: 'trash',
            icon: 'delete',
            hidden: true,
            meta: { flag: 0 },
            component: 'roles/index'
          }
        ]
      },
      {
        path: 'get-password',
        name: 'get-password',
        title: 'get_password',
        icon: 'vpn_key',
        meta: { icon: 'vpn_key' },
        component: 'users/get-password'
      },
      {
        path: 'types',
        name: 'manager-types',
        title: 'types',
        icon: 'select_all',
        meta: {},
        component: 'types/index',
        children: [
          {
            path: 'list',
            name: 'manager-types-list',
            title: 'list',
            icon: 'list',
            hidden: true,
            meta: { flag: 1 },
            component: 'types/index'
          },
          {
            path: 'add',
            name: 'manager-types-add',
            title: 'add',
            icon: 'add',
            hidden: true,
            meta: {},
            component: 'types/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-types-edit',
            title: 'edit',
            icon: 'edit',
            hidden: true,
            meta: {},
            component: 'types/add'
          },
          {
            path: 'trash',
            name: 'manager-types-trash',
            title: 'trash',
            icon: 'delete',
            hidden: true,
            meta: { flag: 0 },
            component: 'types/index'
          }
        ]
      }
      // {
      //   path: '/routes',
      //   name: 'routes',
      //   meta: { title: 'routes', icon: 'vertical_split' },
      //   component: 'routes')
      // }
    ]
  }
]

export const exception = []
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  constant.push({
    path: '*',
    name: '404',
    component: () => import('@/pages/error404'),
    hidden: true,
    constant: true,
    meta: { title: 'error404', icon: '404' }
  })
}

export default constant
