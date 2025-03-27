class NotificationService {
  constructor() {
    this.permission = null;
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  async scheduleNotification(medication, time) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const now = new Date();
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime - now;
    
    setTimeout(() => {
      this.showNotification(medication);
      // Schedule next notification for tomorrow
      this.scheduleNotification(medication, time);
    }, timeUntilNotification);
  }

  showNotification(medication) {
    new Notification('Medication Reminder', {
      body: `Time to take ${medication.name} - ${medication.dosage}`,
      icon: '/favicon.ico'
    });
  }

  scheduleMedicationReminders(medications) {
    medications.forEach(medication => {
      if (medication.reminders.enabled) {
        medication.reminders.times.forEach(time => {
          this.scheduleNotification(medication, time);
        });
      }
    });
  }
}

export const notificationService = new NotificationService(); 