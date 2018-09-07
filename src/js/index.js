import React from 'react';
import ReactDOM from 'react-dom';
import {Application} from './app';
import {midiUtils} from './midi';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const noteLength=getParameterByName('noteLength');
const grid=getParameterByName('grid');

// console.log(props);
const queryGrid = grid ? JSON.parse(grid) : undefined;
// console.log(queryGrid);
const queryNoteLength = noteLength ? parseInt(noteLength, 10) : undefined;
// console.log(queryNoteLength);
const data = '{"noteLength":200,"grid":{"size":8,"arrows":[{"x":0,"y":0,"vector":0},{"x":1,"y":1,"vector":0},{"x":2,"y":2,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":0},{"x":5,"y":5,"vector":0},{"x":6,"y":6,"vector":0},{"x":7,"y":7,"vector":0},{"x":0,"y":7,"vector":0},{"x":1,"y":6,"vector":0},{"x":2,"y":5,"vector":0},{"x":3,"y":4,"vector":0},{"x":4,"y":3,"vector":0},{"x":5,"y":2,"vector":0},{"x":6,"y":1,"vector":0},{"x":7,"y":0,"vector":0},{"x":0,"y":0,"vector":0},{"x":1,"y":1,"vector":0},{"x":2,"y":2,"vector":0},{"x":3,"y":3,"vector":0},{"x":4,"y":4,"vector":0},{"x":5,"y":5,"vector":0},{"x":6,"y":6,"vector":0},{"x":7,"y":7,"vector":0},{"x":0,"y":7,"vector":0},{"x":1,"y":6,"vector":0},{"x":2,"y":5,"vector":0},{"x":3,"y":4,"vector":0},{"x":4,"y":3,"vector":0},{"x":5,"y":2,"vector":0},{"x":6,"y":1,"vector":0},{"x":7,"y":0,"vector":0}],"muted":true,}}';
const encoded = getParameterByName('data');
let parsedGrid = {};
if(encoded){
    console.log(encoded);
    const decoded = window.atob(encoded);
    console.log(decoded);
    parsedGrid = JSON.parse(decoded);
}
// eslint-disable-next-line no-undef
particlesJS.load('particles-js', '../src/assets/particles.json', () => {});
// eslint-disable-next-line no-undef
ReactDOM.render(<Application noteLength={parsedGrid.noteLength} grid={parsedGrid.grid}/>, document.getElementById('root'));
midiUtils();

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'arrowgrid.sagaciasoft.com',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        // tosUrl: '<your-tos-url>',
        // Privacy policy url.
        // privacyPolicyUrl: '<your-privacy-policy-url>'
  });
// Feature detects Navigation Timing API support.
if (window.performance) {
  // Gets the number of milliseconds since page load
  // (and rounds the result since the value must be an integer).
  var timeSincePageLoad = Math.round(performance.now());

  // Sends the timing hit to Google Analytics.
  ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
}