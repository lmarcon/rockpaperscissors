require('../css/main.scss');

import config from './config';
import {domReady} from './utils';
import RockPaperScissors from './RockPaperScissors';

domReady(function() {
	new RockPaperScissors(config, '#game');
});
