import {gmail_v1, google} from 'googleapis';
import {OAuth2Client } from 'google-auth-library';

/**
 * Trello Kanban report emails
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function trelloReport(auth: OAuth2Client): Promise<void> {
    const gmail: gmail_v1.Gmail = google.gmail({version: 'v1', auth});
    const messages: gmail_v1.Schema$Message[] = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:Monthly Report for WebApps'
    })
        .then((res) => res.data)
        .then((result: gmail_v1.Schema$ListMessagesResponse) =>
            Promise.all(
                result.messages.map(i => gmail.users.messages.get({
                    userId: 'me',
                    id: i.id,
                    format: 'FULL'
                })
                    .then(i => i.data)
                )
            )
        )
        .catch((err) => {
            console.error(err);
            return null;
        });
    console.log(messages)
  }
