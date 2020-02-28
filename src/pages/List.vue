<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <h4>搜詢黑板</h4>
      </div>
      <div class="row">
        <input v-autofocus="" type='search' name='' v-model='myKey' placeholder='搜詢黑板' autofocus='true'/>
      </div>
      <div class="row">
        <div class="col-6 col-md-6 col-sm-6" v-for = "g in Object.keys(gobans)" v-bind:key= "g" v-show='!myKey || g.match(new RegExp(myKey))'>
          <router-link :to="'see/' + g + '/0/0'">
            <q-icon name = "font_download" />
            {{ g }}
          </router-link>
          <a @click="handleRate(g, 5)">
            <q-icon name = "star" size="sm" :class="stars[g] ? 'yellow' : 'gray'" />
          </a>
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
      myKey: '',
      stars: { goban_intro: 5 }
    }
  },
  methods: {
    create: function (k) {
      this.$emit('create', k)
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
    }
  },
  mounted () {
    this.loadStars()
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
