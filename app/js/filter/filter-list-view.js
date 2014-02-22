/*global define*/
define([
  '../.',
  'underscore',
  'app',
  'reviewListItemView',
  'text!templates/review-list-item.html'
], function (Backbone, _, app, ReviewListItemView, listItemTemplate) {
  'use strict';

// TODO
//      this.listenTo(this.model, 'change', this.render);
//      this.listenTo(this.model, 'destroy', this.remove);
//    clear: function (event) {
//      event.stopPropagation();
//      event.preventDefault();
//      this.model.destroy();

  var FilterListView = Backbone.View.extend({
    el: '#reviewList',
    events: {
      'click li': 'showDetail',
      'click .destroy': 'clear'
    },
    fetchReviews: function(){
      if (this.collection.length) {
        this.addAll();
      } else {
        this.showHint();
      }
    },
    showDetail: function (event) {
      app.router.navigate('review/' + $(event.target).data('modelid'), {trigger: true});
    },
    addOne: function (model) {
      var view = this.template(model.toJSON());
      this.$el.append(view);
    },
    addAll: function () {
      this.collection.each(this.addOne, this);
      app.showIndicator(false);
    },
    showHint: function () {
      //TODO show help text for first filter
    },
    render: function () {}
  });

  return FilterListView;
});
