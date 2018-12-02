const https = require('https');
const url = require('url');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./.https/key.pem'),
  cert: fs.readFileSync('./.https/cert.pem')
};

const server = https.createServer(options, (req, res) => {
  getHandler(req)().then( result => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(result[0]);
    res.end(JSON.stringify(result[1]));
  });
}).listen(3001);

console.log('https server listening at ', server.address().port);

let handlers = {
  notFound: () => Promise.resolve([404, {}]),
  get: {},
  post: {},
  put: {},
  delete: {}
};

const getHandler = req => {
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toLowerCase();

  console.log(method, path, JSON.stringify(queryStringObject));

  let handler = handlers[method][path] || handlers.notFound;

  return () => handler(queryStringObject);
};

const get = (path, callback) => {
  handlers.get[path] = callback;
};

module.exports = {
  get
};
