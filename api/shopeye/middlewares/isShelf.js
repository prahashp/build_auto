/**
 * Product middleware to verify if shelf category is present 
 * @module ShelfMiddleware
 */

 module.exports = ((req, res, next) => {
    if (!req.headers['category']) return res.sendBadRequest();

    if(req.headers['category'] != 'shelf') return res.sendBadRequest();

    next();
});
