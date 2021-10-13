<template>
  <div class="card">
    <h3 v-if="order.id">Заказ №{{ order.id }}</h3>

    <div class="field grid">
      <label for="isCalculating" class="col-12 mb-2 md:col-2 md:mb-0"
        >Предварительный обсчёт</label
      >
      <div class="col-12 md:col-10">
        <InputSwitch
          v-model="order.isCalculating"
          id="isCalculating"
          class="inputfield"
        ></InputSwitch>
      </div>
    </div>

    <Divider />

    <div class="field grid">
      <label for="name" class="col-12 mb-2 md:col-2 md:mb-0">Название</label>
      <div class="col-12 md:col-10">
        <InputText
          v-model="order.name"
          id="name"
          class="inputfield w-full"
        ></InputText>
      </div>
    </div>

    <Divider />

    <div class="field grid">
      <label for="client" class="col-12 mb-2 md:col-2 md:mb-0">Клиент</label>
      <div class="col-12 md:col-10">
        <Dadata
          v-model="order.client"
          mode="party"
          @item-select="companySelected('client', $event)"
        />
      </div>
    </div>

    <div class="field grid">
      <label for="clientAddress" class="col-12 mb-2 md:col-2 md:mb-0"
        >Адрес</label
      >
      <div class="col-12 md:col-10">
        <Dadata v-model="order.clientAddress" mode="address" />
      </div>
    </div>

    <div class="field grid">
      <label for="clientContacts" class="col-12 mb-2 md:col-2 md:mb-0"
        >Контактное лицо</label
      >
      <div class="col-12 md:col-10">
        <InputText
          v-model="order.clientContacts"
          id="clientContacts"
          class="inputfield w-full"
        ></InputText>
      </div>
    </div>

    <Divider />

    <div class="field grid">
      <label for="receiver" class="col-12 mb-2 md:col-2 md:mb-0"
        >Получатель</label
      >
      <div class="col-12 md:col-10">
        <Dadata
          v-model="order.receiver"
          mode="party"
          @item-select="companySelected('receiver', $event)"
        />
      </div>
    </div>

    <div class="field grid">
      <label for="receiverAddress" class="col-12 mb-2 md:col-2 md:mb-0"
        >Адрес</label
      >
      <div class="col-12 md:col-10">
        <Dadata v-model="order.receiverAddress" mode="address" />
      </div>
    </div>

    <div class="field grid">
      <label for="receiverContacts" class="col-12 mb-2 md:col-2 md:mb-0"
        >Контактное лицо</label
      >
      <div class="col-12 md:col-10">
        <InputText
          v-model="order.receiverContacts"
          id="receiverContacts"
          class="inputfield w-full"
        ></InputText>
      </div>
    </div>

    <Divider />

    <div class="field grid">
      <label for="receiver" class="col-12 mb-2 md:col-2 md:mb-0"
        >Примечания</label
      >
      <div class="col-12 md:col-10">
        <Textarea
          v-model="order.description"
          :autoResize="true"
          rows="5"
          class="inputfield w-full"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { UVOrder } from "@/entities/uv/UVOrder";
import Dadata from '@/components/Dadata.vue';

export default defineComponent({
  components: { Dadata },
  props: {
    order: {
      required: true,
      type: UVOrder,
    },
  },
  setup(props) {
    const { order } = toRefs(props);
    const companySelected = (mode: string, event: any) => {
      const address = event.value.data.address.value;
      (order.value as any)[mode + "Address"] = address;
    };

    return {
      companySelected,

      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>