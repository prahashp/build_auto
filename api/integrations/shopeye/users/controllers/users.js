/**
 * @name api_stores_controllers_store
 * @description Users Controller
 */

// services
const userService = require('.././services/users'),
    _ = require('lodash');

module.exports.create = async (req, res) => {
    try{
        const input = req.body;

        let query = { 
            $or: [ { mobile: input.mobile}, {companyName: input.companyName } ]
        }
    
        let user = await userService.validateUser(query);
        if (user) {
            res.sendBadRequest('Another user exists with similar data. Provide valid input.');
            return;
        }

        input['active'] = true;
        await userService.insert(input);
        res.sendSuccess('Success! Account updated successfully.')
    }catch(error){
        console.log(error)
        if (error.name === 'MongoServerError'){
            res.sendServerError(error);
        }
        else if (error.name === 'ValidationError')
            res.sendBadRequest(error);
        else
            res.sendServerError(error);
    }

};

module.exports.update = async (req, res) => {
    try{
        const input = req.body;

        let query = { 
            $or: [ { mobile: input.mobile}, {companyName: input.companyName } ],
            _id: {$ne : req.params.id}
        }
    
        let user = await userService.validateUser(query);
        if (user) {
            res.sendBadRequest('Another user exists with similar data. Provide valid input.');
            return;
        }
    
        await userService.updateOne({_id: req.params.id}, input)
        res.sendSuccess('Success! Account updated successfully.')
    }catch(error){
        console.log(error)
        if (error.name === 'MongoServerError'){
            res.sendServerError(error);
        }
        else if (error.name === 'ValidationError')
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
        let user = await userService.getMany({});
        res.sendSuccess(user)
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

