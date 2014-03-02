/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/statistics.html'
], function(Backbone, _, app, template){
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    events: {
      'click li': 'computeStatistic'
    },
    computeStatistic: function(event){
      var target = this.$(event.target);
      console.log(target);
    },
    render: function(){
      console.log(app.filterCollection.toJSON());
      this.$el.html(this.template({models: app.filterCollection.toJSON()}));
    }
  });

});
