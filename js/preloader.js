/**
 * MOHAMMED ASHAR - SIGNATURE PAGE PRELOADER ENGINE
 * Increments progress bar and percentage (0% -> 100%) smoothly.
 * Fades out gracefully upon window load.
 */

(function () {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('sitePreloader');
    const progressBar = document.getElementById('preloaderProgressBar');
    const percentText = document.getElementById('preloaderPercentText');

    if (!preloader || !progressBar || !percentText) return;

    let currentProgress = 0;
    let targetProgress = 15;
    let isWindowLoaded = false;
    let intervalId = null;

    function updateDisplay(val) {
      const rounded = Math.min(100, Math.floor(val));
      progressBar.style.width = rounded + '%';
      percentText.textContent = `LOADING... ${rounded}%`;
    }

    // Smooth increment ticker
    intervalId = setInterval(function () {
      if (currentProgress < targetProgress) {
        currentProgress += (targetProgress - currentProgress) * 0.18 + 0.4;
        if (currentProgress > targetProgress) currentProgress = targetProgress;
        updateDisplay(currentProgress);
      }

      if (currentProgress >= 100) {
        clearInterval(intervalId);
        updateDisplay(100);

        // Pause briefly at 100% so user sees completion
        setTimeout(function () {
          preloader.classList.add('fade-out');
          document.body.classList.remove('preloader-active');

          setTimeout(function () {
            if (preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
          }, 600);
        }, 180);
      }
    }, 20);

    // Progression checkpoints
    setTimeout(() => { if (!isWindowLoaded) targetProgress = 35; }, 150);
    setTimeout(() => { if (!isWindowLoaded) targetProgress = 65; }, 400);
    setTimeout(() => { if (!isWindowLoaded) targetProgress = 88; }, 750);

    // Window loaded checkpoint
    function finishLoading() {
      isWindowLoaded = true;
      targetProgress = 100;
    }

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
      // Fallback maximum timeout of 2.2s in case external assets lag
      setTimeout(finishLoading, 2200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
