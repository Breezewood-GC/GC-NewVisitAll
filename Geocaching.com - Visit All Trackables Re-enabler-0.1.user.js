// ==UserScript==
// @name         Geocaching.com - Visit All Trackables Re-enabler
// @namespace    http://scripts.lwdws.com/
// @version      0.1
// @description  Restores the "Visit All" Functionality for logging trackable visits to caches being logged online at Geocaching.com
// @author       Breezewood
// @include      http*://*.geocaching.com/live/geocache/*/draft/*/compose*
// @include      http*://www.geocaching.com/live/geocache/*/draft/*/compose*
// @include      http*://geocaching.com/live/geocache/*/draft/*/compose*
// @include      http*://*.geocaching.com/live/geocache/*/draft/*/compose*
// @include      http*://*.geocaching.com/live/geocache/*/log/*/edit*
// @include      http*://www.geocaching.com/live/geocache/*/log/*/edit*
// @include      http*://geocaching.com/live/geocache/*/log/*/edit*
// @include      http*://*.geocaching.com/live/geocache/*/log/*/edit*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to click elements matching a selector
    function clickElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(button => {
            button.click();
        });
    }
    (function() {
	window.addEventListener('load', function() {
      window.setTimeout(function(){
        var button_visitAll = document.getElementsByClassName('btn-visit');
        if (button_visitAll.length > 0) {
          button_visitAll[0].click();
        }
      }, 3000);
	});
    // Create the link element
    var newLink = document.createElement('a');
    newLink.href = 'https://www.google.com'; // The URL the link points to
    newLink.textContent = 'Visit All'; // The text displayed on the link

    // Style the link (optional)
    newLink.style.position = 'fixed';
    newLink.style.top = '0';
    newLink.style.left = '0';
    newLink.style.backgroundColor = 'yellow';
    newLink.style.padding = '5px';

    // Add the link to the body
    document.body.appendChild(newLink);

    // Example 1: Click all buttons with a specific class
    // Replace 'my-button-class' with the actual class name of your buttons
    clickElements('.my-button-class');

    // Example 2: Click all input elements of type 'button'
    // clickElements('input[type="button"]');

    // Example 3: Click all button elements
    // clickElements('button');

    // If buttons are loaded dynamically, you might need a delay or MutationObserver
    // setTimeout(() => {
    //     clickElements('.my-button-class');
    // }, 2000); // Wait 2 seconds before clicking
})();
