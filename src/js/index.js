import viy from "./vue-component-all.bundle"
import './component.css';

export default {
  install: function(Vue) {
    window.Vue = Vue;
    viy.init.call(window)
    this.lang = viy.lang;
  },
  lang: undefined,
  setI18n: function(i18n) {
    Vue.i18n = i18n;
    Vue.t = Vue.i18n.t.bind(Vue.i18n);
  }
}