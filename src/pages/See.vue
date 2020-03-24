<template>
  <q-page class="flex flex-center">
    <!--<iframe width="100%" height="600" name='iframe' :src='getSrc()'/>-->
    <q-list>
      <q-btn-dropdown v-if = "gobans && gobans[$route.params.id] && gobans.filter(function(o){return o.id == $route.params.id})[0].use_lev" color="primary" :label="'等級'+$route.params.lev">
        <q-list>
          <q-item v-for='j in [0,1,2,3]' :key='j' >
            <a @click="$router.push('/see/' + $route.params.id + '/' + j + '/0'); reload()"> 等級{{ j }}</a>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-item v-if = "$route.params.id">
        <a @click="op(getTarget(gobans.filter(function(o){return o.id == $route.params.id})[0].use_lev))" :style="{color: gobans.filter(function(o){return o.id == $route.params.id})[0].hex || 'c9c9c9'}">
            <img :src="'https://www.google.com/s2/favicons?domain=https://ethercalc.org/'" width="16" height="16"/>
            | {{gobans.filter(function(o){return o.id == $route.params.id})[0].t}} - {{name || $route.params.id + ($route.params.lev || '')}}
            <q-icon name = "edit"/>
        </a>
      </q-item>
      <q-item v-for="(d, index) in data" v-bind:key="d.name + index">
        <div v-if="d.type == 'folder'" v-show='!d.parentIndex || data[d.parentIndex].open'>
          <a @click='d.open = !d.open'>
            <q-icon name = "folder"/>
            {{ d.name }}
            <span v-if = "!d.open">
              +
            </span>
            <span v-else>
              -
            </span>
          </a>
        </div>
        <a class = "link" v-else @click = "op(d.url)" v-show="!d.parentIndex || data[d.parentIndex].open">
          <img :src="'https://www.google.com/s2/favicons?domain=' + d.url" width="16" height="16"/>
          {{ d.name }}
        </a>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  props: ['gobans', 'data'],
  data () {
    return {
      myKey: '',
      name: ''
    }
  },
  methods: {
    getTarget: function (useLev) {
      var ans
      if (useLev) {
        ans = 'https://ethercalc.org/' + this.$route.params.id + (this.$route.params.lev || '')
      } else {
        ans = 'https://ethercalc.org/' + this.$route.params.id
      }
      return ans
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
    create: function (k) {
      this.$emit('create', k)
    },
    reload: function () {
      this.$emit('reload')
    }
  },
  mounted () {
  }
}
</script>

<style type="text/css" scoped="">
a.link {
  text-decoration: underline;
  color: blue;
  margin-left: 1em;
}

.q-item {
  min-height: 0;
  padding: 0;
}
</style>
