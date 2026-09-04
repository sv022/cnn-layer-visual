import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Conv2d Visualization',
      meta: { title: 'CNN Layer Visual' },
      component: HomeView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found',
      meta: { title: 'Page not found' },
      component: PageNotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'CNN Visual'
  next()
})

export default router
