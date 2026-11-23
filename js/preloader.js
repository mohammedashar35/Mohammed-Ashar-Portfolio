/**
 * MOHAMMED ASHAR - SIGNATURE PAGE PRELOADER ENGINE
 * Smooth progression ticker from 0% -> 98% -> 100%.
 * Provides smooth, reliable loading feel matching user reference.
 */

(function () {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('sitePreloader');
    const progressBar = document.getElementById('preloaderProgressBar');
    const percentText = document.getElementById('preloaderPercentText');

    if (!preloader || !progressBar || !percentText) return;

    let progress = 0;
    let isComplete = false;

    function setProgress(val) {
      progress = Math.min(100, Math.max(0, val));
      const rounded = Math.floor(progress);
      progressBar.style.width = progress + '%';
      percentText.textContent = `LOADING... ${rounded}%`;
    }

    // Smooth counter animation
    const startTime = performance.now();
    const minDuration = 1300; // Minimum 1.3s so animation is visible and smooth

    function tick(now) {
      const elapsed = now - startTime;
      const timeProgress = Math.min(1, elapsed / minDuration);

      // Realistic ease-out curve
      let currentVal = timeProgress * 95;
      
      if (isComplete && elapsed >= minDuration) {
        currentVal = 95 + (Math.min(1, (elapsed - minDuration) / 250)) * 5;
      }

      setProgress(currentVal);

      if (progress >= 100) {
        setTimeout(function () {
          preloader.classList.add('fade-out');
          document.body.classList.remove('preloader-active');

          setTimeout(function () {
            if (preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
          }, 650);
        }, 180);
      } else {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);

    function onReady() {
      // Allow minDuration before completing to 100%
      setTimeout(function () {
        isComplete = true;
      }, Math.max(0, minDuration - (performance.now() - startTime)));
    }

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady);
      setTimeout(onReady, 2500); // Safety fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
