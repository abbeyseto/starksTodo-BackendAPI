const fs = require("fs");
const { google } = require("googleapis");

const REFRESH_TOKEN =
  "1//03JlssW_Z-vrICgYIARAAGAMSNwF-L9IrhOBMEJlNA5p-YLLM3nKEmHsoxn_wMxy9Bm0SsYc-knHda2mY4QIM7CTfkCCPKlELNiw";
const clientId =
  "687737428733-133hbn8dllv3pja04ufmegp0h9fv66jh.apps.googleusercontent.com";

const oAuth2Client = new google.auth.OAuth2(clientId);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

let auth = oAuth2Client;

const calendar = google.calendar({ version: "v3", auth });

async function ListCalendars() {
  let calendars = await calendar.calendarList.list();
  console.log(calendars.data.items);
}
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents() {
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      if (events.length) {
        console.log(`Upcoming ${events.length} events:`);
        // console.log(events);
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
}

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date("2021-02-28T22:09:27.623Z");
// eventStartTime.setDate(eventStartTime.getDay());

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date("2021-02-28");
// eventEndTime.setDate(eventEndTime.getDay());
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

console.log(eventStartTime, eventEndTime);
// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Meeting with David`,
  location: `3595 California St, San Francisco, CA 94118`,
  description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: "Africa/Lagos",
  },
  end: {
    dateTime: eventEndTime,
    timeZone: "Africa/Lagos",
  },
  attendees: [
    {
      email: "adenleabbey@gmail.com",
    },
    {
      email: "adenleabbey@hotmail.com",
    },
  ],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 5 },
      { method: "popup", minutes: 5 },
    ],
  },
};

// Check if we a busy and have an event on our calendar for the same time.
function checkAndCreateCalendar() {
  calendar.freebusy.query(
    {
      resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: "Africa/Lagos",
        items: [{ id: "primary" }],
      },
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
      if (err) return console.error("Free Busy Query Error: ", err);

      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy;

      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
          { calendarId: "primary", resource: event },
          (err) => {
            // Check for errors and log them if they exist.
            if (err)
              return console.error("Error Creating Calender Event:", err);
            // Else log that the event was created.
            return console.log("Calendar event successfully created.");
          }
        );

      // If event array is not empty log that we are busy.
      return console.log(
        `Sorry, There is already an event for this time slot, choose another time slot`
      );
    }
  );
}

// ListCalendars();
// checkAndCreateCalendar();
listEvents();
