
<script>
import { mapGetters } from 'vuex';
import store from '../store';
import { LIST_TYPES } from '../globals/consts';

// import wdk from 'wikidata-sdk'

import wdWikibaseitem from '../baseclasses/datatypes/wdWikibaseitem';
import wdExternalid from '../baseclasses/datatypes/wdExternalid';
import wdCommonsMedia from '../baseclasses/datatypes/wdCommonsMedia';
import wdTime from '../baseclasses/datatypes/wdTime';
import wdGlobecoordinate from '../baseclasses/datatypes/wdGlobecoordinate';
import wdString from '../baseclasses/datatypes/wdString';
import wdQuantity from '../baseclasses/datatypes/wdQuantity';
import wdUrl from '../baseclasses/datatypes/wdUrl';
import wdGeoshape from '../baseclasses/datatypes/wdGeoshape';
import wdMonolingualtext from '../baseclasses/datatypes/wdMonolingualtext';

/**
 * Properties of {Item}s
 * @class Property
 * @param {string} q - Wikidata Q value
 * @param {string=} template - css identifier of a template that is part of the current html page. Must start with an '#'
 * @param {string} format -
 * formatting library used
 * @param {LIST_TYPES} [listType=table] -
 * A template that is used to seperate properties. If no #template is provided, this will apply to both
 * properties, as well as values within multi-value properties.
 */
export default {
  name: 'Property',
  components: {
    wdCommonsMedia,
    wdExternalid,
    wdWikibaseitem,
    wdTime,
    wdGlobecoordinate,
    wdString,
    wdQuantity,
    wdUrl,
    wdGeoshape,
    wdMonolingualtext
  },
  props: {
    q: {
      type: String,
      required: false,
      default: '',
      validator(value) {
        let result = true;
        result =
          result &
          (value.charAt(0) === 'Q') &
          !isNaN(value.substring(1, value.length));
        return result;
      }
    },
    template: {
      type: String,
      default() {
        // TODO: Can we auto-detect an x-template ?
        //  console.log(
        //    'All is a nice default, but what if there is an x-template available. can we auto-detect that?'
        //    );
        return '';
      },
      required: false,
      validator(value) {
        console.log('Property has template', value);

        const result = true;
        // TODO: console.log('Check somehow that the template exists?');
        return result;
      }
    },
    // type check plus other validations
    listType: {
      type: String,
      default: 'table',
      required: false,
      validator(value) {
        const result = LIST_TYPES.indexOf(value) > -1;
        if (!result) {
          console.error(
            'list-type is not any of the values ' + LIST_TYPES.join(', ')
          );
        }
        return result;
      }
    },
    // type check plus other validations
    format: {
      type: String,
      default: 'text',
      required: false,
      validator(value) {
        console.log('Property has format', value);
        return true;
      }
    }
  },
  computed: {
    ...mapGetters(['pending', 'wdProperties']),
    p() {
      //    var japie = this.wdProperties
      //      var P = this.P
      debugger;
      //return 'kees';
      return this.wdProperties[this.P][0];
    },
    _template() {
      // Figure out what the real template is.
      // If first letter is a P then it is the value in that property
      // eg. P31 > Q5 is the template

      let template = this.template;
      if (
        (this.template.charAt(0) === 'P') &
        !isNaN(this.template.substring(1, this.template.length))
      ) {
        template = this.template;
      } else {
        template = this.p.mainsnak.datatype;
      }

      template =
        'wd' +
        template.charAt(0).toUpperCase() +
        template.replace('-', '').substring(1, template.length);
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
    P() {
      // We are in a Vue App
      if (typeof this.$attrs.P !== 'undefined') {
        return this.$attrs.P;
      }
      if (typeof this.$attrs.p !== 'undefined') {
        return this.$attrs.p;
      }
    },
    prefix() {
      /*
       * This is tricky, but it seems that in normal mode _hasHookEvent is false, but in webcomponent mode the same attribute is true.
       * Also, the attribute '$emit' is present in webcomponent mode but not when in normal mode.

       * Let's try some of these until they brake.
       **/

      return this.hasHookEvent === false ? 'wikidata-' : '';
    }
  },
  beforeCreate() {
    this.$store = store;
  },
  created() {
    /*    var params = {
      Qs: [this.Q],
      Q: this.Q,
      languages: this._languages
    }*/
  },
  render(createElement) {
    //    var me = this

    if (this._template && Object.keys(this.wdProperties).length > 0) {
      return createElement(this._template, {
        attrs: {
          // This is for the real webcomponent
          Q: this.Q,
          P: this.P,
          template: this._template,
          format: this.format
        },
        props: {
          // this is for when we run in a Vue app
          Q: this.Q,
          P: this.P,
          template: this._template,
          format: this.format
        }
      });
    }
    return createElement('div', [
      createElement('p', 'No P known at this point')
    ]);
  },
  store
};
</script>
