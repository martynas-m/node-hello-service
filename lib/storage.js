const fs = require('fs');
const path = require('path');
const Logger = require ('./logger');
const logger = new Logger("storage");


const open = (filePath, mode) => new Promise((resolve, reject) => {
  logger.debug(`opening ${filePath}`);
  fs.open(filePath, mode, (err, fileDescriptor) => {
    if(err){
      logger.debug(err);
      return reject(err);
    }
    logger.debug(`opened ${filePath} as ${fileDescriptor}`);
    return resolve(fileDescriptor);
  });
});

const writeFile = (fileDescriptor, data) => new Promise((resolve, reject) => {
  logger.debug(`write to ${fileDescriptor}`);
  fs.writeFile(fileDescriptor, data, (err) => {
    if(err){
      logger.debug(err);
      return reject(err);
    }
    logger.debug(`written to ${fileDescriptor}`);
    return resolve(fileDescriptor);
  });
});

const close = (fileDescriptor) => new Promise((resolve, reject) => {
  logger.debug(`closing ${fileDescriptor}`);
  fs.close(fileDescriptor, err => {
    if(err){
      logger.debug(err);
      return reject(err);
    }
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

const create = (filePath, data) => open(filePath, 'wx')
  .then(descriptor => writeFile(descriptor, JSON.stringify(data)))
  .then(descriptor => close(descriptor));



module.exports = function(baseDir) {
  this._baseDir = baseDir;

  this._makePath = function(collection, id) {
    return path.join(this._baseDir, collection, id);
  }

  this.create = function(collection, id, data) {
    return create(this._makePath(collection, id), data);
  }

  this.read = function(collection, id) {
    return readFile(this._makePath(collection, id));
  }

  this.update = function(collection, id) {

  }

  this.delete = function(collection, id){
  }
};
