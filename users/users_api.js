const path = require('path');
const {get, post, put, del} = require ('../lib/apify');
const Storage = require('../lib/storage');
const Logger = require ('../lib/logger');
const logger = new Logger("users api");

const dataDir = path.join(__dirname,'../.data');
const storage = new Storage(dataDir);

post('/api/users', user => storage
  .create('users', user.name, user)
  .then( () => [201, null])
  .catch( e => {
    console.log(e);
    return [e.code === 'EEXIST' ? 409 : 500, {}];
  })
);

get('/api/users', params => storage
  .read('users', params.name)
  .then(user => [200, user])
  .catch( e => {
    return [e.code === 'ENOENT' ? 404 : 500, {}];
  })
);

put('/api/users', user => storage
  .read('users', user.name)
  .then( existingUser => Object.assign(existingUser, user))
  .then( newData => storage.update('users', user.name, newData))
  .then( () => [200, null])
  .catch( e => {
    return [e.code === 'ENOENT' ? 404 : 500, {}];
  })
);

del('/api/users', params => storage
  .delete('users', params.name)
  .then(() => [200, {}])
  .catch( e => {
    return [e.code === 'ENOENT' ? 404 : 500, {}];
  })
);

logger.info('started.');
