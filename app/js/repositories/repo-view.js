/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'moment',
  'text!templates/repo-view.html'
], function (Backbone, _, app, moment, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    serialize: function () {
      var repos = this.collection.toJSON();
      var publicRepos = [];
      var privateRepos = [];
      var orgaRepos = [];
      var sortedRepos = _.sortBy(repos, function (repo) {
        /*jshint camelcase:false*/
        return moment(repo.updated_at).valueOf() * -1;
      });

      _.each(sortedRepos, function (repo) {
        /*jshint camelcase:false*/
        var date = moment(repo.updated_at);
        repo.fromNow = date.fromNow();
        if (!repo.private && !repo.organization) {
          publicRepos.push(repo);
        } else if (repo.private && !repo.organization) {
          privateRepos.push(repo);
        } else if (repo.organization) {
          orgaRepos.push(repo);
        }
      });
      return {
        privateRepos: privateRepos,
        publicRepos: publicRepos,
        orgaRepos: orgaRepos
      };
    },
    initialize: function () {
      this.collection.on('add', this.render, this);
      this.render();
    },
    render: function () {
      this.$el.html(this.template(this.serialize()));
      app.showIndicator(false);
    }
  });
});
