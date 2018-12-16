const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const Logger = require ('../lib/logger');
const logger = new Logger("apify");

const options = {
  key: fs.readFileSync('./.https/localhost.key'),
  cert: fs.readFileSync('./.https/localhost.crt')
};


const server = https.createServer(options, (req, res) => {
  getHandler(req)
    .then(handler => handler())
    .then( result => {
      res.setHeader('content-type', 'application/json');
      res.writeHead(result[0]);
      res.end(JSON.stringify(result[1]));
    })
    .catch(e => {
      logger.error(e);
      res.writeHead(500);
      res.end();
    });
}).listen(3001);

logger.info(`https server listening at ${server.address().port}`);

let handlers = {
  notFound: () => Promise.resolve([404, {}]),
  get: {},
  post: {},
  put: {},
  delete: {}
};


const LeadingTrailingSlashes = /\/+$/g;
const getHandler = req => {
  let parsedUrl = url.parse(req.url, true);

  let path = parsedUrl.pathname.replace(LeadingTrailingSlashes, '') || '/';
  let method = req.method.toLowerCase();
  let handler = handlers[method][path];

  if(!handler) {
    logger.debug(`not found: ${method} ${path} `);
    return Promise.resolve(() => handlers.notFound());
  }

  return new Promise((resolve, reject) => {
    let payload = '';
    req.on('data',  d => payload += decoder.write(d));
    req.on('error', e => reject(e));
    req.on('end',  () => {
      payload += decoder.end();
      try{
        let data = Object.assign({}, JSON.parse(payload || '{}'), parsedUrl.query);
        logger.debug(`${method} ${path} ${JSON.stringify(data)}`);
        resolve( () => handler(data));
      }
      catch(e){
        reject(e);
      }
    });
  });

};

const registerPath = (verb, path, callback) => {
  handlers[verb][path] = callback;
};

const get = (path, callback) => registerPath('get', path, callback);
const post = (path, callback) => registerPath('post', path, callback);
const put = (path, callback) => registerPath('put', path, callback);
const del = (path, callback) => registerPath('delete', path, callback);

module.exports = {
  get,
  post,
  put,
  del
};
