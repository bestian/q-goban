export default [

  { path: '/list', component: () => import('pages/List.vue') },
  { path: '/create', component: () => import('pages/Create.vue') },
  { path: '/update/:id', component: () => import('pages/Update.vue') },
  { path: '/intro', component: () => import('pages/Intro.vue') },
  { path: '/star', component: () => import('pages/Star.vue') },
  { path: '/chat', component: () => import('pages/Chat.vue') },
  { path: '/see/:id/:lev/:index', component: () => import('pages/See.vue') }
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/auth/login')
  },
  {
    path: '/success',
    component: () => import('pages/auth/success'),
    meta: {
      requiresAuth: true
     }
  },
  {
    path: '/verifyEmail',
    component: () => import('pages/auth/verifyEmail'),
    meta: {
      requiresAuth: true
     }
  },
  {
    path: '/completeAccount',
    component: () => import('pages/auth/completeAccount'),
    meta: {
      requiresAuth: true
     }
  },
  {
    path: '*',
    component: () => import('layouts/default'), 
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  }
]
