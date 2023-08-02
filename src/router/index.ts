import { ROUTER_NAME } from '@/enums';
import LayoutDefault from '@/layouts/default/Default.vue';
import { getUser, logout } from '@/services';
import { useOAuthStore } from '@/stores/oauth';
import { useRouteStore } from '@/stores/route';
import type { RouteLocationNormalized } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutDefault,
      children: [
        {
          path: '',
          name: ROUTER_NAME.HOME,
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'create',
          name: ROUTER_NAME.ACTOR_CREATION,
          component: () => import('@/views/ActorCreationView.vue'),
        },
        {
          path: 'edit/:id',
          name: ROUTER_NAME.ACTOR_EDIT,
          component: () => import('@/views/ActorEditView.vue'),
        },
        {
          path: 'qa/:id',
          name: ROUTER_NAME.STUDY_BUDDY_QA,
          component: () => import('@/views/StudyBuddyQAView.vue'),
        },
        {
          path: 'generate-question/:id',
          name: ROUTER_NAME.STUDY_BUDDY_QUESTION,
          component: () => import('@/views/StudyBuddyQuestionView.vue'),
        },
        {
          path: 'google-sheet/:id',
          name: ROUTER_NAME.STUDY_BUDDY_GOOGLE_SHEET,
          component: () => import('@/views/StudyBuddyGoogleSheetView.vue'),
        },
      ],
    },
    {
      path: '/_test',
      component: LayoutDefault,
      children: [
        {
          path: 'splitpanes',
          component: () => import('@/testViews/SplitpanesView.vue'),
        },
        {
          path: 'markdown',
          component: () => import('@/testViews/MarkdownView.vue'),
        },
        {
          path: 'mqtt',
          component: () => import('@/testViews/MqttView.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      redirect: { name: ROUTER_NAME.HOME },
    },
  ],
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
  const route = useRouteStore();
  const oauth = useOAuthStore();

  try {
    if (route.to !== null) {
      const path = route.to.path as string
      route.to = null;
      next({ path: path });
      return;
    }

    if (oauth.user === null) {
      const resp = await getUser();
      oauth.user = resp?.data;
    }
    next();
  } catch (error) {
    console.error(error);
    route.to = to;
    logout();
    next(false)
  }
});

export default router;
