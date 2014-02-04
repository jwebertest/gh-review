/*global define, window*/
define([
  'backbone',
  'underscore',
  'when',
  'Logger',
  'OAuth',
  'GitHub'
], function (Backbone, _, when, Logger, OAuth, GitHub) {
  'use strict';

  var logger = new Logger('app');

  function GHReview() {
    logger.trace('Init Application');
    this.ajaxIndicator = null;
    this.ajaxIndicatorTimeoutId = null;
    this.ajaxIndicatorIsVisible = false;
    this.github = new GitHub({});
    this.oauth = new OAuth({
      clientId: '5082108e53d762d90c00',
      clientSecret: '178651f3705d7952413ff82447004171712f1950',
      apiScope: 'user, repo',
      redirectUri: 'http://localhost:9000/githubCallback.html'
    });
    this.oauth.onAccessTokenReceived = function(){
      this.github.authenticate({
        type: 'token',
        token: this.oauth.accessToken
      });
      this.trigger('authenticated');
    }.bind(this);
  }

  GHReview.prototype = Backbone.Events;

  GHReview.prototype.showIndicator = function (show) {
    var _this = this;
    window.clearTimeout(this.ajaxIndicatorTimeoutId);
    if (!this.ajaxIndicatorIsVisible && show) {
      this.ajaxIndicatorTimeoutId = window.setTimeout(function () {
        _this.ajaxIndicator.modal('show');
        _this.ajaxIndicatorIsVisible = true;
      }, 700);
    } else if (this.ajaxIndicatorIsVisible && !show) {
      this.ajaxIndicator.modal('hide');
      this.ajaxIndicatorIsVisible = false;
    }
  };

  return new GHReview();
});
