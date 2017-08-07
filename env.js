const _ = require('lodash');
const util = require('util');
const nconf = require('nconf');

const env = module.exports;

const vars = {
  // Do not define NODE_ENV for Heroku
  NODE_ENV: {
    required: true,
    export: true,
  },
  // Do not define PORT for Heroku
  PORT: {
    required: true,
    export: true,
    type: Number,
  },
  // picture path
  PICTURE_PATH: {
    required: true,
    export: true,
    type: String,
  },  

};
_.each(vars, (envProps, envName) => {
  let envVal = nconf.get(envName) || '[UNDEFINED]';

  // Required
  if (envProps.required && envVal === '[UNDEFINED]') {
    // eslint-disable-next-line no-console
    console.error(
      `├── Missing ENV Variable: ${envName}. Check your .env file.`
    );
    process.exit(1);
  }

  // Cast to Number
  if (envProps.type === Number) {
    envVal = Number(envVal);
  }

  // Export
  if (envProps.export) {
    env[envName] = envVal;
  }

  // Redacted
  if (envProps.redacted) {
    envVal = '[REDACTED]';
  }

  // eslint-disable-next-line no-console
  console.log(`├── ${envName}=${envVal} ──┤`);
});

// Dump for debugging
global.dump = (...args) => {
  if (env.NODE_ENV !== 'development') return;
  try {
    for (var i in args) {
      console.log(
        util.inspect(args[i], {
          showHidden: true,
          colors: true,
          depth: 7,
        })
      );
    }
  } catch (e) {
    throw new Error('Dump Error: ' + e);
  }
};
