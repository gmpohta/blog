import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/register',
    name: 'register',
    component:() => import('@/views/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component:() => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'blog',
    component:() => import('@/views/BlogView.vue'),
  },
  {
    path: '/create',
    name: 'create',
    component:() => import('@/views/CreateView.vue'),
  },
  {
    path: '/edit/:postId',
    name: 'edit',
    component:() => import('@/views/EditView.vue'),
  },
  {
    path: '/user-posts',
    name: 'userPosts',
    component:() => import('@/views/UserPostsView.vue'),
  },
  {
    path: "*",
    component: () => import('@/views/PageNotFoundView.vue')
  },
]

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  const nextRoute = [ 'login', 'register']
  const user = JSON.parse(localStorage.getItem('user')||'null')

  if (nextRoute.indexOf(to.name) < 0) {
      if (!user) {
        router.push({name: 'login'})
      }else if (!user.token){
        router.push({name: 'login'})
      }
  }
  next()
})

export default router
