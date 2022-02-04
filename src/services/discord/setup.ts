import ClientInstance from './client';

import botConfigs from '../../config';

function setup() {
  ClientInstance.login(botConfigs.bot.token);
}

export default setup;
