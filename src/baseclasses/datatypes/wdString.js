import Pbase from '../Pbase';

const template = `
<span>{{ value[0] }}</span>
`;

export default {
  name: 'wdString',
  extends: Pbase,
  beforeCreate() {
    if (typeof document !== 'undefined') {
      this.$options.template = template;
      // we are in the browser
      if (document.getElementById(this.$attrs.P)) {
        this.$options.template = '#' + this.$attrs.P;
      } else {
        this.render = renderwdString;
      }
    }
  },
  computed: {
    value() {
      const result = {};

      // TODO: Find the formatter URL of the property
      //
      this.values.forEach(function(img, index) {
        result[index] = img.mainsnak.datavalue.value;
      });
      return result;
    }
  }
};

function renderwdString(createElement: Function) {
  console.log('render');
  return createElement('div', [
    createElement('p', 'We are in P' + this.$options._componentTag)
  ]);
}
