
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/list', component: () => import('pages/List.vue') },
      { path: '/create', component: () => import('pages/Create.vue') },
      { path: '/update/:id', component: () => import('pages/Update.vue') },
      { path: '/intro', component: () => import('pages/Intro.vue') },
      { path: '/star', component: () => import('pages/Star.vue') },
      { path: '/chat', component: () => import('pages/Chat.vue') },
      { path: '/see/:id/:lev/:index', component: () => import('pages/See.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
