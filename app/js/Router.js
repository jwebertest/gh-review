/*global define*/
define(function (require) {
  'use strict';
  var $ = require('jquery');
  var Backbone = require('backbone');
  var app = require('app');
  var RepoView = require('RepoView');
  var RepoDetailView = require('repoDetailView');
  var ReviewCollection = require('reviewCollection');
  var ReviewListView = require('reviewListView');
  var ReviewDetailView = require('reviewDetailView');
  var commitCollection = require('commitCollection');
  var CommentView = require('CommentView');
  var oauthHandler = require('OauthHandler');
  var loginLogout = require('loginLogout');
  var WhoAmI = require('WhoAmI');

  var Router = Backbone.Router.extend({
    view: null,
    reviewCollection: null, //TODO move to proper place. Remind repo-detail-view
    routes: {
      '': 'root',
      'reviews': 'reviewList',
      'repositories': 'repositories',
      'repo/:id': 'repoDetail',
      'review/:id': 'reviewDetail',
      'commit/:id': 'showCommit',
      'login': 'login',
      'logout': 'logout',
      'oauth/accesstoken': 'getAccessToken',
      'oauth/callback': 'callback',
      'whoami': 'whoami'
    },
    reviewList: function () {
      this.trigger('ajaxIndicator', true);
      this.clear();
      this.view = new ReviewListView({
        collection: this.reviewCollection
      });
      this.view.render();
      this.view.fetchReviews();
      $('li[name="ghr-top-menu-links"]').removeClass('active');
      $('#reviewLink').addClass('active');
    },
    repositories: function () {
      this.trigger('ajaxIndicator', true);
      if (app.authenticated) {
        this.clear();
        this.view = new RepoView({
          collection: app.repoCollection
        });
        $('li[name="ghr-top-menu-links"]').removeClass('active');
        $('#repositoryLink').addClass('active');
      }
    },
    repoDetail: function (id) {
      this.trigger('ajaxIndicator', true);
      if (app.authenticated) {
        this.clear();
        var model = app.repoCollection.get(id);
        this.view = new RepoDetailView({
          model: model
        });
        $('li[name="ghr-top-menu-links"]').removeClass('active');
        $('#repositoryLink').addClass('active');
      }
    },
    reviewDetail: function (id) {
      this.trigger('ajaxIndicator', true);
      this.clear();
      var model = this.reviewCollection.get(id);
      this.view = new ReviewDetailView({
        model: model
      });
      this.view.getCommits()
        .then(function () {
          this.view.render();
          this.view.renderAllCommits();
        }.bind(this));
      $('li[name="ghr-top-menu-links"]').removeClass('active');
      $('#reviewLink').addClass('active');
    },
    showCommit: function (id) {
      this.trigger('ajaxIndicator', true);
      this.clear();
      var model = commitCollection.get(id);
      this.view = new CommentView({
        model: model
      });
      this.view.getDiffAndComments()
        .then(this.view.render.bind(this.view));
    },
    clear: function () {
      if (this.view) {
        this.view.remove();
        $('<div id="main" class="container"></div>').appendTo('body');
      }
    },
    login: loginLogout.login.bind(loginLogout),
    logout: loginLogout.logout.bind(loginLogout),
    getAccessToken: function () {
      this.trigger('ajaxIndicator', true);
      this.clear();
      oauthHandler.getAccessToken();
    },
    callback: function () {
      // TODO github didn't work with our # urls so this is currently handled by the root function in non authenticated case
      this.clear();
      oauthHandler.callback();
    },
    root: function () {
      this.trigger('ajaxIndicator', true);
      var url = window.location.href;
      var error = url.match(/[&\?]error=([^&]+)/);
      var code = url.match(/[&\?]code=([\w\/\-]+)/);
      if (!app.authenticated && (error || code)) {
        oauthHandler.callback();
      }
      this.trigger('ajaxIndicator', false);
    },
    whoami: function () {
      this.trigger('ajaxIndicator', true);
      this.clear();
      this.view = new WhoAmI();
      this.view.render();
    },
    initialize: function () {
      this.reviewCollection = new ReviewCollection();
      Backbone.history.start();
    }
  });
  return Router;
});