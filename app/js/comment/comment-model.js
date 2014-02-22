/*global define*/
define(['backbone', 'moment', 'app'], function (Backbone, moment, app) {
  'use strict';

  var CommentModel = Backbone.Model.extend({
    initialize: function () {
      var date = moment(this.get('created_at'));
      this.set('commentFromNow', date.fromNow());
      var isCommentEditable = false;
      if (app.authenticated) {
        isCommentEditable = this.get('user').login === app.user.login;
      }
      this.set('isCommentEditable', isCommentEditable);
      var id = this.get('id');
      this.set('commentId', id);
      var commentMessage = this.get('body');
      this.set('commentMessage', commentMessage);
    }
  });

  return CommentModel;
});
