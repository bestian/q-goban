<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      {{ data }}
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  props: ['gobans', 'data'],
  data () {
    return {
      myKey: ''
    }
  },
  methods: {
    create: function (k) {
      this.$emit('create', k)
    },
    reload: function () {
      this.$emit('reload')
    }
  },
  mounted () {
    this.reload()
  }
}
</script>
