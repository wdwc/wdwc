// import Vue from 'vue/dist/vue.js'
import { mapGetters } from 'vuex';
import store from '../store';
import { LIST_TYPES } from '../globals/consts';

export default {
  store,
  props: {
    q: String,
    // type check plus other validations
    listType: {
      type: String,
      default: 'table',
      required: false,
      validator(value) {
        const result = LIST_TYPES.indexOf(value) > -1;

        return result;
      }
    }
  },
  data() {
    const data = {};
    data.wdProperties = {};
    data.Pkeys = {};
    data.QLabels = {};
    const me = this;
    const wdProperties = this.$store.getters.wdProperties;
    const keys = Object.keys(wdProperties);
    data.Plabels = this.$store.getters.Plabels;
    data.Pkeys = keys;
    keys.forEach(function(key) {
      me.$set(data.wdProperties, key, wdProperties[key]);
    });

    return data;
  },
  beforeCreate() {
    this.$store = store;
  },
  created() {
    //  this.$options.template = `<div class="hello">Loading      </div>`;
    //    var Ps = this.$store.getters.Ps;
    //    var me = this;
    //    Ps.forEach(function(item, key) {
    //      Vue.set(me, key, item);
    //    });
    //    debugger;
    /*    this.$options.template = `<div class="hello">
        <h1>{{ label }}</h1>
        <h3>{{ description }}</h3>
        <h4>{{ P31 }}</h4>
      </div>`;*/

    // componentTagholds the name
    this.$options.template = '#' + this.$options._componentTag;
  },
  computed: {
    ...mapGetters(['languages']),
    instanceOf() {
      const Q = this.$store.getters.qValue(this.q);
      if (typeof Q !== 'undefined') {
        if (typeof Q.instanceOf !== 'undefined') {
          return Q.instanceOf.slice('http://www.wikidata.org/entity/'.length);
        }
      }
      return false;
    },
    label() {
      const Q = this.$store.getters.qValue(this.q);
      if (typeof Q !== 'undefined') {
        if (typeof Q.instanceOf !== 'undefined') {
          return Q.label;
        }
      }
      return false;
    },
    description() {
      const Q = this.$store.getters.qValue(this.q);
      if (typeof Q !== 'undefined') {
        if (typeof Q.instanceOf !== 'undefined') {
          return Q.description;
        }
      }
      return false;
    }
  }
};
