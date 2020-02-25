// import fakeLayout from '@/layouts/fake-layout'

export const constant = [
  {
    path: '',
    redirect: 'dashboard',
    meta: { hidden: true, constant: true }
  },
  {
    path: '/login',
    name: 'login',
    icon: 'login',
    meta: { hidden: true, constant: true },
    component: () => import('@/views/login')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard', icon: 'dashboard', constant: true },
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
    meta: { title: 'contact', icon: 'chrome_reader_mode' },
    component: 'layout',
    children: [
      {
        path: 'business',
        name: 'contact-business',
        meta: { title: 'business', icon: 'supervised_user_circle' },
        component: 'contact/business/index',
        children: [
          {
            path: 'list',
            name: 'contact-business-view',
            meta: { title: 'view', icon: 'list', hidden: true, noCache: true, flag: 1 },
            component: 'contact/business/index'
          },
          {
            path: 'add',
            name: 'contact-business-add',
            meta: { title: 'add', icon: 'playlist_add', hidden: true },
            component: 'contact/business/add'
          },
          {
            path: 'edit/:id?',
            name: 'contact-business-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, noCache: true, activeMenu: 'news/list' },
            component: 'contact/business/add'
          },
          {
            path: 'trash',
            name: 'contact-business-trash',
            meta: { title: 'trash', icon: 'delete_sweep', hidden: true, noCache: true, flag: 0 },
            component: 'contact/business/index'
          }
        ]
      },
      {
        path: 'personal',
        name: 'contact-personal',
        meta: { title: 'personal', icon: 'supervisor_account' },
        component: 'contact/personal/index',
        children: [
          {
            path: 'list',
            name: 'contact-personal-view',
            meta: { title: 'view', icon: 'list', hidden: true, noCache: true, flag: 1 },
            component: 'contact/personal/index'
          },
          {
            path: 'add',
            name: 'contact-personal-add',
            meta: { title: 'add', icon: 'playlist_add', hidden: true },
            component: 'contact/personal/add'
          },
          {
            path: 'edit/:id?',
            name: 'contact-personal-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, noCache: true, activeMenu: 'news/list' },
            component: 'contact/personal/add'
          },
          {
            path: 'trash',
            name: 'contact-personal-trash',
            meta: { title: 'trash', icon: 'delete_sweep', hidden: true, noCache: true, flag: 0 },
            component: 'contact/personal/index'
          }
        ]
      }
    ]
  },
  {
    path: '/diaban',
    name: 'diaban',
    meta: { title: 'diaban', icon: 'ballot' },
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'diaban-view',
        meta: { title: 'view', icon: 'list' },
        component: 'diaban/index'
      },
      {
        path: 'add',
        name: 'diaban-add',
        meta: { title: 'add', icon: 'playlist_add', hidden: true, noCache: true, activeMenu: '/diaban/list' },
        component: 'diaban/add'
      },
      {
        path: 'edit',
        name: 'diaban-edit',
        meta: { title: 'update_nv', icon: 'how_to_reg', hidden: true, noCache: true, activeMenu: '/diaban/list' },
        component: 'diaban/index'
      },
      {
        path: 'manager',
        name: 'diaban-manager',
        meta: { title: 'diaban_manager', icon: 'perm_data_setting', noCache: true },
        component: 'diaban/manager'
      }
    ]
  },
  {
    path: '/pttb',
    name: 'pttb',
    meta: { title: 'pttb', icon: 'dns' },
    component: 'layout',
    children: [
      {
        path: 'tuyen-thu',
        name: 'pttb-tuyen-thu',
        meta: { title: 'tuyen_thu', icon: 'swap_vert', noCache: true },
        component: 'pttb/tuyen-thu',
        children: [
          {
            path: 'list',
            name: 'pttb-tuyen-thu-view',
            meta: { title: 'view', icon: 'list', hidden: true },
            component: 'category/index'
          },
          {
            path: 'edit',
            name: 'pttb-tuyen-thu-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, noCache: true, activeMenu: '/category/list' },
            component: 'category/add'
          }
        ]
      }
    ]
  },
  {
    path: '/data',
    name: 'data',
    meta: { title: 'data', icon: 'data_usage' },
    component: 'layout',
    children: [
      {
        path: 'guide',
        name: 'data-guide',
        meta: { title: 'guide', icon: 'question_answer' },
        component: 'guide/index'
      },
      {
        path: 'category',
        name: 'data-category',
        meta: { title: 'category', icon: 'category' },
        component: 'category/index',
        children: [
          {
            path: 'list',
            name: 'data-category-view',
            meta: { title: 'view', icon: 'list', hidden: true },
            component: 'category/index'
          },
          {
            path: 'add',
            name: 'data-category-add',
            meta: { title: 'add', icon: 'playlist_add', hidden: true },
            component: 'category/add'
          },
          {
            path: 'edit/:id?',
            name: 'data-category-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, noCache: true, activeMenu: '/category/list' },
            component: 'category/add'
          },
          {
            path: 'trash',
            name: 'data-category-trash',
            meta: { title: 'trash', icon: 'delete_sweep', hidden: true, noCache: true, flag: 0 },
            component: 'category/index'
          }
        ]
      },
      {
        path: 'news',
        name: 'data-news',
        meta: { title: 'news', icon: 'description' },
        component: 'news/index',
        children: [
          {
            path: 'list',
            name: 'data-news-view',
            meta: { title: 'view', icon: 'list', hidden: true },
            component: 'news/index'
          },
          {
            path: 'add',
            name: 'data-news-add',
            meta: { title: 'add', icon: 'playlist_add', hidden: true },
            component: 'news/add'
          },
          {
            path: 'edit/:id?',
            name: 'data-news-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, noCache: true, activeMenu: '/news/list' },
            component: 'news/add'
          },
          {
            path: 'trash',
            name: 'data-news-trash',
            meta: { title: 'trash', icon: 'delete_sweep', hidden: true, noCache: true, flag: 0 },
            component: 'news/index'
          }
        ]
      },
      {
        path: 'hddt',
        name: 'data-hddt',
        meta: { title: 'hddt', icon: 'subtitles' },
        component: 'hddt/index'
        // children: [
        //   {
        //     path: 'tao',
        //     name: 'hddt-create',
        //     meta: { title: 'create_hddt', icon: 'layers', hidden: false },
        //     component: 'hddt/create'
        //   },
        //   {
        //     path: 'huy',
        //     name: 'hddt-remove',
        //     meta: { title: 'remove_hddt', icon: 'layers_clear', hidden: false },
        //     component: 'hddt/remove'
        //   }
        // ]
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'noRedirect',
    meta: { title: 'manager', icon: 'security' },
    component: 'layout',
    children: [
      {
        path: 'users',
        name: 'manager-users',
        meta: { title: 'users', icon: 'account_box' },
        component: 'users/index',
        children: [
          {
            path: 'list',
            name: 'manager-users-view',
            meta: { title: 'view', icon: 'list', hidden: true, flag: 1 },
            component: 'users/index'
          },
          {
            path: 'add',
            name: 'manager-users-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'users/add'
          },
          {
            path: 'edit',
            name: 'manager-users-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true },
            component: 'users/add'
          },
          {
            path: 'trash',
            name: 'manager-users-trash',
            meta: { title: 'trash', icon: 'delete', hidden: true, flag: 0 },
            component: 'users/index'
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        meta: { title: 'roles', icon: 'verified_user' },
        component: 'roles/index',
        children: [
          {
            path: 'list',
            name: 'manager-roles-view',
            meta: { title: 'view', icon: 'list', hidden: true, flag: 1 },
            component: 'roles/index'
          },
          {
            path: 'add',
            name: 'manager-roles-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'roles/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-roles-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true },
            component: 'roles/add'
          },
          {
            path: 'trash',
            name: 'manager-roles-trash',
            meta: { title: 'trash', icon: 'delete', hidden: true, flag: 0 },
            component: 'roles/index'
          }
        ]
      },
      {
        path: 'get-password',
        name: 'get-password',
        meta: { title: 'get_password', icon: 'vpn_key' },
        component: 'users/get-password'
      },
      {
        path: 'types',
        name: 'manager-types',
        meta: { title: 'types', icon: 'select_all' },
        component: 'types/index',
        children: [
          {
            path: 'list',
            name: 'manager-types-view',
            meta: { title: 'view', icon: 'list', hidden: true, flag: 1 },
            component: 'types/index'
          },
          {
            path: 'add',
            name: 'manager-types-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'types/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-types-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true },
            component: 'types/add'
          },
          {
            path: 'trash',
            name: 'manager-types-trash',
            meta: { title: 'trash', icon: 'delete', hidden: true, flag: 0 },
            component: 'types/index'
          }
        ]
      },
      {
        path: 'command',
        name: 'manager-command',
        meta: { title: 'command', icon: 'code' },
        component: 'command/index',
        children: [
          {
            path: 'list',
            name: 'manager-command-view',
            meta: { title: 'view', icon: 'list', hidden: true, flag: 1 },
            component: 'command/index'
          },
          {
            path: 'add',
            name: 'manager-command-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'command/add'
          },
          {
            path: 'edit/:id?',
            name: 'manager-command-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true },
            component: 'command/add'
          },
          {
            path: 'trash',
            name: 'manager-command-trash',
            meta: { title: 'trash', icon: 'delete', hidden: true, flag: 0 },
            component: 'command/index'
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
    meta: { title: 'error404', icon: '404', hidden: true, constant: true }
  })
}

export default constant
