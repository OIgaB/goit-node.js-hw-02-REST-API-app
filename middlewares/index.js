// імпорт в routes/api/contacts.jsb 
export { default as isEmptyBody } from './isEmptyBody.js';
export { default as isValidId } from './isValidId.js';
export { default as authenticate } from './authenticate.js';

// імпорт в models/contacts.js і в models/user.js
export { default as validateAtUpdate } from './validateAtUpdate.js';  
export { default as handleMongooseError } from './handleMongooseError.js';