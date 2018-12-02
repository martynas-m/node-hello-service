const {get} = require ('./lib/apify');


get('/hello', params => {
  return Promise.resolve([200, {result: 'hello, my dear friend!', params}]);
});

get('/', params => {
  return Promise.resolve([200, {result: 'try /hello', params}]);
});
