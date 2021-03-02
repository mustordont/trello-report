import {gmail_v1, google} from 'googleapis';
import {OAuth2Client } from 'google-auth-library';

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export function listGmailLabels(auth: OAuth2Client) {
    const gmail: gmail_v1.Gmail = google.gmail({version: 'v1', auth});
    console.log('list', auth);
    gmail.users.labels.list({
      userId: 'me',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log('No labels found.');
      }
    });
  }
