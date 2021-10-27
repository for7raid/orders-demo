<template>
  <div class="grid">
    <div class="col">
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

        <div class="field grid">
          <label for="name" class="col-12 mb-2 md:col-2 md:mb-0"
            >Путь к файлу</label
          >
          <div class="col-12 md:col-10">
            <InputText
              v-model="item.fileName"
              id="name"
              class="inputfield w-full"
            ></InputText>
          </div>
        </div>

        <!-- <div class="field grid">
          <label for="name" class="col-12 mb-2 md:col-2 md:mb-0"
            >Содержание</label
          >
          <div class="col-12 md:col-10">
            <InputText
              v-model="item.content"
              id="name"
              class="inputfield w-full"
            ></InputText>
          </div>
        </div> -->

        <div class="field grid">
          <label for="name" class="col-12 mb-2 md:col-2 md:mb-0">Кол-во</label>
          <div class="col-12 md:col-10">
            <InputNumber v-model="item.count" :min="0" class="p60px" />
          </div>
        </div>

        <div class="field grid">
          <label for="name" class="col-12 mb-2 md:col-2 md:mb-0"
            >Примечания</label
          >
          <div class="col-12 md:col-10">
            <Textarea v-model="item.description" rows="5" cols="100" />
          </div>
        </div>

        <div class="field grid">
          <label for="name" class="col-2">Высота, м.</label>
          <div class="col-1">
            <InputNumber
              class="p60px"
              v-model="item.height"
              :min="0"
              mode="decimal"
              :minFractionDigits="1"
              :maxFractionDigits="1"
            />
          </div>

          <label for="name" class="col-2">Ширина, м.</label>
          <div class="col-1">
            <InputNumber
              class="p60px"
              v-model="item.width"
              :min="0"
              mode="decimal"
              :minFractionDigits="1"
              :maxFractionDigits="1"
            />
          </div>

          <label for="name" class="col-2">Двойная площадь</label>
          <div class="col-1">
            <InputSwitch
              v-model="item.doubleSquare"
              class="inputfield"
            ></InputSwitch>
          </div>

          <span for="name" class="col-3"
            >(S<sub>печати общ.</sub> = {{ item.square }} м2)</span
          >
        </div>

        <div class="field grid">
          <label for="name" class="col-2">Вид материала</label>
          <Dropdown
            class="col-4"
            v-model="item.materialType"
            :options="PrintOrderItem.MaterialTypes"
            :editable="true"
            :showClear="true"
          />

          <label for="name" class="col-2">Тип материала</label>

          <Dropdown
            class="col-4"
            v-model="item.materialSubType"
            :options="PrintOrderItem.MaterialSubTypes"
            :showClear="true"
          />
        </div>

        <div class="field grid">
          <label for="name" class="col-2">Свойства</label>

          <Dropdown
            class="col-4"
            v-model="item.materialProperties"
            :options="PrintOrderItem.MaterialProperties"
            :showClear="true"
          />

          <label for="name" class="col-2">Плотность</label>

          <Dropdown
            class="col-4"
            v-model="item.density"
            :options="PrintOrderItem.Densities"
          />
        </div>

        <div class="field grid">
          <label for="name" class="col-2">Разрешение, dpi</label>

          <Dropdown
            class="col-4"
            v-model="item.resolution"
            :options="PrintOrderItem.Resolutions"
            :editable="true"
          />

          <label for="name" class="col-2">Упаковка</label>

          <Dropdown
            class="col-4"
            v-model="item.wrapping"
            :options="PrintOrderItem.Wrappings"
            :editable="true"
            :showClear="true"
          />
        </div>

        <div class="field grid">
          <label for="name" class="col-2">Цена</label>
          <div class="col-4">
            <InputNumber
              v-model="item.price"
              :min="0"
              mode="decimal"
              :minFractionDigits="1"
              :maxFractionDigits="1"
            />
          </div>

          <span class="col-2">рублей за</span>

          <Dropdown
            class="col-4"
            v-model="item.priceType"
            :options="PrintOrderItem.PriceTypes"
            optionLabel="name"
            optionValue="value"
          />
        </div>

        <div class="field grid">
          <table class="col-8">
            <tr>
              <td><strong>Обработка</strong></td>
              <td>В</td>
              <td>Н</td>
              <td>П</td>
              <td>Л</td>
              <td>*</td>
              <td>Размер, см.</td>
              <td>Цена, р.п.м.</td>
            </tr>
            <tr>
              <td>Люверсы</td>
              <td>
                <Checkbox v-model="item.holes.top" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.holes.bottom" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.holes.right" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.holes.left" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.holes.all" :binary="true" />
              </td>
              <td>
                <InputNumber v-model="item.holes.size" :min="0" class="p60px" />
              </td>
              <td>
                <InputNumber
                  class="p60px"
                  v-model="item.holes.price"
                  :min="0"
                  mode="decimal"
                  :minFractionDigits="1"
                  :maxFractionDigits="1"
                />
              </td>
            </tr>

            <tr>
              <td>Карман</td>
              <td>
                <Checkbox v-model="item.pocket.top" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.pocket.bottom" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.pocket.right" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.pocket.left" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.pocket.all" :binary="true" />
              </td>
              <td>
                <InputNumber
                  v-model="item.pocket.size"
                  :min="0"
                  class="p60px"
                />
              </td>
              <td>
                <InputNumber
                  class="p60px"
                  v-model="item.pocket.price"
                  :min="0"
                  mode="decimal"
                  :minFractionDigits="1"
                  :maxFractionDigits="1"
                />
              </td>
            </tr>
            <tr>
              <td>Проварка</td>
              <td>
                <Checkbox v-model="item.welding.top" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.welding.bottom" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.welding.right" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.welding.left" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.welding.all" :binary="true" />
              </td>
              <td></td>
              <td>
                <InputNumber
                  class="p60px"
                  v-model="item.welding.price"
                  :min="0"
                  mode="decimal"
                  :minFractionDigits="1"
                  :maxFractionDigits="1"
                />
              </td>
            </tr>
            <tr>
              <td>Усиление</td>
              <td>
                <Checkbox v-model="item.strengthening.top" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.strengthening.bottom" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.strengthening.right" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.strengthening.left" :binary="true" />
              </td>
              <td>
                <Checkbox v-model="item.strengthening.all" :binary="true" />
              </td>
              <td></td>
              <td>
                <InputNumber
                  class="p60px"
                  v-model="item.strengthening.price"
                  :min="0"
                  mode="decimal"
                  :minFractionDigits="1"
                  :maxFractionDigits="1"
                />
              </td>
            </tr>
          </table>

          <div class="col-4">
            <label>История работы с макетом</label>

            <div v-for="history in item.history" :key="history.date">
              {{ formatDateTime(history.date) }} {{ history.user.name }}
              {{ getStatusName(history.status) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col">
      <p>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-text align-self-center"
          label="Загрузить превью"
          @click="fileInput.click()"
        />
        <input
          ref="fileInput"
          type="file"
          @change="previewUpload"
          style="display: none"
        />
      </p>
      <Image :src="getPreviewUrl(item.preview.url)" v-if="item.preview.has" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { PrintOrderItem } from "@/entities/print/PrintOrderItem";
import { PrintOrderItemStatus } from "@/entities/print/PrintOrderItemStatus";
import { ImageService } from "@/services/ImageService";

export default defineComponent({
  props: {
    item: {
      required: true,
      type: PrintOrderItem,
    },
  },
  setup(props) {
    const { item } = toRefs(props);
    const fileInput = ref();
    const getStatusName = (statusId: number) => {
      return PrintOrderItemStatus[statusId];
    };

    const previewUpload = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        item.value.preview.url = await ImageService.resize(
          file,
          200000,
          500,
          500
        );
      }
    };

    const getPreviewUrl = (url: string | File | Blob) => {
      if (typeof url === 'string') return url;
      return URL.createObjectURL(url);
    };

    return {
      fileInput,
      getStatusName,
      previewUpload,
      getPreviewUrl,
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
      PrintOrderItem: PrintOrderItem,
    };
  },
});
</script>

<style>
.p60px .p-inputtext {
  width: 60px;
  /* padding: 6px 3px; */
}

.p120px .p-inputtext {
  width: 120px;
  /* padding: 6px 3px; */
}

.field {
  margin-bottom: 3px;
}
</style>