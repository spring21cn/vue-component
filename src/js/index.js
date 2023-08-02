import Vue from 'vue';
import viy from './vue-component-all.common';
import './component.css';

window.Vue = Vue;
viy.init.call(window);

export default {
  install: function (Vue) {
    this.lang = viy.lang;
  },
  lang: undefined,
  setI18n: function (i18n) {
    Vue.i18n = i18n;
    Vue.t = Vue.i18n.t.bind(Vue.i18n);
  },
};

export const Alert = function () {
  Vue.alert.apply(this, arguments);
};
export const Confirm = function () {
  Vue.alert.apply(this, arguments);
};
export const Notify = function () {
  Vue.notify.apply(this, arguments);
};
export const LoadingBar = function () {
  return Vue.LoadingBar;
};
