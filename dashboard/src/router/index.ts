import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
    children: [
      {
        path: 'contact/:id',
        name: '#contact-card-modal',
        component: () =>
          import(/* webpackChunkName: "about" */ "../components/contacts/ContactCard.vue"),
        props: route => ({destination: route.name})
      },
      {
        path: 'task/:id',
        name: '#task-card-modal',
        component: () =>
          import(/* webpackChunkName: "about" */ "../components/task/TaskCard.vue"),
        props: route => ({destination: route.name})
      },
      {
        path: 'contact/:id/message/:id',
        name: '#message-modal',
        component: () =>
          import(/* webpackChunkName: "about" */ "../components/common/MessageWriter.vue"),
        props: route => ({destination: route.name})
      }
    ]    
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
});
