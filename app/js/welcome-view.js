/*global define*/
define(['backbone', 'underscore', 'text!templates/welcome-view.html'], function (Backbone, _, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function () {
      this.$el.html(this.template());
    }
  });
});
