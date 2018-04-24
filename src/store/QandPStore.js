import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import difference from 'lodash-es/difference.js';
//import merge from 'lodash-es/merge.js'
import axios from 'axios';

import wdk from 'wikidata-sdk';

Vue.use(Vuex);

const state = {
  Plabels: {},
  languages: ['en'],
  data: [],
  rows: [],
  isLoggedIn: false,
  pending: false,
  errorTitle: '',
  errorText: '',
  Qs: [],
  Qkeys: [],
  wdProperties: {},
  entity: {}
};

const mutations = {
  async RECEIVE_QS(state, { Qs }) {
    const Qlabels = [];
    const keys = Object.keys(Qs);

    keys.forEach(function(fullkey) {
      // var Q = {}
      const key =
        fullkey.indexOf('Description') > 0
          ? fullkey.substr(0, fullkey.indexOf('Description'))
          : fullkey.substr(0, fullkey.indexOf('Label'))
            ? fullkey.substr(0, fullkey.indexOf('Label'))
            : fullkey.substr(0, fullkey.indexOf('instance_of'));

      if (typeof Qlabels[key] === 'undefined') {
        Qlabels[key] = [];
        Qlabels[key].key = key;
      }

      if (fullkey.indexOf('Label') > 0) {
        Qlabels[key].label = Qs[fullkey].value;
      } else if (fullkey.indexOf('instance_of') > 0) {
        Qlabels[key].instanceOf = Qs[fullkey].value;
      } else {
        Qlabels[key].description = Qs[fullkey].value;
      }
    });

    keys.forEach(function(fullkey) {
      const key =
        fullkey.indexOf('Description') > 0
          ? fullkey.substr(0, fullkey.indexOf('Description'))
          : fullkey.substr(0, fullkey.indexOf('Label'));
      if (state.Qkeys.indexOf(key) === -1) {
        Vue.set(state.Qs, key, Qlabels[key]);
        state.Qkeys.push(key);
      }
    });

    state.pending = false;
    state.errorTitle = 'Oh Dear';
    console.log('Receiving Qs');
  },
  async RECEIVE_PS(state, { entity, props }) {
    // var clone = Object.assign([], state.Ps);
    const newPs = {};
    const newPLabels = {};
    const keys = Object.keys(entity.claims);
    keys.forEach(function(key) {
      //  Vue.set(clone, key, entity.claims[key]);
      //    state.Ps.push(entity.claims[key]);
      newPs[key] = entity.claims[key];
      newPLabels[key] = props.entities[key].labels;
      //      Vue.set(state.Ps, key, entity.claims[key]);
      //      Vue.set(state.Plabels, key, props.entities[key].labels);
    });
    console.log('Receiving Ps');
    state.Plabels = Object.assign({}, state.Plabels, newPLabels);
    state.wdProperties = Object.assign({}, state.wdProperties, newPs);
    //    debugger;
  },
  RECEIVE_LANGUAGES(state) {
    state.languages = state.languages;
  },
  FETCHING(state) {
    state.pending = true;
    console.log('Pending is True');
  },
  ERROR(err) {
    state.errorTitle = err.Title;
    state.errorText = err.Text;
    // instance_of
    console.error('Error in Store ', err);
  }
};

const actions = {
  async FETCH_QS({ commit }, params) {
    commit('FETCHING'); // show spinner

    const languages = params.languages.join(',');
    commit('RECEIVE_LANGUAGES', {
      languages
    });

    const QsDelta = difference(params.Qs, state.Qs);

    let SELECT = 'SELECT ';
    let WHERE = ' WHERE {';
    QsDelta.forEach(function(Q) {
      SELECT += `?${Q}Label ?${Q}Description ?${Q}instance_of`;
      WHERE += `BIND(entity:${Q} AS ?${Q}) . `;
      WHERE += `OPTIONAL { ?${Q} wdt:P31 ?${Q}instance_of. }`;
    });

    WHERE += `SERVICE wikibase:label {
              bd:serviceParam wikibase:language "${languages}".
              } }`;
    const url = wdk.sparqlQuery(
      'PREFIX entity: <http://www.wikidata.org/entity/> ' + SELECT + WHERE
    );

    axios
      .get(url)
      .then(function(response) {
        const values = response.data.results.bindings[0];

        commit('RECEIVE_QS', {
          Qs: values
        });
      })
      .catch(function(error) {
        commit('ERROR', {
          err: error
        });
      });
  },
  async FETCH_PS({ commit }, params) {
    commit('FETCHING');
    const url = wdk.getEntities(params.Q, params.languages);
    //  var me = this
    axios.get(url).then(function(response) {
      const entity = response.data.entities[params.Q];
      //      var entities = wdk.parse.wd.entities
      //  var entities = wdk.parse.wd.entities(data);
      const simplifiedClaims = wdk.simplifyClaims(entity.claims);

      //  We also want the attributes / wikidata items Q codes here!
      //    The Q values are in the simplifiedClaims as values
      const properties = Object.keys(simplifiedClaims);
      const url2 = wdk.getEntities(properties, params.languages);
      axios.get(url2).then(function(props) {
        const object = {
          entity,
          props: props.data
        };
        commit('RECEIVE_PS', object);
      });
    });
  }
};

const getters = {
  qValue(state) {
    return function(value) {
      const result = state.Qs[value];
      return result;
    };
  },
  qValues(state) {
    return state.Qs;
  },
  wdProperties(state) {
    return state.wdProperties;
  },
  // TODO this needs to be smarter, because the label in the default language might be missing
  pLabels: state => state.Plabels,
  errorTitle: state => state.errorTitle,
  errorText: state => state.errorText,
  languages: state => state.languages
};

/* const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexCache]
});*/

export default {
  state,
  getters,
  actions,
  mutations,
  strict: true
};
