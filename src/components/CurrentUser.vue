<template>
  <a class="p-menuitem-link" @click="onClick">{{ user.name }}
    <span v-if="!user || user.isAnonymous">Войти</span>
  </a>
</template>

<script lang="ts">
import { User } from "@/entities/User";
import { UserService } from "@/services/UserService";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const user = ref<User>(new User());
    const userService = new UserService();

    userService.onAuthStateChanged((u) => {
      user.value = u;
    });

    const signIn = userService.signIn;
    const signOut = userService.signOut;
    const onClick = async () => {
      if (!user.value || user.value.isAnonymous) {
        await signIn();
      } else {
        await signOut();
      }
    };
   
    return {
      user,
      onClick,
    };
  },
});
</script>