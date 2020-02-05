import fakeLayout from '@/layouts/fake-layout'

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
    label: 'login',
    icon: 'login',
    component: () => import('@/views/login'),
    hidden: true,
    constant: true
  }
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   label: 'dashboard',
  //   icon: 'dashboard',
  //   constant: true,
  //   component: () => import('@/views/dashboard')
  // }
  // {
  //   path: '/routes',
  //   name: 'routes',
  //   label: 'routes',
  //   icon: 'vertical_split',
  //   component: () => import('@/views/routes')
  // }
]

export const dynamic = [
  {
    path: '/category',
    name: 'category',
    meta: { title: 'category', icon: 'category' },
    component: fakeLayout,
    children: [
      {
        path: 'list',
        name: 'category-list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: () => import('@/views/category/index')
      },
      {
        path: 'add',
        name: 'category-add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: () => import('@/views/category/add')
      },
      {
        path: 'edit/:id',
        name: 'template-edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: '/template/list' },
        hidden: true,
        component: () => import('@/views/users/add')
      },
      {
        path: 'trash',
        name: 'template-trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: () => import('@/views/users/index')
      }
    ]
  },
  {
    path: '/products',
    name: 'products',
    meta: { title: 'products', icon: 'perm_media' },
    component: fakeLayout,
    children: [
      {
        path: 'list',
        name: 'products-list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: () => import('@/views/products/index')
      },
      {
        path: 'add',
        name: 'products-add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: () => import('@/views/products/add')
      },
      {
        path: 'edit/:id',
        name: 'products-edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: 'products/list' },
        hidden: true,
        component: () => import('@/views/products/add')
      },
      {
        path: 'trash',
        name: 'products-trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: () => import('@/views/products/index')
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    meta: { title: 'news', icon: 'library_books' },
    component: fakeLayout,
    children: [
      {
        path: 'list',
        name: 'news-list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: () => import('@/views/news/index')
      },
      {
        path: 'add',
        name: 'news-add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: () => import('@/views/news/add')
      },
      {
        path: 'edit/:id',
        name: 'news-edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: 'news/list' },
        hidden: true,
        component: () => import('@/views/news/add')
      },
      {
        path: 'trash',
        name: 'news-trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: () => import('@/views/news/index')
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'noRedirect',
    meta: { title: 'manager', icon: 'security' },
    component: fakeLayout,
    children: [
      {
        path: 'users',
        name: 'manager-users',
        // component: () => import('@/views/users'),
        meta: { title: 'users', icon: 'account_box' },
        component: () => import('@/views/users/index')
        // children: [
        //   {
        //     path: 'list',
        //     name: 'manager-users-list',
        //     meta: { title: 'list', hidden: false, noCache: true, flag: 1 },
        //     component: () => import('@/views/users/index')
        //   },
        //   {
        //     path: 'add',
        //     name: 'manager-users-add',
        //     meta: { title: 'add', hidden: false },
        //     component: () => import('@/views/users/add')
        //   },
        //   {
        //     path: 'edit/:id',
        //     name: 'manager-users-edit',
        //     meta: { title: 'edit', noCache: true, activeMenu: '/template/list' },
        //     hidden: true,
        //     component: () => import('@/views/users/add')
        //   },
        //   {
        //     path: 'trash',
        //     name: 'manager-users-trash',
        //     meta: { title: 'trash', noCache: true, flag: 0 },
        //     component: () => import('@/views/users/index')
        //   }
        // ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        meta: { title: 'roles', icon: 'verified_user' },
        component: () => import('@/views/roles/index')
      }
      // {
      //   path: '/routes',
      //   name: 'routes',
      //   meta: { title: 'routes', icon: 'vertical_split' },
      //   component: () => import('@/views/routes')
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
