/**
 * @name api:shops:controllers:auth
 * @description Authentication Controller
 */

// services
const shopUsers = require('.././services/shop-users'),
utils = require("../.././core/modules/utils"),
sms = require("../.././core/modules/sms"),
tokenService = require("../../auth/services/tokens"),
users = require("../../users/services/users")

module.exports.login = (req, res) => {
        let query = {phone : req.body.mobile}
        users.findOne(query)
            .then(async (record) => {
                switch (true) {
                    case !record:
                        res.sendUnauthorized();
                        break;
                    case record.active && record.active == false:
                        res.sendUnauthorized();
                        break;
                    default:
                        if (record.active && record.active == true) {
                            let otp = utils.getOtp()
                            await users.updateOne({ phone: req.body.mobile }, { $set: { otp: otp, updatedAt: Date.now() } });
                            const cerifyToken = {
                                token: otp,
                                user: record._id,
                                type: "phone-otp",
                            };
                            const promises = [tokenService.insert(cerifyToken)];
                            promises.push(
                                sms.sendRegisteredSms({
                                    otp: otp,
                                    phone: "+91" + req.body.mobile,
                                })
                            );
                            res.sendSuccess({ data: "OTP Sent Successfully" });
                        } else res.sendUnauthorized();
                        break;
                }
            })
            .catch(error => {
                console.log("errror",error);
                res.sendBadRequest(error);
            })
    };

// Verify    
module.exports.verify = (req, res) => {
    users.findOne({ phone: req.body.mobile })
        .then(async (record) => {
         let token = await tokenService.getOne({token:req.body.otp})
            switch (true) {
                case !record:
                    res.sendUnauthorized();
                    break;
                case token.token == req.body.otp:
                    if (record.active && record.active == true) {

                        const authToken = {
                            token: utils.getUuid(),
                            refreshToken: utils.getUuid(),
                            user: record._id,
                            type: "access-token",
                        };
                        return tokenService.insert(authToken).then(() => {
                            res.sendSuccess({
                                accessToken: authToken.token,
                                refreshToken: authToken.refreshToken,
                            });
                        });
                    } else {
                        res.sendUnauthorized();
                        return
                    }
                default:
                    res.sendBadRequest({ data: 'Invalid OTP' })
                    break;
            }
        })
        .catch(error => {
            res.sendBadRequest(error);
        })
};

// Resend-OTP
module.exports.resendOTP = (req, res) => {
    let query = {phone : req.body.mobile}
        users.findOne(query)
        .then(async (record) => {
            if (!record) {
                res.sendUnauthorized();
                return;
            }
            let otpData = { otp: utils.getOtp() };
            // let updatedUser = await users.updateOne({ phone: req.body.mobile }, { $set: { otp: otpData.otp, updatedAt: Date.now() } });
            // if (updatedUser.modifiedCount) {
                users.findOne({ phone: req.body.mobile })
                    .then(async (record) => {
                        if (record) {
                            const cerifyToken = {
                                token: otpData.otp,
                                user: record._id,
                                type: "verify-user",
                            };

                            const promises = [tokenService.insert(cerifyToken)];
                            promises.push(
                                sms.sendRegisteredSms({
                                    otp: otpData.otp,
                                    phone: "+91" + record.phone,
                                })
                            );
                            res.sendSuccess({ data: "OTP Sent Successfully" });
                        }
                    })
            // } else {
                // res.sendBadRequest();

            // }

        })
        .catch(error => {
            console.log("error", error)
            res.sendBadRequest(error);
        })
};

// Registration
module.exports.register = (req, res) => {
    try {
        let data = req.body;
        if (!(data.mobile && data.companyName && data.location)) {
            res.sendBadRequest('Invalid data');
            return;
        }
        let condition = { $or: [{ mobile: data.mobile }] };
        shopUsers.findOne(condition)
            .then(async (record) => {
                if (record) {
                    res.sendBadRequest('User already exists');
                    return;
                }
                else {
                    let otpData = { otp: utils.getOtp() };
                    let createdUser = await shopUsers.create({ ...req.body, ...otpData });
                    const cerifyToken = {
                        token: createdUser.otp,
                        user: createdUser._id,
                        type: "access-token",
                    };

                    const promises = [tokenService.insert(cerifyToken)];
                    promises.push(
                        sms.sendRegisteredSms({
                            otp: createdUser.otp,
                            phone: "+91" + createdUser.mobile,
                        })
                    );
                    res.sendSuccess({ data: 'User Registered Successfully...' });

                }
            })
            .catch(error => {
                console.log("Error", error)
                res.sendBadRequest(error);
            })
    } catch (error) {
        res.sendBadRequest(error);
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        let data = req.body;

        shopUsers.updateOne({ _id: req.user.id }, data)
            .then(async (record) => {
                let updated = await shopUsers.findOne({ _id: req.user.id });
                res.sendSuccess(updated);
            })
            .catch(error => {
                res.sendBadRequest(error);
            })

    } catch (error) {
        res.sendBadRequest(error);
    }
}