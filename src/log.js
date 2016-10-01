'use strict';

export default function setMessage(message, type, location) {
  const log = `${location}: ${message}`;
  switch(type){
    case 'error':
      console.error(log);
    case 'warn':
      console.warn(log);
    case 'info':
      console.info(log);
  };
}