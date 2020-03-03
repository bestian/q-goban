<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <h4 :style="{color: hex || 'c9c9c9'}">更新{{myKey}}</h4>
      </div>
      <div class="q-pa-md row items-start q-gutter-md">
        <q-color v-model="hex" no-header no-footer class="my-picker" />
      </div>
      <div class="row">
        <input type='text' name='' v-model='gobans.filter(function(o){ return o.id == $route.params.id })[0].t' placeholder='輸入黑板的簡介' autofocus='true'/>
      </div>
      <div class="row">
        <div class="col-6 col-md-6 col-sm-6">相關黑板： {{myRelated }}</div>
        <div class="col-6 col-md-6 col-sm-6" v-for = "g in gobans" v-bind:key= "g.id">
          <a @click="adRel(g.id)" :class="myRelated.indexOf(g.id) > -1 ? 'yellow' : 'gray'">
            {{ g.id }}
          </a>
        </div>
      </div>
      <div class="row">
        <q-btn color="primary" :label="'更新' + myKey" @click='create(myKey, {
          t: gobans.filter(function(o){ return o.id == $route.params.id })[0].t,
          related: myRelated,
          tags: myTags,
          hex: hex})' v-if='myKey'/>
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
      myKey: '',
      myRelated: [],
      myTags: [],
      hex: '#c9c9c9',
      stars: { goban_intro: 5 }
    }
  },
  methods: {
    adRel: function (id) {
      if (this.myRelated.indexOf(id) > -1) {
        this.myRelated = this.myRelated.filter(function (o) {
          return o !== id
        })
      } else { this.myRelated.push(id) }
    },
    create: function (k, obj) {
      this.$emit('create', k, obj)
    },
    reload: function () {
      this.$emit('reload')
    },
    handleRate: function (g, r) {
      console.log('handleRate')
      console.log(g)
      if (!this.stars[g]) { this.stars[g] = 0 }
      this.stars[g] += r
      if (this.stars[g] === 10) { this.stars[g] = 0 }
      console.log(this.stars)
      this.$q.localStorage.set('stars', this.stars)
      console.log(this.$q.localStorage.getItem('stars'))
      this.$forceUpdate()
    },
    loadStars: function () {
      console.log(this.$q.localStorage.getItem('stars'))
      this.stars = this.$q.localStorage.getItem('stars') || this.stars
    },
    getMyRelated: function () {
      var id = this.$route.params.id
      return this.gobans.filter(function (o) { return o.id === id })[0].related.slice()
    },
    getHex: function () {
      var id = this.$route.params.id
      return this.gobans.filter(function (o) { return o.id === id })[0].hex
    }
  },
  mounted () {
    this.loadStars()
    this.myKey = this.$route.params.id
    this.myRelated = this.getMyRelated()
    this.hex = this.getHex()
  }
}
</script>

<style type="text/css" scoped="">
.yellow {
  color: #dd0;
}
.gray {
  color: gray;
}
</style>
