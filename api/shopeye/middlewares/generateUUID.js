/**
 * Product middleware to verify if product category is present 
 * @module UUIDMiddleware
 */
const { v4: uuidv4 } = require('uuid');

module.exports = ((req, res, next) => {
    req.body.messageId = uuidv4();

    next();
});
