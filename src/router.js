import Vue from "vue";
import firebase from 'firebase'
import Router from "vue-router";
import Home from "./components/Home.vue";
import Profile from "./components/profile/Profile.vue";
import Festivals from "./components/Festivals.vue";
import FestivalsBackup from "./components/FestivalsBackup.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/user_profile/:user_id",
      name: "Profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/festivals",
      name: "Festivals",
      component: Festivals
    },
    {
      path: "/FestivalsBackup",
      name: "FestivalsBackup",
      component: FestivalsBackup
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Check if the route required auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // Check auth state of the user
    if (firebase.auth().currentUser) {
      // User signed in, proceed to route
      next()
    } else {
      // No user signed in, redirect to home
      next({
        name: 'Home'
      })
    }
  } else {
    next()
  }
})

export default router