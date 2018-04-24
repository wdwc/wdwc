<template>
  <table>
    <th colspan="2">
      {{ label }}
    </th>
    <tr>
      <td colspan="2">
        {{ description }}
      </td>
    </tr>
    <tr
      v-for="prop in Pkeys"
      :key="prop.name" >
      <td> {{ prop }} </td>
      <td> {{ Plabels[prop][languages[0]].value }} </td>
      <td> <Property
        :q="q"
        :p="prop"/> </td>
    </tr>

  </table>
</template>

<script>
import QTemplate from '../baseclasses/QTemplate'
import Property from './Property'

export default {
  name: 'All',
  components: { Property },
  extends: QTemplate
}
</script>
