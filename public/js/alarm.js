// Ask user to allow notification access
console.log('Loading alarm system...');

if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
      alert("Please allow notification access");
      location.reload();
    }
  }).catch((error) => {
    alert("Error: " + error);
  });
}

let timeoutIds = [];
const currentTime = new Date();

// Function to check and schedule notifications for upcoming alarms
const scheduleNotifications = (alarms) => {
  alarms.forEach((alarm) => {
    if (!alarm || !alarm.dateTime) {
      console.error("Invalid alarm data:", alarm); // Add this error-checking for unexpected data
      return;
    }

    const alarmTime = new Date(alarm.dateTime);
    console.log("Scheduling notification for:", alarm.title, "| Alarm Time:", alarmTime, "| Current Time:", currentTime);
    
    if (alarmTime > currentTime) {
      let timeDifference = alarmTime - currentTime;
      console.log("Time difference for alarm:", timeDifference, "milliseconds");

      let timeoutId = setTimeout(() => {
        console.log("Triggering notification for:", alarm.title);
        document.getElementById("notificationSound").play();

        new Notification(alarm.title, {
          body: alarm.description,
          requireInteraction: true,
        });
      }, timeDifference);

      timeoutIds.push(timeoutId);
    }
  });
};


// Function to load alarms from the database and display them in the table
const loadAlarmsFromDatabase = async () => {
  try {
    const response = await fetch("https://chief-helge-alarmproject-bcf739b8.koyeb.app/api/reminders");

    if (response.ok) {
      const alarms = await response.json();
      console.log("Loaded alarms:", alarms);

      const ul = document.querySelector("#customers");

      alarms.forEach((alarm) => {
        const alarmTime = new Date(alarm.dateTime);

        if (alarmTime > currentTime) {
          const details = document.createElement("tr");
          details.innerHTML = `
            <td>${alarm.title}</td>
            <td>${alarm.description}</td>
            <td>${alarm.dateTime}</td>
          `;
          ul.append(details);
        }
      });

      // Schedule alarms that are still in the future
      scheduleNotifications(alarms);
    } else {
      console.error("Failed to load alarms:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading alarms:", error);
  }
};

const initializeAlarms = () => {
  loadAlarmsFromDatabase(); // Load and schedule alarms after user interaction
  document.getElementById("startAlarms").style.display = 'none'; // Hide button after interaction
};

// Load alarms from the database when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startAlarms");
  startButton.style.display = 'block'; // Ensure button is visible when page loads
});
