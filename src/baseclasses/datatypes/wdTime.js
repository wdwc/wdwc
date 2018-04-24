import Pbase from '../Pbase';
import wdk from 'wikidata-sdk';

const template = `
<span>{{ value[0] }}</span>
`;

export default {
  name: 'wdTime',
  extends: Pbase,
  beforeCreate() {
    if (typeof document !== 'undefined') {
      // we are in the browser
      this.$options.template = template;
      if (document.getElementById(this.$attrs.P)) {
        this.$options.template = '#' + this.$attrs.P;
      } else {
        this.render = renderwdWikiBaseItem;
      }
    }
  },
  computed: {
    value() {
      const result = {};

      // TODO: Find the formatter URL of the property
      //
      this.values.forEach(function(img, index) {
        result[index] = wdk.wikidataTimeToSimpleDay(
          img.mainsnak.datavalue.value
        );
      });
      return result;
    }
  }
};

function renderwdWikiBaseItem(createElement: Function) {
  console.log('render');
  return createElement('div', [
    createElement('p', 'We are in P' + this.$options._componentTag)
  ]);
}
