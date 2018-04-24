import Pbase from '../Pbase'

const template = `
<span>{{ value[0] }}</span>
`

export default {
  name: 'wdWikibaseitem',
  extends: Pbase,
  created () {
    if (typeof document !== 'undefined') {
      // we are in the browser
      // never do this for now
      this.$options.template = template
      if (document.getElementById(this.$attrs.P)) {
        this.$options.template = '#' + this.$attrs.P
      } else {
        this.render = renderwdWikiBaseItem
      }
    }
  },

  computed: {
    value () {
      const result = {}

      // TODO: Find the formatter URL of the property
      //
      this.values.forEach(function (img, index) {
        try {
          if (img.mainsnak.datavalue.value['entity-type'] === 'item') {
            result[index] = img.mainsnak.datavalue.value.id
          }
        } catch (err) {
          // Check out Q5513 which is a lake with the deepest point as unknown
          // but the value of the qualifier is what you want to render, which is the qualifier P20144
          console.log(
            'TODO: Implements empty values but maybe there is a qualifier?'
          )
        }
      })
      return result
    }
  }
}

function renderwdWikiBaseItem (createElement: Function) {
  console.log('render')
  //  var me = this
  return createElement('div', [
    createElement('p', 'We are in P' + this.$options._componentTag)
  ])
}
