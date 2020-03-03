<template>
  <q-page class="flex flex-center">
    <!--<iframe width="100%" height="600" name='iframe' :src='getSrc()'/>-->
    <a class="link" size="lg" v-if = "getSrc()" @click="op(getSrc())">{{getSrc()}}</a>
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
    getSrc: function () {
      if (this.$route.params.index === 'new') {
        return 'https://ethercalc.org/' + this.$route.params.id + this.$route.params.lev
      } else {
        if (this.data[this.$route.params.index]) {
          return this.data[this.$route.params.index].url
        }
      }
      return undefined
    },
    op: function (url) {
      window.open(url, '_system')
    },
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

<style type="text/css" scoped="">
a.link {
  text-decoration: underline;
  color: blue;
}
</style>
