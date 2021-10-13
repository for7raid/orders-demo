<template>
  <div>
    <button @click="logout">Выйти</button>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script lang="ts">
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';


import { defineComponent, onMounted } from "vue";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

export default defineComponent({
  name: "Login",
  setup() {
    debugger;
    //  const app = firebase.getApp();
    //  const auth = getAuth(app);

    // const ui = new firebaseui.auth.AuthUI(auth);

    const logout = async () => {
      //await auth.signOut();
    };

    onMounted(() => {
      // ui.start("#firebaseui-auth-container", {
      //   signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      // });
    });

    return {
      logout,
    };
  },
});
</script>
