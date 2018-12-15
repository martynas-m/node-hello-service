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
);

del('api/users', params => storage
  .delete('users', params.name)
  .then(() => [200, {}])
);

logger.info('started.');
