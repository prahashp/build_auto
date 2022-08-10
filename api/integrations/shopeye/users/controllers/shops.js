/**
 * @name api_stores_controllers_store
 * @description Users Controller
 */

// services
const userService = require('.././services/users'),
    shopService = require('.././services/shops'),
    _ = require('lodash'),
    utils = require('../../../.././core/modules/utils'),
    crypto = require('../../../.././core/modules/crypto'),
    bluebird = require('bluebird');

module.exports.create = (req, res) => {
    const input = req.body;
    input.password = utils.getUuid();
    return new bluebird((resolve) => {
        let query = {
            email: input.email
        };

        if (input.phone)
            query.phone = input.phone;

        resolve(query);
    })
        .then(query => {
            const getCurrentUser = { _id: req.user };
            const getcurrentBrandUserCOunt={brandId:req.user.brandId}
            return bluebird.all([
                userService.getOne(query),
                userService.getCount(getcurrentBrandUserCOunt),
                userService.getOne(getCurrentUser),

            ]);
        })
        .spread((user, count, adminUser) => {
            if (user) {
                res.sendBadRequest('Email/Phone already exists. Provide valid input.');
                return;
            }

            return crypto.encrypt(_.get(input, 'password', ''))
                .then(password => {
                    input.password = password;
                    input.clientIndex = count + 1;
                    input.brandId = adminUser.brandId;
                    return userService.insert(input);
                })
                .then(() => {
                    res.sendSuccess('Success! Please verify your email to activate your account.')
                });
        })
        .catch(error => {
            if (error.name === 'ValidationError')
                res.sendBadRequest(error);
            else
                res.sendServerError(error);
        });

};

module.exports.update = async (req, res) => {
    try{
        const input = req.body;

        let query = {
            _id: req.params.id
        };
    
        let user = await userService.getOne(query);
        if (!user) {
            res.sendBadRequest('User doesnot exists. Provide valid input.');
            return;
        }
    
        await userService.updateOne(query, input)
        res.sendSuccess('Success! Account updated successfully.')
    }catch(error){
        if (error.name === 'ValidationError')
            res.sendBadRequest(error);
        else
            res.sendServerError(error);
    }
};

module.exports.delete = async (req, res) => {
    try{
        let query = {
            _id: req.params.id
        };
    
        let user = await userService.getOne(query);
        if (!user) {
            res.sendBadRequest('User doesnot exists. Provide valid input.');
            return;
        }
    
        await userService.updateOne(query, {active: false})
        res.sendSuccess('Success! Account deleted successfully.')
    }catch(error){
        if (error.name === 'ValidationError')
            res.sendBadRequest(error);
        else
            res.sendServerError(error);
    }
};

module.exports.list= async (req, res) => {
    try{
        let shops = await shopService.getAllShops({}, {companyName:1});
        res.sendSuccess(shops)
    }catch(error){
        if (error.name === 'ValidationError')
            res.sendBadRequest(error);
        else
            res.sendServerError(error);
    }
};

module.exports.find = async (req, res) => {
    try{
        const _id = req.params.id;
    
        let user = await userService.getOne({_id});
        if (!user) {
            res.sendBadRequest('User doesnot exists. Provide valid input.');
            return;
        }
    
        res.sendSuccess(user)
    }catch(error){
        console.log(error)
        if (error.name === 'ValidationError')
            res.sendBadRequest(error);
        else
            res.sendServerError(error);
    }
};

