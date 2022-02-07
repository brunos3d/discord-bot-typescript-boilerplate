import mongoose from 'mongoose';

import botConfigs from '../../config';

function setup(): Promise<typeof mongoose> {
  const DB_URI = `mongodb://${botConfigs.db.username}:${botConfigs.db.password}@${botConfigs.db.host}/${botConfigs.db.name}?retryWrites=true&w=majority`;
  return mongoose.connect(DB_URI);
}

export default setup;
