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
          零時黑板
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
        <q-item-label header class="text-grey-8">Goban</q-item-label>
        <q-item v-for = "g in Object.keys(gobans)" v-bind:key= "g">
          {{ g }}
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :gobans="gobans" />
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
