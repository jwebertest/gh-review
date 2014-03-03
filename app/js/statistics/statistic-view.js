/*global define, crossfilter*/
define([
  'backbone',
  'underscore',
  'dc',
  'text!templates/statistic-charts.html'
], function (Backbone, _, dc, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    approvedPieChart: null,
    addCharts: function(){
      var data = crossfilter(this.model.toJSON().commits);
      var all = data.groupAll();
      var reviewedValue = data.dimension(function (d) {
        /*jshint camelcase:false*/
        return d.commit.comment_count > 0;
      });
      var startReviewedGroup = reviewedValue.group();
      this.approvedPieChart  = dc.pieChart('#approved-pie-chart');
      this.approvedPieChart
        .width(250)
        .height(200)
        .renderLabel(true)
        .transitionDuration(1500)
        .dimension(reviewedValue)
        .group(startReviewedGroup)
        .radius(90)
        .minAngleForLabel(0)
        .label(function(d) {
          var percentage = '(' + Math.floor(d.data.value / all.value() * 100) + '%)';
          return d.data.key ? 'Reviewed: '  + percentage : 'Not Reviewed: ' + percentage;
        });
//        .on("filtered", function (chart) {
//          dc.events.trigger(function () {
//            if(chart.filter()) {
//              volumeChart.filter([chart.filter()-0.1,chart.filter()+0.1]);
//            }
//            else
//            {volumeChart.filter([0,5.1])}
//          });
//        });

      dc.renderAll();
    },
    render: function(){
      this.$el.html(this.template());
      this.addCharts();
    }
  });

});