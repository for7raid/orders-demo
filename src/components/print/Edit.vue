<template>
  <div>
    <TabView v-model:activeIndex="activeTab" lazy scrollable>
      <TabPanel>
        <template #header> Общие сведения </template>
        <PrintGeneralInfo :order="order" />
      </TabPanel>
      <TabPanel v-for="item in order.items" :key="item.id">
        <template #header>
          {{ item.index }}.
          {{ item.name || "[Без названия " + item.index + "]" }}
        </template>

        <PrintOrderItem :item="item" />
      </TabPanel>
    </TabView>
  </div>
  <teleport to=".p-tabview-nav">
    <Button
      icon="pi pi-plus"
      class="p-button-rounded p-button-text align-self-center"
      style="margin-top: 5px"
      title="Добавить объект"
      @click="addItem"
    />
  </teleport>
</template>


<script lang="ts">
import { defineComponent, inject, ref, toRefs } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import PrintGeneralInfo from "@/components/print/GeneralInfo.vue";
import PrintOrderItem from "@/components/print/PrintOrderItem.vue";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { UserProvider } from "@/providers/UserProvider";

export default defineComponent({
  components: { PrintGeneralInfo, PrintOrderItem },
  props: {
    order: {
      required: true,
      type: PrintOrder,
    },
  },
  setup(props) {
      const userProvider = inject("UserProvider") as UserProvider;
    const { order } = toRefs(props);
    const activeTab = ref(0);
    const addItem = () => {
      activeTab.value = order.value.createItem(userProvider.currentUser);
    };

    return {
      activeTab,

      addItem,

      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>

<style>
.header {
  height: 30px;
  word-wrap: unset;
}
</style>