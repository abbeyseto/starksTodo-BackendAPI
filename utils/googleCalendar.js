const fs = require("fs");
const { google } = require("googleapis");

const googleCalendarApi = (clientId, refresh_token, body) => {
  const oAuth2Client = new google.auth.OAuth2(clientId);
  oAuth2Client.setCredentials({
    refresh_token: refresh_token,
  });

  let auth = oAuth2Client;

  const calendar = google.calendar({ version: "v3", auth });

  // Create a new event start date instance for temp uses in our calendar.
  const eventStartTime = new Date(body.start.dateTime);
  // eventStartTime.setDate(eventStartTime.getDay());

  // Create a new event end date instance for temp uses in our calendar.
  const eventEndTime = new Date(body.end.dateTime);
  // eventEndTime.setDate(eventEndTime.getDay());
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

  console.log(eventStartTime, eventEndTime);

  let payload = body;
  payload["start"]["datetime"] = eventStartTime;
  payload["end"]["datetime"] = eventEndTime;

  // Check if we a busy and have an event on our calendar for the same time.
  const checkAndCreateCalendar = (payload) => {
    // Cleaning up data
    delete payload._user;
    delete payload.status;
    delete payload.type;
    delete payload.date;
    delete payload.time;
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
            { calendarId: "primary", resource: payload },
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
  };
  checkAndCreateCalendar(payload);
};

module.exports = googleCalendarApi;
