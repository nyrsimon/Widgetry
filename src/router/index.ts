import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { Preferences } from '@capacitor/preferences';
import { state } from '@/state';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: "Home",
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/Inbox',
    redirect: '/folder/Inbox'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/folder/:id',
    component: () => import('@/views/FolderPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * This checks we have the right credentials for the home page
 */
router.beforeEach(async (to) => {

  // If going to the Dashborad (Home) then check we have credentials - if not goto login
  // If we are credentialled then load the widgets from storage into memory (state)
  if (to.name == 'Home') {


    const isUserLoggedIn = await Preferences.get({ key: 'IS_USER_LOGGED_IN' });

    const token = await Preferences.get({ key: "NOTION_TOKEN" });

    console.log(isUserLoggedIn);

    //if we are not logged in redirect to the login page
    if (isUserLoggedIn.value !== "YES") {
      return '/login';
    }

    //store token in state
    state.token = token.value || "";

  }
})
export default router
