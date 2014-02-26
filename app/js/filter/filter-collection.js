/*global define*/
define(['backbone', 'FilterModel', 'backboneLocalStorage'], function (Backbone, FilterModel) {
  'use strict';

  var FilterCollection = Backbone.Collection.extend({
    model: FilterModel,
    localStorage: new Backbone.LocalStorage('filter'),
    initialize: function () {
      this.fetch();
    }
  });

  return FilterCollection;
});