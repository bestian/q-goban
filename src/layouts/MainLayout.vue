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
          <q-btn-dropdown v-if="$route.params.id && gobans.filter(function(o){ return o.id == $route.params.id })[0]" color="primary" label="相關棋盤">
            <q-list>
              <q-item v-for="r in gobans.filter(function(o){ return o.id == $route.params.id })[0].related" v-bind:key="r" :to ="'/see/' + r + '/0/0'" v-show="r !== $route.params.id">
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
          <router-link v-else :to="'/update/' + $route.params.id">
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
          請選擇一個棋盤
        </q-item>
        <q-item class="row">
          <input v-autofocus="" type='search' name='' v-model='myKey' placeholder='搜詢棋盤' autofocus='true' list="gs"/>
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
      <router-view :uid="uid" :user ="user" :myUser="myUser" :users="users" :gobans = "gobans" :data = "data" @create = "create" @update = "update" @reload = "reload" :chats= "chats" @submit = "submit" @loginGoogle = "loginGoogle" @tryIt="tryIt()"/>
    </q-page-container>
  </q-layout>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'
import { db, gobansRef, chatsRef } from '../firebase/db'

export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      leftDrawerOpen: false,
      gobans: [],
      uid: undefined,
      user: undefined, // user object
      users: [],
      myUser: undefined, // user on firebase
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
    tryIt: function () {
      this.user = {
        uid: undefined,
        user: {
          id: 'guest',
          name: 'guest',
          photoURL: '/static/favicon.png'
        },
        photoURL: '/static/favicon.png'
      }
    },
    setUser: function (id, obj) {
      console.log(obj)
      if (!this.users[id]) {
        db.ref('users/' + id).set(obj)
      } else {
        this.users.child(id).update(obj)
      }
    },
    loginGoogle: function () {
      var vm = this
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        vm.provider = 'google'
        vm.token = result.credential.accessToken
        // The signed-in user info.
        vm.uid = result.user.uid
        vm.user = result.user
        vm.photoURL = vm.user.photoURL

        var obj = {
          id: vm.uid,
          name: vm.user.displayName,
          photoURL: vm.photoURL,
          email: vm.user.email
        }
        vm.setUser(vm.uid, obj)
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        console.log(errorCode + errorMessage + email + credential)
      })
    },
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.user = null
      }).catch(err => console.log(err))
    },
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
      obj.use_lev = obj.use_lev || false
      console.log(obj)
      db.ref('gobans/' + k).set(obj)
      this.$router.push('/see/' + k + '/0/new')
    },
    update: function (k, obj) {
      console.log(typeof obj)
      if (typeof obj !== 'object') { obj = {} }
      obj.uid = this.uid
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
        return 'https://ethercalc.org/' + this.$route.params.id + (this.$route.params.lev || '')
      } else {
        if (!this.mydata[0]) { return undefined }
        if (this.mydata[this.$route.params.index]) {
          return decodeURIComponent(this.mydata[this.$route.params.index].url)
        }
      }
      return undefined
    },
    srcURL: function () {
      var ans
      if (this.gobans && this.gobans[this.$route.params.id] && this.gobans[this.$route.params.id].use_lev) {
        ans = 'https://ethercalc.org/' + this.$route.params.id + (this.$route.params.lev === '_' ? '' : this.$route.params.lev) + '.csv.json'
      } else {
        ans = 'https://ethercalc.org/' + this.$route.params.id + '.csv.json'
      }
      return ans
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
      this.$http.get(this.srcURL()).then(response => {
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
    },
    'gobans' (to, from) {
      this.reload()
    }
  },
  mounted () {
    this.tryIt()
  }
}
</script>

<style type="text/css">
</style>
