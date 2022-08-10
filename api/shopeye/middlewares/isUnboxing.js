/**
 * Product middleware to verify if product category is present 
 * @module ProductMiddleware
 */

 module.exports = ((req, res, next) => {
    if (!req.headers['category']) return res.sendBadRequest();
    
    if(req.headers['category'] != 'unboxing') return res.sendBadRequest();

    next();
});
