<template>
  <div id="app">
    <vuenut :store="$store.state"/>
    <!--<component-wrapper componentFile="Item.vue" options="[Q:'Q11299']"></component-wrapper>-->

    <h2>Q11299 Template P31</h2>
    <Item
      q="Q11299"
      qrussia="Q5513"
      qerik="Q5388622"
      qpostalcode="Q34543"
      languages="en,nl"
      list-type="table"
      template="P31"
      format="leaflet">
      reinier
      <P281 list="table"/>
    </Item>

    <h2>Russia</h2>
    <Item
      q="Q5513"
      qerik="Q5388622"
      qpostalcode="Q34543"
      languages="en,nl"
      list-type="table"/>


  </div>
</template>

<script>
/* @flow */
// eslint-disable-next-line
import Item from './components/Item.vue';
// import componentWrapper from './components/componentWrapper.vue'

// eslint-disable-next-line
import Q1066984 from './components/Q1066984.vue';

export default {
  VueApp: true,
  name: 'App',
  components: {
    Item,
    Q1066984
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
