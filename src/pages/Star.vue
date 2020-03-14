<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <h3>我的珍藏</h3>
      </div>
      <div class="row">
        <input v-autofocus="" type='search' name='' v-model='myKey' placeholder='搜詢黑板' autofocus='true' />
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 col-md-12 col-sm-12 block" v-for = "g in gobans" v-bind:key= "g.id">
          <div class="inner" v-if = "stars[g.id] > 0" v-show='has(g,myKey)'>
            <router-link :to="'/see/' + g.id + '/0/0'">
              <h4>{{ g.id }}</h4>
              <span class="sub header" v-if="g.t && !u">-{{g.t}}</span>
            </router-link>
            <span v-if="g.t && !u"></span>
            <input v-else @keydown.enter="update(g, g)" v-model="g.t" />
            <a @click="u = !u">
              <q-icon name="edit"/>
            </a>
            <a @click="handleRate(g.id, 5)">
              <q-icon name = "star" size="sm" :class="stars[g.id] ? 'yellow' : 'gray'" />
            </a>
            <br/>相關黑板:
                <router-link :to="'/update/' + g.id">
                  <q-icon name="edit"/>
                </router-link>
            <ol>
              <li v-for="r in g.related" v-show ="r != g.id" v-bind:key="r">
                <router-link :to="'/see/' + r + '/0/0'" class="sub header"> {{ r }}
                </router-link>
              </li>
            </ol>
          </div>
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
    has: function (g, k) {
      var r = new RegExp(k)
      return r.test(g.id)
    },
    create: function (k) {
      this.$emit('create', k)
    },
    reload: function () {
      this.$emit('reload')
    },
    handleRate: function (g, r) {
      if (!this.stars[g]) { this.stars[g] = 0 }
      if (this.stars[g] === r) {
        this.stars[g] = 0
      } else {
        this.stars[g] = r
      }
      this.$q.localStorage.set('stars', this.stars)
      console.log(this.$q.localStorage.getItem('stars'))
      this.$forceUpdate()
    },
    loadStars: function () {
      console.log(this.$q.localStorage.getItem('stars'))
      if (this.$q.localStorage.getItem('stars') && this.$q.localStorage.getItem('stars').goban_intro) {
        this.stars = this.$q.localStorage.getItem('stars') || this.stars
      } else {
        this.$q.localStorage.set('stars', this.stars)
      }
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
h4 {
  font-size: 1.6em;
  margin: 0;
  display: inline;
}

.block .inner {
  border: 1px solid black;
  padding: .5em;
}

li {
  display: inline-block;
}

</style>
