<template>
  <q-page class="flex flex-center">

    <div class="q-pa-md">
      <div class="row">
        <div class="col-4 col-md-6" v-for = "g in Object.keys(gobans)" v-bind:key= "g">
          {{ g }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  props: ['gobans']
}
</script>
