<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <h4>創建黑板</h4>
      </div>
      <br/>
      <div class="row">
        <input v-autofocus="" type='search' name='' v-model='myKey' placeholder='輸入黑板的id' autofocus='true'/>
      </div>
      <div class="row" v-show = "myKey">
        <div class="col-6 col-md-6 col-sm-6" v-for = "g in gobans" v-bind:key= "g.id" v-show='g.id.match(new RegExp(myKey))'>
          <a @click="myKey = g.id; myText=g.t; myRelated=g.related; mytags=g.tags">
            <q-icon name = "font_download" />
            {{ g.id }}
          </a>
        </div>
      </div>
      <div class="row">
        <h4 :style="{color: hex || 'c9c9c9'}">
          <q-icon name = "font_download" />
          {{ myKey }}
        </h4>
      </div>
      <div class="q-pa-md row items-start q-gutter-md">
        <q-color v-model="hex" no-header no-footer class="my-picker" />
      </div>
      <div class="row">
        <input type='text' name='' v-model='myText' placeholder='輸入黑板的簡介' autofocus='true'/>
      </div>
      <div class="row">
        <div class="col-6 col-md-6 col-sm-6">相關黑板： {{ myRelated }}</div>
        <div class="col-6 col-md-6 col-sm-6" v-for = "g in gobans" v-bind:key= "g.id">
          <a @click="adRel(g.id)">
            <input type ="checkbox" :checkd ="myRelated.indexOf(g.id) > -1" />
            {{ g.id }}
          </a>
        </div>
      </div>
      <div class="row">
        <q-btn color="primary" :label="'創建' + myKey" @click='create(myKey, {
          t: myText,
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
      myText: '',
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
