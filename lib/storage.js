const fs = require('fs');
const path = require('path');
const Logger = require ('./logger');
const logger = new Logger("storage");


const writeFile = (fileDescriptor, data, options) => new Promise((resolve, reject) => {
  logger.debug(`write to ${fileDescriptor}`);
  fs.writeFile(fileDescriptor, data, options, (err) => {
    if(err){
      logger.debug(err);
      return reject(err);
    }
    logger.debug(`written to ${fileDescriptor}`);
    return resolve(fileDescriptor);
  });
});

const readFile = (filePath ) => new Promise((resolve, reject) => {
  logger.debug(`reading ${filePath}`);
  fs.readFile(filePath, 'utf8', (err,data) => {

    if(err){
      logger.debug(err);
      return reject(err);
    }

    return resolve(JSON.parse(data));
  });
});

const unlink = filePath => new Promise((resolve, reject) => {
  fs.unlink(filePath, err => {
    if(err){
      logger.debug(err);
      return reject(err);
    }
    return resolve();
  });
});


module.exports = function(baseDir) {
  this._baseDir = baseDir;

  this._makePath = function(collection, id) {
    return path.join(this._baseDir, collection, id);
  }

  this.create = function(collection, id, data) {
    return writeFile(this._makePath(collection, id), JSON.stringify(data), {flag: 'wx'});
  }

  this.read = function(collection, id) {
    return readFile(this._makePath(collection, id));
  }

  this.update = function(collection, id, data) {
    return writeFile(this._makePath(collection, id), JSON.stringify(data), {flag: 'w'});
  }

  this.delete = function(collection, id){
    return unlink(this._makePath(collection, id));
  }
};
