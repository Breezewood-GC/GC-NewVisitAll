// ==UserScript==
// @name         Geocaching - Restore "Visit All" Action Button
// @namespace    http://tampermonkey.net
// @version      3.0
// @description  Restores the missing "Visit all" link to the inventory header. Clicking it expands and auto-toggles all trackables.
// @author       Breezewood
// @match        https://www.geocaching.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const targetActionText = 'visit';
    const scrollAmount = 550; 
    const tickInterval = 300; 

    // Helper: Safely triggers hardware level events past NextJS hydration blocks
    function triggerFrameworkSafeClick(element) {
        if (!element) return;
        try {
            if (!element.id) {
                element.id = "gclh_auto_generated_" + Math.random().toString(36).substr(2, 9);
            }
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
                const ev = new PointerEvent(type, {
                    view: window, bubbles: true, cancelable: true, isTrusted: true, buttons: 1, relatedTarget: element
                });
                element.dispatchEvent(ev);
            });
        } catch (e) {
            console.log("[Auto-Clicker Warning] Suppressed event click error.");
        }
    }

    // CORE ENGINE: Triggered ONLY on user request click
    function runInfiniteScrollAndClick(statusLink) {
        let totalProcessed = 0;
        let lastScrollHeight = 0;
        let structuralStagnantCycles = 0;

        statusLink.textContent = "Processing...";
        statusLink.style.color = "#e67e22"; // Warm warning orange during operation
        console.log("[Auto-Clicker] User triggered sequence. Beginning infinite-scroll processing pass...");

        const container = document.querySelector('ul.tb-list.gclh_TBsObserver') || 
                          document.querySelector('ul.tb-list') || 
                          document.documentElement;

        const engineTimer = setInterval(() => {
            try {
                const currentButtons = document.querySelectorAll('button');
                let clickedInThisFrame = 0;

                // 1. Scan and toggle viewport nodes
                currentButtons.forEach(button => {
                    try {
                        const label = button.textContent.trim().toLowerCase();
                        if (label === targetActionText && button.getAttribute('aria-checked') !== 'true') {
                            triggerFrameworkSafeClick(button);
                            clickedInThisFrame++;
                            totalProcessed++;
                            statusLink.textContent = `Visiting... (${totalProcessed})`;
                        }
                    } catch (rowErr) {}
                });

                // 2. Adjust dynamic container scrolling boundaries
                let currentScrollHeight = 0;
                if (container && container !== document.documentElement) {
                    container.scrollTop += scrollAmount;
                    currentScrollHeight = container.scrollHeight;
                } else {
                    window.scrollBy(0, scrollAmount);
                    currentScrollHeight = document.documentElement.scrollHeight;
                }

                // 3. Termination evaluation
                if (clickedInThisFrame === 0 && currentScrollHeight === lastScrollHeight) {
                    structuralStagnantCycles++;
                    if (structuralStagnantCycles >= 10) { 
                        clearInterval(engineTimer);
                        statusLink.textContent = `Visit All ✔ (${totalProcessed})`;
                        statusLink.style.color = "#27ae60"; // Success Green
                        console.log(`[Auto-Clicker] 🏁 Sweep absolute. Processed: ${totalProcessed}`);
                    }
                } else {
                    structuralStagnantCycles = 0;
                }

                lastScrollHeight = currentScrollHeight;

            } catch (err) {
                console.log("[Auto-Clicker Error] Main thread catch protected runtime loop.");
            }
        }, tickInterval);
    }

    // INTERLOCK: Handles expanding the list first, then instantly kicks off the automation engine
    function handleUserVisitAllClick(e, statusLink) {
        e.preventDefault();
        
        let showAllBtn = document.querySelector('button[data-event-label="Cache Log - show all"]') || 
                         document.querySelector('button.gclh_hideTB_event');

        if (showAllBtn) {
            triggerFrameworkSafeClick(showAllBtn);
            statusLink.textContent = "Expanding list...";
            
            // Wait for verification loop instead of a hardcoded timer
            let checkCount = 0;
            const checker = setInterval(() => {
                const visibleButtons = document.querySelectorAll(`button`);
                let totalVisitButtons = 0;
                visibleButtons.forEach(btn => {
                    if (btn.textContent.trim().toLowerCase() === targetActionText) totalVisitButtons++;
                });

                const showAllBtnStillExists = document.querySelector('button[data-event-label="Cache Log - show all"]') || 
                                             document.querySelector('button.gclh_hideTB_event');

                if (totalVisitButtons > 20 || !showAllBtnStillExists || checkCount > 30) {
                    clearInterval(checker);
                    runInfiniteScrollAndClick(statusLink);
                }
                checkCount++;
            }, 300);
        } else {
            // Already expanded or missing button—proceed straight away
            runInfiniteScrollAndClick(statusLink);
        }
    }

    // UI RESTORATION LAYER: Places the custom control button inside the inventory subheader
    function injectVisitAllButton() {
        // Prevent duplicate injections across mutation rendering frames
        if (document.getElementById('gclh-custom-visit-all')) return;

        const container = document.querySelector('div.button-container');
        if (container) {
            console.log("[Auto-Clicker] Inserting manual 'Visit All' control element...");
            
            // Build matching styled button component matching Geocaching stylesheet designs
            const visitAllBtn = document.createElement('button');
            visitAllBtn.id = 'gclh-custom-visit-all';
            visitAllBtn.type = 'button';
            visitAllBtn.textContent = 'Visit All';
            
            // Copy Geocaching text styles directly from your template dump parameters
            visitAllBtn.className = "inline-block m-0 p-0 border-0 text-base bg-transparent font-input underline cursor-pointer text-blue-500 hover:no-underline";
            visitAllBtn.style.marginLeft = "12px"; // Add clean text spacing gap separation

            // Bind click lifecycle execution trigger
            visitAllBtn.addEventListener('click', (e) => handleUserVisitAllClick(e, visitAllBtn));

            // Append it right into the button zone row framework next to "Show All"
            container.appendChild(visitAllBtn);
        }
    }

    // Watch DOM and inject UI element the exact millisecond the panel loads
    const uiObserver = new MutationObserver(() => injectVisitAllButton());
    uiObserver.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectVisitAllButton();
    }
})();
