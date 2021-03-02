import {runAuthWithCallbacks} from './gmail-auth';
import {trelloReport} from './trello-report-emails';

runAuthWithCallbacks([trelloReport]);
