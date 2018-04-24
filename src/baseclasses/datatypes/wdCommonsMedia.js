import Pbase from '../Pbase';

const template = `
<img heigth="100px" width="100px" :src="urls[0]" />
`;

export default {
  name: 'wdCommonsMedia',
  extends: Pbase,
  beforeCreate() {
    console.log('in wdCommonsMedia');
    this.$options.template = template;
    if (typeof document !== 'undefined') {
      // we are in the browser
      if (document.getElementById(this.$attrs.P)) {
        this.$options.template = '#' + this.$attrs.P;
      } else {
        this.render = renderwdWikiBaseItem;
      }
    }
  },
  computed: {
    urls() {
      const result = {};
      this.values.forEach(function(img, index) {
        result[index] =
          'https://commons.wikimedia.org/w/thumb.php?width=500&f=' +
          img.mainsnak.datavalue.value;
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
