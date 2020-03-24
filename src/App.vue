<template>
  <div id="q-app">
    <router-view :uid="uid" :user ="user" :myUser="myUser" :users="users" :gobans = "gobans" :data="data" @reload="reload" @create="create" @update="update" @loginGoogle = "loginGoogle" @tryIt="tryIt()"/>
  </div>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'
import { db, gobansRef } from './firebase/db'

export default {
  name: 'App',
  data () {
    return {
      gobans: undefined,
      uid: undefined,
      user: undefined, // user object
      users: [],
      myUser: undefined, // user on firebase
      data: [],
      name: ''
    }
  },
  methods: {
    setUser: function (id, obj) {
      console.log(obj)
      if (!this.users[id]) {
        db.ref('users/' + id).set(obj)
      } else {
        this.users.child(id).update(obj)
      }
    },
    tryIt: function () {
      this.user = {
        uid: undefined,
        photoURL: '/static/favicon.png'
      }
    },
    loginGoogle: function () {
      var vm = this
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider).then(function (result) {
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
