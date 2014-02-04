/*global define*/
(function () {
  'use strict';
  function OAuth2(config) {
    this.accessToken = null;
    this.clientId = config.clientId;
    this.apiScope = config.apiScope;
    this.redirectUri = config.redirectUri;
    this.accessTokenUrl = config.accessTokenUrl;
    var authCode = this.parseAuthorizationCode(window.location.href);
    if(authCode){
      this.finishAuthorization(authCode);
    } else {
      this.getAuthorizationCode();
    }
  }

  OAuth2.prototype.getAuthorizationCode = function(){
    window.location.href = this.authorizationCodeURL();
  };

  OAuth2.prototype.finishAuthorization = function(authCode){
    var oauth = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.accessTokenURL(authCode), true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          oauth.setAccessToken(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send(null);
  };

  OAuth2.prototype.authorizationCodeURL = function() {
    return ('https://github.com/login/oauth/authorize?' +
      'client_id={{CLIENT_ID}}&' +
      'redirect_uri={{REDIRECT_URI}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{REDIRECT_URI}}', this.redirectUri)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.accessTokenURL = function(authCode) {
    return (this.accessTokenUrl + '?' +
      'client_id={{CLIENT_ID}}&' +
      'code={{CODE}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{CODE}}', authCode)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.parseAuthorizationCode = function(url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    var code = url.match(/[&\?]code=([\w\/\-]+)/);
    if (error) {
      throw 'Error getting authorization code: ' + error[1];
    }
    if(code){
      code = code[1];
    }
    return code;
  };

  OAuth2.prototype.setAccessToken = function(response) {
    /*jshint camelcase:false*/
    this.accessToken = response.access_token;
    this.expiresIn = Number.MAX_VALUE;
    this.onAccessTokenReceived();
  };

  OAuth2.prototype.onAccessTokenReceived = function(){};

  if(typeof define === 'function'){
    define(function(){
      return OAuth2;
    });
  }else{
    window.OAuth2 = OAuth2;
  }

}());
