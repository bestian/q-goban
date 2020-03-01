<template>
  <div id="q-app">
    <router-view :gobans = "gobans" :data="data" @reload="reload" @create="create" @update="update"/>
  </div>
</template>

<script>

import { db, gobansRef } from './firebase/db'

export default {
  name: 'App',
  data () {
    return {
      gobans: undefined,
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
