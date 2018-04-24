
<script>
import { mapGetters } from 'vuex';
import store from '../store';
// import Vue from 'vue/dist/vue.js'

export default {
  store,
  name: 'P281',
  props: {
    q: {
      type: String,
      default: ''
    }
  },
  data() {
    const data = {};

    const me = this;
    const Ps = this.$store.getters.wdProperties;
    const myProp = Ps[this.$options._componentTag];
    const keys = Object.keys(myProp);
    keys.forEach(function(key) {
      me.$set(data, key, myProp[key]);
    });

    return data;
  },
  computed: {
    ...mapGetters(['pending', 'wdPropertiess']),
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
  },
  beforeCreate() {
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

    this.$options.template = '#' + this.$options._componentTag;
    this.$store = store;
  }
};
</script>
