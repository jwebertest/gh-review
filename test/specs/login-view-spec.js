/*global define, describe, it, expect, spyOn*/
define(['app', 'Router', 'loginLogout'], function(app, Router, loginLogout){
  'use strict';

  xdescribe('#loginLogout', function(){

    it('Should be defined', function(){
      expect(LoginView).toBeDefined();
    });

    it('.initialize should call .render', function(){
      var renderSpy = spyOn(LoginView.prototype, 'render');
      new LoginView();
      expect(renderSpy).toHaveBeenCalled();
    });

    it('.render should call router.navigate', function(){
      var TmpRouter = Router.extend({initialize: function(){}});
      app.router = new TmpRouter();
      var routerSpy = spyOn(app.router, 'navigate');
      new LoginView();
      expect(routerSpy).toHaveBeenCalledWith('#oauth/accesstoken', { trigger : true });
    });

  });

});