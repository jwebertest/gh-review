/*global define*/
define([
  '../.',
  'underscore',
  'app',
  'FilterListView',
  'QuickReview',
  'text!templates/review-overview.html'
], function(Backbone, _, app, FilterListView, QuickReview, template){
  'use strict';

  var ReviewOverview = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function(){
      this.$el.html(this.template());
      var quickReview = new QuickReview();
      quickReview.render();

      var reviewListView = new FilterListView({collection: app.filterCollection});
      reviewListView.render();
      reviewListView.fetchReviews();
    }
  });

  return ReviewOverview;

});
