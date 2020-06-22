import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useModal } from '../composables/useModal';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "about" */ "../views/Home.vue"),
    children: [
      {
        path: 'contact/:id',
        name: '#contact-card-modal',
        component: () => import(/* webpackChunkName: "about" */ "../components/contacts/ContactCard.vue"),
        props: route => ({
          destination: route.name,
          ...route.params
        })
      },
      // {
      //   path: 'task/:id',
      //   name: '#task-card-modal',
      //   component: () => import(/* webpackChunkName: "about" */ "../components/task/TaskCard.vue"),
      //   props: route => ({
      //     destination: route.name,
      //     ...route.params
      //   })
      // },
      {
        path: 'task/:id',
        name: '#edit-item-modal',
        component: () => import(/* webpackChunkName: "about" */ "../components/common/BaseItemEditCard.vue"),
        props: route => ({
          destination: route.name,
          ...route.params
        })
      },
      {
        path: 'contact/:id/message/:id',
        name: '#message-modal',
        component: () => import(/* webpackChunkName: "about" */ "../components/common/MessageWriter.vue"),
        props: route => ({
          destination: route.name,
          ...route.params
        })
      }
    ]    
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
});
