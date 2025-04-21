/**
 * Module de gestion des notifications
 * Ce module gère l'affichage et la disparition des notifications dans l'application
 */
(function() {
  'use strict';
  
  // Timers stockés par ID de notification
  const notificationTimers = {};
  
  // Fonction pour afficher une notification
  function showNotification(elementId, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Élément de notification avec ID "${elementId}" non trouvé`);
      return false;
    }
    
    // Nettoyer tout timer existant pour cette notification
    if (notificationTimers[elementId]) {
      clearTimeout(notificationTimers[elementId]);
    }
    
    // Afficher la notification
    element.style.display = 'flex';
    console.log(`Notification "${elementId}" affichée`);
    
    // Configurer le timer pour masquer la notification après le délai spécifié
    if (duration > 0) {
      notificationTimers[elementId] = setTimeout(() => {
        element.style.display = 'none';
        console.log(`Notification "${elementId}" masquée après ${duration}ms`);
        delete notificationTimers[elementId];
      }, duration);
    }
    
    return true;
  }
  
  // Fonction pour masquer une notification immédiatement
  function hideNotification(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Élément de notification avec ID "${elementId}" non trouvé`);
      return false;
    }
    
    // Nettoyer tout timer existant
    if (notificationTimers[elementId]) {
      clearTimeout(notificationTimers[elementId]);
      delete notificationTimers[elementId];
    }
    
    // Masquer la notification
    element.style.display = 'none';
    console.log(`Notification "${elementId}" masquée manuellement`);
    
    return true;
  }
  
  // Fonction pour vérifier si une notification est visible
  function isNotificationVisible(elementId) {
    const element = document.getElementById(elementId);
    return element && element.style.display !== 'none';
  }
  
  // Fonction pour obtenir tous les timers de notification actifs
  function getActiveTimers() {
    return Object.assign({}, notificationTimers);
  }
  
  // Exposer les fonctions au scope global
  window.notificationSystem = {
    show: showNotification,
    hide: hideNotification,
    isVisible: isNotificationVisible,
    getActiveTimers: getActiveTimers
  };
  
  // S'assurer que les timers de notification ne sont pas supprimés par d'autres scripts
  window.protectNotificationTimers = function() {
    return Object.values(notificationTimers);
  };
})(); 