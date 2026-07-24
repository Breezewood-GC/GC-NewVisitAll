# GC-Restore-Visit-All-Action-Button
TamperMonkey Code to restore the "Visit All" functionality related to trackables on Geocaching.com

On July 23, 2025, Geocaching.com announced via the Community forums that the "Visit All" functionality was removed when logging visits of Geocaching Trackables on cache visits. (https://forums.geocaching.com/GC/index.php?/topic/425855-release-notes-website-trackable-inventory-on-cache-logs-july-23-2025/) While the possibility of manually selecting which trackables a player wants to visit a cache site still exists, the blanket option known as "Visit All" which automatically set all trackables was disabled/removed.

The script can be installed from Greasyfork at this url: https://greasyfork.org/en/scripts/585063-geocaching-restore-visit-all-action-button

This script is an attempt to restore the functionality of the "Visit All" button while submitting cache logs.

• Initial version (08/13/2025): Initial file - Extremely broken | Establishing framework

• Production ready code (06/30/2026) - reviewed initial functions (trashed a lot, added a lot)

• Huge progresses in the original production ready code. (6/30/2026) - Functionality is largely there but a pesky bug exists that prevents the code to correctly display "Visit All" if the "Show All" link is pressed/clicked before the page is fully loaded. This is due to Geocaching site js code that destroys the inventory header and replaces it with a fresh copy if this script is triggered before full page load.
