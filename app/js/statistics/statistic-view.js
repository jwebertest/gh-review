/*global define, crossfilter, d3*/
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
    timeLineChart: null,
    addCharts: function(){
      var rawData = this.model.toJSON().commits;
      _.each(rawData, function(data){
        data.commit.date = new Date(data.commit.author.date);
        data.commit.day = d3.time.day(data.commit.date);
      });
      var data = crossfilter(rawData);
      var all = data.groupAll();
      var commentedCommits = data.dimension(function (data) {
        /*jshint camelcase:false*/
        return data.commit.comment_count > 0;
      });
      var commentedCommitsGroup = commentedCommits.group();

      this.addPieChart(all, commentedCommits, commentedCommitsGroup);

      dc.renderAll();
    },
    addPieChart: function(all, commentedCommits, commentedCommitsGroup){
      this.approvedPieChart  = dc.pieChart('#approved-pie-chart');
      this.approvedPieChart
        .width(300)
        .height(300)
        .renderLabel(true)
        .transitionDuration(1000)
        .dimension(commentedCommits)
        .group(commentedCommitsGroup)
        .radius(120)
        .minAngleForLabel(0)
        .colors(['#a60000','#2EC73B'])
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
    },
    render: function(){
      this.$el.html(this.template());
      this.addCharts();
    }
  });

});