<template>
  <span>{{ user.name }}</span>


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

    const menubarItems = [
      {
        label: user.value.name,
        class: "menubar-root",
        items: [
          {
            label: "Выйти",
            command: signOut,
          },
          {
            label: "Войти",
            command: signIn,
          },
        ],
      },
    ];

    return {
      user,
      menubarItems,
    };
  },
});
</script>