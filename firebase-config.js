// Firebase Configuration for Push Notifications
// Replace with your actual Firebase config

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase (if using Firebase SDK)
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Push Notification Service
class PushNotificationService {
  constructor() {
    this.serverKey = 'YOUR_FIREBASE_SERVER_KEY'; // Get this from Firebase Console
    this.apiUrl = 'https://fcm.googleapis.com/fcm/send';
  }

  // Send push notification to a specific device
  async sendToDevice(token, title, body, data = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title: title,
            body: body,
            sound: 'default',
            badge: '1'
          },
          data: data,
          priority: 'high'
        })
      });

      const result = await response.json();
      console.log('Push notification sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Send push notification to multiple devices
  async sendToMultipleDevices(tokens, title, body, data = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registration_ids: tokens,
          notification: {
            title: title,
            body: body,
            sound: 'default',
            badge: '1'
          },
          data: data,
          priority: 'high'
        })
      });

      const result = await response.json();
      console.log('Push notifications sent to multiple devices:', result);
      return result;
    } catch (error) {
      console.error('Error sending push notifications:', error);
      throw error;
    }
  }

  // Send notification to all users (topic)
  async sendToTopic(topic, title, body, data = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: `/topics/${topic}`,
          notification: {
            title: title,
            body: body,
            sound: 'default',
            badge: '1'
          },
          data: data,
          priority: 'high'
        })
      });

      const result = await response.json();
      console.log('Push notification sent to topic:', result);
      return result;
    } catch (error) {
      console.error('Error sending push notification to topic:', error);
      throw error;
    }
  }

  // Schedule notification for later
  async scheduleNotification(token, title, body, scheduledTime, data = {}) {
    // This would require a backend service to handle scheduling
    // For now, we'll use local scheduling
    const timeUntilNotification = scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        this.sendToDevice(token, title, body, data);
      }, timeUntilNotification);
      
      console.log(`Notification scheduled for ${scheduledTime}`);
      return true;
    }
    
    return false;
  }

  // Send event reminder notification
  async sendEventReminder(token, eventTitle, eventTime, eventDate) {
    const title = `Recordatorio: ${eventTitle}`;
    const body = `Tu evento "${eventTitle}" comienza en 1 hora (${eventTime})`;
    const data = {
      action: 'view_event',
      eventTitle: eventTitle,
      eventTime: eventTime,
      eventDate: eventDate
    };

    return await this.sendToDevice(token, title, body, data);
  }

  // Send task reminder notification
  async sendTaskReminder(token, taskTitle, taskTime) {
    const title = `Tarea pendiente: ${taskTitle}`;
    const body = `Tienes una tarea programada para las ${taskTime}`;
    const data = {
      action: 'view_tasks',
      taskTitle: taskTitle,
      taskTime: taskTime
    };

    return await this.sendToDevice(token, title, body, data);
  }

  // Send daily summary notification
  async sendDailySummary(token, tasksCount, eventsCount) {
    const title = 'Resumen del día';
    const body = `Tienes ${tasksCount} tareas y ${eventsCount} eventos programados para hoy`;
    const data = {
      action: 'open_calendar',
      tasksCount: tasksCount,
      eventsCount: eventsCount
    };

    return await this.sendToDevice(token, title, body, data);
  }
}

// Export service
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PushNotificationService;
} else {
  // Browser environment
  window.PushNotificationService = PushNotificationService;
}

// Usage examples:
/*
const pushService = new PushNotificationService();

// Send immediate notification
pushService.sendToDevice(
  'device_token_here',
  'Nueva tarea',
  'Tienes una nueva tarea asignada',
  { action: 'view_tasks' }
);

// Send event reminder
pushService.sendEventReminder(
  'device_token_here',
  'Reunión de equipo',
  '14:00',
  '2024-01-15'
);

// Send daily summary
pushService.sendDailySummary(
  'device_token_here',
  5,
  3
);
*/
