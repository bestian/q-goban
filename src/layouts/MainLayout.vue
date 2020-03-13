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
        <q-space />
        <q-toolbar-title>
          <q-btn-dropdown v-if="$route.params.id && gobans.filter(function(o){ return o.id == $route.params.id })[0]" color="primary" label="相關黑板">
            <q-list>
              <q-item v-for="r in gobans.filter(function(o){ return o.id == $route.params.id })[0].related" v-bind:key="r" :to ="'/see/' + r + '/0/0'" v-show="r !== $route.params.id" :style="{color: gobans.filter(function(o){return o.id == r})[0].hex || 'c9c9c9'}">
                {{ r }}
              </q-item>
            </q-list>
          </q-btn-dropdown>
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
            <q-icon name = "home" size="md"/>
          </router-link>
          <router-link :to="'/create'" v-if="!$route.params.id">
            <q-icon name = "edit" size="md"/>
          </router-link>
          <router-link v-else :to="'/update/' + $route.params.id" :style="{color: gobans.filter(function(o){return o.id == $route.params.id})[0].hex || 'c9c9c9'}">
            <q-icon name = "edit" size="md"/>
          </router-link>
          <router-link :to="'/list'">
            <q-icon name = "search" size="md"/>
          </router-link>
          <router-link :to="'/star'">
            <q-icon name = "star" size="md"/>
          </router-link>
        </q-item>
        <q-item>
          請選擇一個黑板
        </q-item>
        <q-item class="row">
          <input v-autofocus="" type='search' name='' v-model='myKey' placeholder='搜詢黑板' autofocus='true' list="gs"/>
          <datalist id ="gs">
            <option v-for = "g in gobans" v-bind:key = "g.id" :value="g.id"> {{ g.id }} </option>
          </datalist>
        </q-item>
        <q-item v-for = "g in gobans" v-bind:key= "g.id">
          <div class="inner" v-show='!myKey || has(g, myKey)'>
            <router-link :to="'see/' + g.id + '/0/0'" :style="{color: g.hex || 'c9c9c9'}">{{ g.id }}
              <span class="sub header" :style="{color: g.hex || 'c9c9c9'}" v-if="g.t && !u">-{{g.t}}</span>
            </router-link>
            <router-link :to="'/update/' + g.id">
              <q-icon name="build"/>
            </router-link>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :gobans = "gobans" :data = "data" @create = "create" @update = "update" @reload = "reload" :chats= "chats" @submit = "submit"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { db, gobansRef, chatsRef } from '../firebase/db'

export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      leftDrawerOpen: false,
      gobans: [],
      chats: [],
      data: [],
      name: '',
      myKey: '',
      myText: '',
      u: false,
      stars: { goban_intro: 5 }
    }
  },
  methods: {
    submit: function (n, email, t) {
      var o = {
        n: n,
        email: email,
        t: t,
        time: (new Date()).getTime()
      }
      if (t) {
        this.$firebaseRefs.chats.push(o)
        window.alert('留言已送出')
      } else {
        window.alert('請輸入留言')
      }
    },
    has: function (g, k) {
      var r = new RegExp(k)
      return r.test(g.id)
    },
    create: function (k, obj) {
      console.log(typeof obj)
      if (typeof obj !== 'object') { obj = {} }
      if (!obj.id !== k) { obj.id = k }
      if (!obj.name) { obj.name = k }
      obj.t = obj.t || k
      obj.text = obj.t || k
      obj.related = obj.related || [k]
      obj.tags = obj.tags || [k]
      obj.use_lev = true
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
    op: function (url) {
      window.open(url, '_system')
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
    gobans: gobansRef,
    chats: chatsRef
  },
  watch: {
    '$route' (to, from) {
      this.reload()
    }
  }
}
</script>

<style type="text/css">
</style>
