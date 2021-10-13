

<template>
  <span class="p-fluid"
    ><AutoComplete
      v-model="modelValue"
      :suggestions="filteredItems"
      field="value"
      @complete="search"
      @item-select="itemSelect"
      @clear="clear"
    >
      <template #item="slotProps">
        <div
          v-if="mode == 'party'"
          :class="{
            'line-through': slotProps.item.data.state.status != 'ACTIVE',
          }"
        >
          {{ slotProps.item.value }} [ИНН {{ slotProps.item.data.inn }},
          {{ slotProps.item.data.address.value }}]
        </div>
      </template>
    </AutoComplete></span
  >
</template>
<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
export default defineComponent({
  name: "Dadata",
  props: {
    mode: String,
    modelValue: String,
  },
  emits: ["item-select", "update:modelValue"],
  setup(props, { emit }) {
    const filteredItems = ref<String[]>([]);
    const { modelValue } = toRefs(props);
    const mode = props.mode;

    const search = async (event: any) => {
      const res = await getDadata(event.query);
      filteredItems.value = [...res.suggestions];

      emit("update:modelValue", event.query);
    };

    const getDadata = (query: string) => {
      return fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/" + mode,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            "Content-Type": "application/json",
            authorization: "Token b992cb5e385d369892106844e7dc88d34c5dcc62",
          },
          body: JSON.stringify({
            query,
            count: 5,
          }),
        }
      ).then((r) => r.json());
    };

    const itemSelect = (event: any) => {
      const value =
        typeof event.value === "string"
          ? event.value
          : mode == "party"
          ? event.value.value + " " + event.value.data.inn
          : event.value.value;

      emit("update:modelValue", value);
      emit("item-select", event);
    };

    const clear = () => emit("update:modelValue", "");

    return { modelValue, mode, filteredItems, search, itemSelect, clear };
  },
});
</script>