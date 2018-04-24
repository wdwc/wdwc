import { mapGetters } from 'vuex';
import store from '../store';
// import Vue from 'vue/dist/vue.js'

export default {
  store,
  props: {
    Q: String,
    P: String,
    format: String
  },
  beforeCreate() {
    //  console.log('in PBase');
    this.$store = store;
  },

  data() {
    const data = {};

    //  var me = this
    const Ps = this.$store.getters.wdProperties;
    const myProp = Ps[this.P];
    data.values = myProp;
    //    debugger;
    //    if (myProp) {
    //      var keys = Object.keys(myProp);
    //      keys.forEach(function(key) {
    //        me.$set(data, key, myProp[key]);
    //      });
    //    }
    return data;
  },
  computed: {
    ...mapGetters(['wdProperties']),
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
