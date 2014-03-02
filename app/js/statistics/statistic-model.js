/*global define*/
define(['backbone', 'when', 'underscore', 'app', 'moment'], function (Backbone, when, _, app, moment) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      since: moment().subtract('weeks', 2)
    },
    computeStatistics: function () {
      var defer = when.defer();
      app.github.repos.getCommits({
        user: this.get('owner'),
        repo: this.get('repo'),
        branch: this.get('branch'),
        since: this.get('since'),
        'per_page': 100
      }, function (error, resp) {
        if (!error) {
          console.log(resp);
          defer.resolve();
        }
      });
      return defer.promise;
    }
  });

});