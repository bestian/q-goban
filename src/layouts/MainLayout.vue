<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          <router-link to="/" class="white">
            <q-icon name="home"/>
          </router-link>
          <span v-if="$route.params.id && gobans.filter(function(o){ return o.id == $route.params.id })[0]"><router-link v-for="r in gobans.filter(function(o){ return o.id == $route.params.id })[0].related" v-bind:key="r" :to ="'/see/' + r + '/0/0'" v-show="r !== $route.params.id" class="white">
              {{ r }}
            </router-link>
          </span>
        </q-toolbar-title>
        <q-space />
        <a class = "white" v-if = "getSrc()" :href="getSrc()" target="_blank">開新頁面</a>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item>
          <router-link :to="'/create'" v-if="!$route.params.id">
            <q-icon name = "edit" size="lg"/>
          </router-link>
          <router-link v-else :to="'/update/' + $route.params.id" >
            <q-icon name = "edit" size="lg"/>
          </router-link>
          <router-link :to="'/list'">
            <q-icon name = "search" size="lg"/>
          </router-link>
          <router-link :to="'/star'">
            <q-icon name = "star" size="lg"/>
          </router-link>
        </q-item>
        <q-item v-if = "$route.params.id">
          <a v-for='j in [0,1,2,3]' :key='j' @click="$router.push('/see/' + $route.params.id + '/' + j + '/0'); reload()"> &nbsp;&nbsp;{{ j }}&nbsp;&nbsp; </a>
        </q-item>
        <q-item v-else>
          請選擇一個黑板
        </q-item>
        <q-item v-if = "$route.params.id">
          <router-link :to="'/see/' + $route.params.id + '/' + $route.params.lev + '/new'">
              <img :src="'https://www.google.com/s2/favicons?domain=https://ethercalc.org/'" width="16" height="16"/>
              | {{name || $route.params.id + ($route.params.lev || '')}}
          </router-link>
        </q-item>
        <q-item v-for="(d, index) in data" v-bind:key="d.name + index">
          <router-link  v-if="d.type == 'link'" v-show='!d.parentIndex || data[d.parentIndex].open' :to="'/see/' + $route.params.id + '/' + $route.params.lev + '/' + index" >

            <img :src="'https://www.google.com/s2/favicons?domain=' + d.url" width="16" height="16"/>
            {{ d.name }}
          </router-link>
          <div v-if="d.type == 'folder'" v-show='!d.parentIndex || data[d.parentIndex].open'>
            <a @click='d.open = !d.open'>
              {{ d.name }}
            </a>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :gobans="gobans" :data="data" @create="create" @update="update" @reload = "reload"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { db, gobansRef } from '../firebase/db'

export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      leftDrawerOpen: false,
      gobans: [],
      data: [],
      name: ''
    }
  },
  methods: {
    create: function (k, obj) {
      console.log(typeof obj)
      if (typeof obj !== 'object') { obj = {} }
      if (!obj.id !== k) { obj.id = k }
      if (!obj.name) { obj.name = k }
      obj.t = obj.t || k
      obj.text = obj.t || k
      obj.related = obj.related || [k]
      obj.tags = obj.tags || [k]
      console.log(obj)
      db.ref('gobans/' + k).set(obj)
      this.$router.push('/see/' + k + '/0/new')
    },
    update: function (k, obj) {
      console.log(typeof obj)
      if (typeof obj !== 'object') { obj = {} }
      obj.name = k
      obj.t = obj.t || this.gobans[k].t
      obj.text = obj.t || this.gobans[k].t
      obj.related = obj.related || this.gobans[k].related
      obj.tags = obj.tags || this.gobans[k].tages
      console.log(obj)
      db.ref('gobans/' + k).set(obj)
      this.$router.push('/see/' + k + '/0/new')
    },
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
    tar: function (x) {
      if ((x.note + '').match(/blank/)) {
        return '_blank'
      } else {
        return 'iframe'
      }
    },
    reload: function () {
      console.log('reload...')
      // GET /someUrl
      this.$http.get('https://ethercalc.org/' + this.$route.params.id + this.$route.params.lev + '.csv.json').then(response => {
        // get body data
        this.data = this.parse(response.body)
        this.$forceUpdate()
      }, response => {
        console.log(response)
        this.data = []
        this.$router.push('/see/' + this.$route.params.id + '/' + this.$route.params.lev + '/new')
      })
    },
    parse: function (d) {
      if (d[1]) { this.name = d[1][1] }
      var ans = d.slice(2)
      var idx
      ans = ans.map(function (l) {
        var obj = {}
        obj.name = l[1]
        obj.url = l[0].replace('%20', '').replace(' ', '')
        obj.note = l[2]
        return obj
      }).filter(function (o) {
        return o.name
      }).map(function (obj, index) {
        if (!obj.url) {
          obj.type = 'folder'
          obj.open = true
          if ((obj.note + '').match(/close/)) {
            obj.open = false
          }
          idx = index
        } else {
          obj.type = 'link'
          obj.parentIndex = idx
        }
        return obj
      })
      console.log(ans)
      return ans
    }
  },
  firebase: {
    gobans: gobansRef
  }
}
</script>

<style type="text/css">

  a, router-link {
    text-decoration: none;
    cursor: pointer;
    margin: 0 .5em;
    font-size: .6em;
  }

  a.white {
    color: white !important;
  }

  .floating.right {
    float: right;
  }

  .sub.header {
    color: grey;
  }

</style>
