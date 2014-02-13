/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
    _ = require('underscore'),
    when = require('when'),
    app = require('app'),
    Chunk = require('chunk'),
    CommentBoxes = require('commentBox'),
    template = require('text!templates/comment-view.html');

  var chunkHeadingRegExp = new RegExp('@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');
  var EditCommentBox = CommentBoxes.edit;

  var CommentView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    files: [],
    chunkDefer: null,
    commentBox: null,
    events: {
      'click .added,.deleted': 'commentLine',
      'click .approveCommit': 'approveCommit'
    },
    getDiffAndComments: function(){
      return this.model.getDiff()
        .then(this.computeChunk.bind(this))
        .then(this.model.getCommitComments.bind(this.model));
    },
    computeChunk: function () {
      this.chunkDefer = when.defer();
      this.files = [];
      var files = this.model.get('diff').files;
      _.forEach(files, this.addFile, this);
      return this.chunkDefer.promise;
    },
    addFile: function (file, fileIndex, array) {
      this.files[fileIndex] = { chunks: [] };
      var lines = _.str.lines(file.patch);
      _.forEach(lines, this.addLine, this);
      if (fileIndex === (array.length - 1)) {
        this.chunkDefer.resolve();
      }
    },
    addLine: function (line) {
      line = _.str.escapeHTML(line);
      var file = this.files[this.files.length -1];
      var chunks = file.chunks;
      if (line.match(chunkHeadingRegExp)) {
        chunks.push(new Chunk(line));
      } else {
        chunks[chunks.length - 1].addLine(line);
      }
    },
    commentLine: function (event) {
      var target = $(event.target);
      var tr = target.closest('tr');
      var position = target.data('position');
      var fileIndex = target.data('fileindex');
      if (this.commentBox) {
        this.commentBox.remove();
      }
      this.commentBox = new EditCommentBox({
        model: this.model,
        tr: tr,
        position: position,
        fileIndex: fileIndex
      });
    },
    renderComments: function(){
      this.model.comments.addComments();
    },
    approveCommit: function () {
      this.model.approveCommit();
    },
    render: function () {
      app.showIndicator(false);
      this.$el.html(this.template({model: this.model.toJSON(), files: this.files}));
      this.renderComments();
    }
  });

  return CommentView;
});
