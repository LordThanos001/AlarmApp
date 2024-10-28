// Request notification permission
console.log("Testing alarm app");

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

let timeoutMap = {}; // New object to map reminder IDs to timeout IDs

// Function to save the reminder to the database
const saveReminderToDatabase = async (title, description, dateTimeString) => {
  const reminderData = {
    title: title,
    description: description,
    dateTime: dateTimeString,
  };

  try {
    const response = await fetch("https://suitable-cody-testalarmapp-77be67d2.koyeb.app/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reminderData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Reminder saved to database:", result.reminder);
      return result.reminder._id;
    } else {
      console.error("Failed to save reminder:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving reminder:", error);
  }
};

// Function to load all reminders from the database and display them in the table
const loadRemindersFromDatabase = async () => {
  try {
    const response = await fetch("https://suitable-cody-testalarmapp-77be67d2.koyeb.app/api/reminders");
    if (response.ok) {
      const alarms = await response.json();
      const tableBody = document.getElementById("reminderTableBody");

      alarms.forEach((alarm) => {
        const { title, description, dateTime, _id } = alarm;
        addReminder(title, description, dateTime, _id);
      });

      scheduleNotifications(alarms); // Schedule any future reminders
    } else {
      console.error("Failed to load alarms:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading alarms:", error);
  }
};

// Function to schedule a new reminder
const scheduleReminder = async () => {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;

  let dateTimeString = `${date} ${time}`;
  let scheduleTime = new Date(dateTimeString);
  let currentTime = new Date();
  let timeDifference = scheduleTime - currentTime;

  if (timeDifference > 0) {
    const reminderId = await saveReminderToDatabase(title, description, dateTimeString);
    if (reminderId) {
      addReminder(title, description, dateTimeString, reminderId);

      let timeoutId = setTimeout(() => {
        document.getElementById("notificationSound").play();

        new Notification(title, {
          body: description,
          requireInteraction: true,
        });

        // Schedule deletion 1 minute after the reminder plays
        setTimeout(() => {
          const row = document.querySelector(`[data-reminder-id="${reminderId}"]`);
          if (row) deleteReminder(reminderId, row);
        }, 60000); // 1 minute delay

      }, timeDifference);

      timeoutMap[reminderId] = timeoutId; // Store the timeout ID with the reminder ID
    }
  } else {
    alert("The scheduled time is in the past!");
  }

  clearFormFields();
};

// Function to clear form fields
const clearFormFields = () => {
  document.getElementById("title").value = '';
  document.getElementById("description").value = '';
  document.getElementById("date").value = '';
  document.getElementById("time").value = '';
};

// Function to delete reminders from the database and the frontend
const deleteReminder = async (reminderId, row) => {
  try {
    const response = await fetch(`https://suitable-cody-testalarmapp-77be67d2.koyeb.app/api/reminders/${reminderId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      row.remove(); // Remove the reminder row from the table

      if (timeoutMap[reminderId]) {
        clearTimeout(timeoutMap[reminderId]); // Clear the timeout if it exists
        delete timeoutMap[reminderId]; // Remove it from the map
      }

      console.log("Reminder deleted successfully");
    } else {
      console.error("Failed to delete reminder:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
};

// This function adds new reminders to the frontend
const addReminder = (title, description, dateTimeString, reminderId) => {
  const tableBody = document.getElementById("reminderTableBody");
  const row = tableBody.insertRow();
  row.setAttribute("data-reminder-id", reminderId); // Set data attribute for easy access

  row.insertCell(0).innerHTML = title;
  row.insertCell(1).innerHTML = description;
  row.insertCell(2).innerHTML = dateTimeString;

  const deleteCell = row.insertCell(3);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteReminder(reminderId, row));
  deleteCell.appendChild(deleteButton);
};

// Load reminders from the database when the page loads
document.addEventListener("DOMContentLoaded", loadRemindersFromDatabase);
