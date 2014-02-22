/*global define*/
define(['../.'], function (Backbone) {
  'use strict';

  var FilterModel = Backbone.Model.extend({
    defaults: {
      repo: '',
      contributor: '',
      branch: '',
      since: {
        amount: 0,
        pattern: ''
      },
      until: '',
      path: ''
    }
  });

  return FilterModel;
});
