<template>
  <Menubar :model="menubarItems">
    <template #end>
      <i class="pi pi-video" />
      <i class="pi pi-wifi" />
      <i class="pi pi-volume-up" />
      <span>Fri 13:07</span>
      <i class="pi pi-search" />
      <i class="pi pi-bars" />
    </template>
  </Menubar>

  <div class="container">
    <router-view />
  </div>
</template>


<script lang="ts" setup>
import { ref, provide } from "vue";
import { OrderService } from '@/services/OrderService';
import {UserProvider} from '@/providers/UserProvider';

provide('OrderService', new OrderService());
provide('UserProvider', new UserProvider());

const menubarItems = ref([
  {
    label: "Демо заказы",
    class: "menubar-root",
  },
  {
    label: "Заказы",
    items: [
      {
        label: "Новый заказ",
        icon: "pi pi-fw pi-plus",
      },
      {
        separator: true,
      },
      {
        label: "Все заказы",
        icon: "pi pi-fw pi-external-link",
        to: "/",
      },
    ],
  },
  {
    label: "О программе",
    icon: "pi pi-fw pi-question",
    to: "/about",
  },
]);
</script>


<style lang="scss">
@import './styles/statuses.scss';
body {
  margin: 0;
  padding: 0;
}

.container {
  position: absolute;
  top: 58px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

.p-menubar {
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 0;

  .menubar-root {
    font-weight: bold;
    padding: 0 1rem;
  }

  .p-menuitem-link {
    padding: 0.5rem 0.75rem;
  }

  .p-menubar-root-list > .p-menuitem > .p-menuitem-link {
    padding: 0.5rem 0.75rem;

    > .p-submenu-icon {
      display: none;
    }
  }

  .p-menubar-end {
    span,
    i {
      padding: 0 0.75rem;
    }
  }

  .p-submenu-list {
    z-index: 2;
  }
}
</style>
