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

        <div class="card">
          <div class="field grid">
            <label for="name" class="col-12 mb-2 md:col-2 md:mb-0"
              >Название</label
            >
            <div class="col-12 md:col-10">
              <InputText
                v-model="item.name"
                id="name"
                class="inputfield w-full"
              ></InputText>
            </div>
          </div>

          <Panel header="Демонстрация">
            Остальной функционал в разработке, откройте закат типа УФ
          </Panel>
        </div>
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
import { defineComponent, ref, toRefs } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import PrintGeneralInfo from "@/components/print/GeneralInfo.vue";
import { PrintOrder } from "@/entities/print/PrintOrder";

export default defineComponent({
  components: { PrintGeneralInfo },
  props: {
    order: {
      required: true,
      type: PrintOrder,
    },
  },
  setup(props) {
    const { order } = toRefs(props);
    const activeTab = ref(0);
    const addItem = () => {
      activeTab.value = order.value.createItem();
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