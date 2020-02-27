<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <h1>收集並分享網址</h1>
      </div>
      <div class="row">
        <input v-autofocus="dynamicvalue" type='search' name='' v-model='myKey' placeholder='搜詢黑板' autofocus='true'/>
        <q-btn color="primary" :label="'創建' + myKey" @click='create(myKey)' v-if='myKey'/>
      </div>
      <div class="row">
        <div class="col-6 col-md-6 col-sm-6" v-for = "g in Object.keys(gobans)" v-bind:key= "g" v-show='!myKey || g.match(new RegExp(myKey))'>

          <router-link :to="'see/' + g + '/0/0'">
            <q-icon name = "font_download" />
            {{ g }}
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  props: ['gobans'],
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
  }
}
</script>
