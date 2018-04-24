<template>
  <div class="componentWrapper">
    <component
      :is="componentLoader"
      :options="options">
      {{ this.$props.slot }}
    </component>
  </div>
</template>
<script>
export default {
  name: 'ComponentWrapper',
  props: {
    componentFile: {
      type: String,
      default: () => null
    },
    options: {
      type: Array,
      default: () => []
    },
    slot: {
      type: String,
      default: () => null
    }
  },
  computed: {
    componentLoader () {
      return () => import(`./${this.componentFile}`)
    }
  },
  mounted () {
    if (this.$props.componentFile) {
      this.loadComponent()
    }
  },
  methods: {
    loadComponent () {
      this.componentLoader().then(comp => {
        console.log(comp.data)
      })
    }
  }
}
</script>
