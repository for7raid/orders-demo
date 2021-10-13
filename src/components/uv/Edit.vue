<template>
  <div>
    <TabView v-model:activeIndex="activeTab" lazy>
      <TabPanel>
        <template #header> Общие сведения </template>
        <GeneralInfo :order="order" />
      </TabPanel>
      <TabPanel v-for="object in order.objects" :key="object.id">
        <template #header>
          {{ object.index }}.
          {{ object.name || "[Без названия " + object.index + "]" }}
        </template>
        <UVOrderObjectComponent
          :object="object"
          :order="order"
          @remove-object="reomveObject"
        />
      </TabPanel>
    </TabView>
  </div>
  <teleport to=".p-tabview-nav">
    <Button
      icon="pi pi-plus"
      class="p-button-rounded p-button-text align-self-center"
      style="margin-top: 5px"
      title="Добавить объект"
      @click="addObject"
    />
  </teleport>
</template>


<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { UVOrder } from "@/entities/uv/UVOrder";
import GeneralInfo from "@/components/uv/GeneralInfo.vue";
import UVOrderObjectComponent from "@/components/uv/UVOrderObject.vue";
import { UVOrderObject } from "@/entities/uv/UVOrderObject";

export default defineComponent({
  components: { GeneralInfo, UVOrderObjectComponent },
  props: {
    order: {
      required: true,
      type: UVOrder,
    },
  },
  setup(props) {
    const { order } = toRefs(props);
    const activeTab = ref(0);

    const addObject = () => {
      activeTab.value = order.value.createObject();
    };

    const reomveObject = (object: UVOrderObject) => {
      const index = order.value.objects.indexOf(object);
      if (index > -1) {
        order.value.objects.splice(index, 1);
        activeTab.value = 0;
      }
    };

    return {
      activeTab,

      addObject,
      reomveObject,

      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>