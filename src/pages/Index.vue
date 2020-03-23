<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h4>讓知識星棋羅列</h4>
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <router-link to="/create"><q-item-label>
            <q-icon name="edit"/>創建</q-item-label></router-link>
        </q-item>
        <q-item clickable v-ripple>
          <router-link to="/list"><q-item-label>
            <q-icon name="search"/>搜詢</q-item-label></router-link>
        </q-item>
        <q-item clickable v-ripple>
          <router-link to="/star"><q-item-label>
            <q-icon name="star"/>珍藏</q-item-label></router-link>
        </q-item>
        <q-item clickable v-ripple>
          <router-link to="/intro"><q-item-label>
            <q-icon name="info"/>導覽</q-item-label></router-link>
        </q-item>
        <q-item clickable v-ripple>
          <router-link to="/chat"><q-item-label>
            <q-icon name="chat"/>留言板</q-item-label></router-link>
        </q-item>
      </q-list>
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
.q-item {
  font-size: 1.6em !important;
}

</style>
