<template>
  <div :class="['relative-position',isDisplay?'is-display':'']">
    <q-input v-if="hint" v-model.trim="item" @focus="handleFocus" @input="handleInput" @blur="handleBlur" :dense="dense"
      :placeholder="placeholder" :hint="hint" :label="label" :rules="rules">
      <template v-if="slotPrepend" v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="slotAppend" v-slot:append>
        <slot name="append"></slot>
      </template>
    </q-input>
    <q-input v-else v-model.trim="item" @focus="onFocus" @input="onInput" @blur="onBlur" :dense="dense"
      :placeholder="placeholder" :label="label" :rules="rules">
      <template v-if="slotPrepend" v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="slotAppend" v-slot:append>
        <slot name="append"></slot>
      </template>
    </q-input>
    <q-list v-if="isDisplay" bordered separator :dense="dense" class="list-complete">
      <template v-if="data&&data.length>0">
        <q-item v-for="(e,i) in data" clickable v-ripple :key="i" @click="onSelected(e)">
          <q-item-section>{{e}}</q-item-section>
        </q-item>
      </template>
      <q-item v-else clickable v-ripple>
        <q-item-section>{{labelNoData}}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'auto-complete',
  props: {
    data: { type: Array, default: () => [] },
    value: { type: String, default: '' },
    dense: { type: Boolean, default: true },
    debounce: { type: Number, default: 500 },
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    hint: { type: String, default: null },
    rules: null,
    isNoData: { type: Boolean, default: false },
    labelNoData: { type: String, default: 'No data available' }
  },
  data() {
    return {
      isFirst: false,
      isDisplay: false,
      item: ''
    }
  },
  mounted() {
    // this.item = this.value
  },
  watch: {
    value: {
      handler(val) {
        this.item = this.value
        // console.log(val)
      },
      deep: true,
      immediate: true
    }
    // item(val) {
    //   console.log(val)
    // }
  },
  computed: {
    slotPrepend() {
      return !!this.$slots['prepend']
    },
    slotAppend() {
      return !!this.$slots['append']
    }
  },
  methods: {
    onFocus: _.debounce(function(x) {
      if (this.isFirst) {
        // this.isDisplay = true
        this.checkDisplay()
        this.$emit('focus', this.item)
      } else this.isFirst = true
    }, 500),
    onInput: _.debounce(function() {
      // this.$nextTick(() => {
      this.$emit('input', this.item)
      // })
      // this.$emit('input', this.item)
      // this.isDisplay = true
      this.checkDisplay()
    }, 500),
    onBlur() {
      setTimeout(() => {
        this.$emit('blur', this.item)
        this.isDisplay = false
      }, 300)
    },
    onSelected(item) {
      this.item = item
      // this.$emit('update:value', item)
      this.$emit('input', item)
    },
    checkDisplay() {
      if (this.isNoData) {
        if (this.data && this.data.length) this.isDisplay = true
        else this.isDisplay = false
      } else {
        this.isDisplay = true
      }
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
