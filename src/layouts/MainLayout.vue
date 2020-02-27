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
          <router-link to="/">
            零時黑板
          </router-link>
        </q-toolbar-title>
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
          <router-link :to="'/'">
            <q-icon name = "home" size="lg"/>
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
              | {{name || $route.params.id + $route.params.lev}}
          </router-link>
        </q-item>
        <q-item v-for="(d, index) in data" v-bind:key="d.name">
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
      <router-view :gobans="gobans" :data="data" @create='create' @reload = "reload"/>
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
      gobans: undefined,
      data: [],
      name: ''
    }
  },
  methods: {
    create: function (k) {
      db.ref('gobans/' + k).set(k)
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
  }

  .floating.right {
    float: right;
  }

</style>
