import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Home from '../views/Home.vue';
import Money from '@/views/Money.vue';
import Labels from '@/views/Detail.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue'
import EditLabel from '@/views/EditLabel.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path:'/',
    redirect:'/money'   //重定向到money
  },
  {
    path: '/money',
    component: Money
  }, {
    path: '/labels',
    component: Labels
  }, {
    path: '/statistics',
    component: Statistics
  },
  {
    path: '/labels/edit/:id',
    component: EditLabel
  },
  {
    path:'*',
    component:NotFound
  }

];

const router = new VueRouter({
  routes
});

export default router;
