<template>
  <div :class="['relative-position',isDisplay?'is-display':'']">
    <q-input v-if="hint" v-model.trim="item" @focus="handleFocus" @input="handleInput" @blur="handleBlur" :dense="dense"
      :placeholder="placeholder" :hint="hint" :label="label" :rules="rules" />
    <q-input v-else v-model.trim="item" @focus="handleFocus" @input="handleInput" @blur="handleBlur" :dense="dense"
      :placeholder="placeholder" :label="label" :rules="rules" />
    <q-list v-if="isDisplay" bordered separator :dense="dense" class="list-complete">
      <template v-if="items&&items.length>0">
        <q-item v-for="(e,i) in items" clickable v-ripple :key="i" @click="onSelected(e)">
          <q-item-section>{{e}}</q-item-section>
        </q-item>
      </template>
      <q-item v-else clickable v-ripple>
        <q-item-section>{{noData}}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'auto-complete',
  props: {
    items: { type: Array, default: () => [] },
    value: { type: String, default: '' },
    dense: { type: Boolean, default: true },
    debounce: { type: Number, default: 500 },
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    hint: { type: String, default: null },
    rules: null,
    noData: { type: String, default: 'No data available' }
  },
  data() {
    return {
      isDisplay: false,
      item: ''
    }
  },
  mounted() {
    this.item = this.value
  },
  watch: {
    value: {
      handler(val) {
        this.item = this.value
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleFocus: _.debounce(function(x) {
      this.isDisplay = true
      this.$emit('focus', this.item)
    }, 500),
    handleInput: _.debounce(function() {
      // this.$nextTick(() => {
      this.$emit('update:value', this.item)
      // })
      this.$emit('input', this.item)
      this.isDisplay = true
    }, 500),
    handleBlur() {
      setTimeout(() => {
        this.$emit('blur', this.item)
        this.isDisplay = false
      }, 300)
    },
    onSelected(item) {
      this.item = item
      this.$emit('update:value', item)
    }
  }
}
</script>

<style lang="scss">
.is-display {
  label {
    padding-bottom: 0;
  }
}
.list-complete {
  position: absolute;
  width: 100%;
  z-index: 1;
  background-color: #fff;
  /* bottom: 58px; */
  box-shadow: #ccc 3px 4px 5px;
}
</style>
