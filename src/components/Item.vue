

<script>
/* @flow */
// import { mapGetters } from 'vuex'

import store from '../store';
import { LIST_TYPES } from '../globals/consts';

import wdk from 'wikidata-sdk';
// eslint-disable-next-line
import all from './all.vue';

/**
 * An original Wikidata Q item
 * @class Item
 * @param {string} q - Wikidata Q value
 * @param {string=} template - css identifier of a template that is part of the current html page. Must start with an '#'
 * @param {Array} languages -
 * Comma seperated list of 2 or 3-digit language codes. Default is 'en'.
 * A full list can be found at https://www.wikidata.org/wiki/Help:Wikimedia_language_codes/lists/all
 * @param {LIST_TYPES} [listType=table] -
 * A template that is used to seperate properties. If no #template is provided, this will apply to both
 * properties, as well as values within multi-value properties.
 */

export default {
  name: 'Item',
  components: { all },
  props: {
    q: {
      type: String,
      required: false,
      default: '',
      validator(value: string) {
        let result = true;
        result =
          result &&
          value.charAt(0) === 'Q' &&
          !isNaN(value.substring(1, value.length));
        return result;
      }
    },
    template: {
      type: String,
      default() {
        console.log(
          'All is a nice default, but what if there is an x-template available. can we auto-detect that?'
        );
        return 'all';
      },
      required: false,
      validator(value: string) {
        const result = true;
        console.log('Check somehow that the template exists?', value);
        return result;
      }
    },
    languages: {
      type: String,
      default() {
        return 'en';
      },
      required: false,
      validator(value: string) {
        if (value.length === 0) {
          value = 'en';
          // return true;
        }
        // check if every language is 2 characters
        const list = value.split(',');
        let result = true;
        for (let i = 0; i < list.length; i++) {
          result = (result && list[i].length === 2) || list[i].length === 3;
        }
        return result;
      }
    },
    listType: {
      type: String,
      default: 'table',
      required: false,
      validator(value: string) {
        const result = LIST_TYPES.indexOf(value) > -1;
        if (!result) {
          console.error(
            'list-type is not any of the values ' + LIST_TYPES.join(', ')
          );
        }
        return result;
      }
    }
  },
  computed: {
    // Mapgetters is not playing nice with our webcomponents
    //    ...mapGetters(['pending', 'wdProperties']),
    //
    wdProperties: {
      cache: false,
      get() {
        return this.$store.getters['wdProperties'];
      }
    },
    _languages() {
      return this.languages.split(',');
    },
    _template() {
      // Figure out what the real template is.
      // If first letter is a P then it is the value in that property
      // eg. P31 > Q5 is the template

      let template = this.template;
      if (
        this.template.charAt(0) === 'P' &&
        !isNaN(this.template.substring(1, this.template.length))
      ) {
        if (typeof this.wdProperties[template] !== 'undefined') {
          let claim = this.wdProperties[template];
          claim = wdk.simplify.claim(claim[0]);

          template = claim;
        } else {
          template = false;
        }
      }
      template = 'all';
      return template;
    },
    Q() {
      // We are in a Vue App
      if (typeof this.$attrs.Q !== 'undefined') {
        return this.$attrs.Q;
      }
      // We are a webcomponent
      if (typeof this.q !== 'undefined') {
        // prefix = 'wikidata-';
        return this.q;
      }
    },
    prefix() {
      /*
       * This is tricky, but it seems that in normal mode _hasHookEvent is false, but in webcomponent mode the same attribute is true.
       * Also, the attribute '$emit' is present in webcomponent mode but not when in normal mode.

       * Let's try some of these until they brake.
       */
      return this.hasHookEvent === false ? 'wikidata-' : '';
    },
    instanceOf() {
      const Q = this.$store.getters.qValue(this.Q);

      if (typeof Q !== 'undefined') {
        if (typeof Q.instanceOf !== 'undefined') {
          return Q.instanceOf.slice('http://www.wikidata.org/entity/'.length);
        }
      }
      return false;
    }
  },
  watch: {
    wdProperties: {
      deep: false,
      handler(oldValue: Array<mixed>, newValue: Array<mixed>) {
        console.log('forcing update', oldValue);
        console.log('forcing update', newValue);
        this.$forceUpdate();
      }
    }
  },
  beforeCreate() {
    //    We need to add the store manually, because in the webcomponents this is not happening
    this.$store = store;
  },
  /**
   * Item loads the data and determines what QTemplate to render.
   * Then renders *that* template, passing on all the options.
   * @constructs Item
   * @private
   */
  created() {
    const me = this;
    const params = {
      Qs: [this.Q],
      Q: this.Q,
      languages: this._languages
    };
    //    debugger;
    this.$store.dispatch('FETCH_QS', params, {
      root: true
    });
    this.$store.dispatch('FETCH_PS', params, {
      root: true
    });
    // this is horrible, but at least in the webworker versions
    // the watcher for Ps does not work (and why is it even there?)
    // So for now we guestimate an amount of time to fetch the Qs and Ps
    window.setTimeout(function() {
      console.log('fired timer');

      me.$forceUpdate();
    }, 2000);
  },
  methods: {},
  render(createElement: Function) {
    const me = this;

    console.log('Rendering Item ' + me.Q);
    // var template = this._template

    // var Ps = this.wdProperties;
    if (typeof this.wdProperties !== 'undefined') {
      //  var leng = Object.keys(this.wdProperties).length
      //  if (typeof Ps == 'object') {
      //    this.$nextTick(function() {
      // me.$forceUpdate();
      //    });
      //  }
      //debugger;
      if (this._template && Object.keys(this.wdProperties).length > 0) {
        return createElement(this.prefix + this._template, {
          attrs: {
            // This is for the real webcomponent
            Q: this.Q,
            template: this._template
          },
          props: {
            // this is for when we run in a Vue app
            q: this.Q,
            template: this._template
          }
        });
      }
    }
    return createElement('div', [
      createElement('p', 'No Q known at this point')
    ]);
  },
  store
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
