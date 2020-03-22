<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row justify-center">
      <h4>留言板</h4>
      <div style="width: 100%; max-width: 400px">
        <q-chat-message
          v-for = "c in chats" :key = "c.time"
          :name="c.n"
          avatar="../assets/quasar-logo-full.svg"
          :stamp="parseTime(c.time)"
        ><vue-simple-markdown :source="c.t"></vue-simple-markdown></q-chat-message>
      </div>

      <q-btn v-if = "!user" color="deep-orange" @click = "loginGoogle()">以Google登入</q-btn>
      <q-form
          v-else
          @submit="submit(myName, myEmail, myText)"
          class="q-gutter-md">
        <q-input
          filled
          v-model="myName"
          label="Your name"
        />
        <q-input
          filled
          type="email"
          v-model="myEmail"
          label="Your Email"
        />

        <q-input
          filled
          type="text"
          v-model="myText"
          label="Your Text"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'PageIndex',
  props: ['chats', 'user'],
  data () {
    return {
      myName: '訪客',
      myEmail: '',
      myText: ''
    }
  },
  methods: {
    loginGoogle: function () {
      this.$emit('loginGoogle')
    },
    submit: function (n, email, t) {
      this.myName = '訪客'
      this.myEmail = ''
      this.myText = ''
      this.$emit('submit', n, email, t)
    },
    parseTime: function (t) {
      return (new Date(t)).toLocaleDateString()
    },
    has: function (g, k) {
      var r = new RegExp(k)
      return r.test(g.id)
    },
    create: function (k, obj) {
      this.$emit('create', k, obj)
    },
    update: function (k, obj) {
    },
    reload: function () {
      this.$emit('reload')
    },
    handleRate: function (g, r) {
      if (!this.stars[g]) { this.stars[g] = 0 }
      if (this.stars[g] === r) {
        this.stars[g] = 0
      } else {
        this.stars[g] = r
      }
      this.$q.localStorage.set('stars', this.stars)
      console.log(this.$q.localStorage.getItem('stars'))
      this.$forceUpdate()
    },
    loadStars: function () {
      console.log(this.$q.localStorage.getItem('stars'))
      if (this.$q.localStorage.getItem('stars') && this.$q.localStorage.getItem('stars').goban_intro) {
        this.stars = this.$q.localStorage.getItem('stars') || this.stars
      } else {
        this.$q.localStorage.set('stars', this.stars)
      }
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
.sub.header {
  color: gray;
}
h4 {
  margin: 0;
  font-size: 1.6em;
  display: inline;
}
.block .inner {
  border: 1px solid black;
  padding: .5em;
}
li {
  display: inline-block;
}
input {
  margin: 1em 1em
}

</style>
