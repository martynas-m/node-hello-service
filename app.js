const {get, post} = require ('./lib/apify');


get('hello', params => {
  return Promise.resolve([200, {result: 'hello, my dear friend!', params}]);
});

get('', params => {
  return Promise.resolve([200, {result: 'try /hello', params}]);
});

post('api/data', params => {
  return Promise.resolve([200, {result: 'ok', params}]);
});
