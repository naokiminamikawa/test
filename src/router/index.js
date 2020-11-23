import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import SignIn from "../components/SignIn.vue";

import { Hub } from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

import UserDataStore from "@/store/index";

Vue.use(VueRouter);

let user;

function getUser() {
  return Auth.currentAuthenticatedUser()
    .then((data) => {
      if (data && data.signInUserSession) {
        UserDataStore.commit("setUser", data);
        return data;
      }
    })
    .catch((e) => {
      console.error(e);
      UserDataStore.commit("setUser", null);
      return null;
    });
}

Hub.listen("auth", async (data) => {
  switch (data.payload.event) {
    case "signIn":
      user = await getUser();
      router.push({ path: "/" });
      break;
    case "signOut":
      user = null;
      UserDataStore.commit("setUser", null);
      router.push({ path: "/signin" });         // 1
      break;
  }
});

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",                          // 1
    name: "SignIn",
    component: SignIn,
    meta: { requiresAuth: false },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    user = await getUser();
    // console.log(user);
    if (!user) {
      return next({
        path: "/signin",                   // 1
        query: {
          redirect: to.fullPath,
        },
      });
    }
    return next();
  }
  return next();
});

export default router;