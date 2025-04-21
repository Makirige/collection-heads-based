/**
 * Notifications management module
 * This module manages the display and hiding of notifications in the application
 */
(function() {
  'use strict';
  
  // Timers stored by notification ID
  const notificationTimers = {};
  
  // Function to display a notification
  function showNotification(elementId, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Notification element with ID "${elementId}" not found`);
      return false;
    }
    
    // Clear any existing timer for this notification
    if (notificationTimers[elementId]) {
      clearTimeout(notificationTimers[elementId]);
    }
    
    // Display the notification
    element.style.display = 'flex';
    console.log(`Notification "${elementId}" displayed`);
    
    // Set up timer to hide the notification after the specified delay
    if (duration > 0) {
      notificationTimers[elementId] = setTimeout(() => {
        element.style.display = 'none';
        console.log(`Notification "${elementId}" hidden after ${duration}ms`);
        delete notificationTimers[elementId];
      }, duration);
    }
    
    return true;
  }
  
  // Function to hide a notification immediately
  function hideNotification(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Notification element with ID "${elementId}" not found`);
      return false;
    }
    
    // Clear any existing timer
    if (notificationTimers[elementId]) {
      clearTimeout(notificationTimers[elementId]);
      delete notificationTimers[elementId];
    }
    
    // Hide the notification
    element.style.display = 'none';
    console.log(`Notification "${elementId}" manually hidden`);
    
    return true;
  }
  
  // Function to check if a notification is visible
  function isNotificationVisible(elementId) {
    const element = document.getElementById(elementId);
    return element && element.style.display !== 'none';
  }
  
  // Function to get all active notification timers
  function getActiveTimers() {
    return Object.assign({}, notificationTimers);
  }
  
  // Expose functions to global scope
  window.notificationSystem = {
    show: showNotification,
    hide: hideNotification,
    isVisible: isNotificationVisible,
    getActiveTimers: getActiveTimers
  };
  
  // Ensure notification timers are not removed by other scripts
  window.protectNotificationTimers = function() {
    return Object.values(notificationTimers);
  };
})(); 