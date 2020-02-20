<template>
  <div id="q-app">
    <router-view :gobans = "gobans"/>
  </div>
</template>

<script>

import { db, gobansRef } from './firebase/db'

export default {
  name: 'App',
  data () {
    return {
      gobans: undefined
    }
  },
  methods: {
    create: function (k) {
      db.ref('gobans/' + k).set(k)
    }
  },
  firebase: {
    gobans: gobansRef
  }
}

</script>
