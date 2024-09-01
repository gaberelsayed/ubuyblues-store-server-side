const { getResponseObject, sendVerificationCodeToUserEmail, sendCongratulationsOnCreatingNewAccountEmail, sendChangePasswordEmail } = require("../global/functions");

const usersOPerationsManagmentFunctions = require("../models/users.model");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../models/account_codes.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "firstName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "lastName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "isVerified") filtersObject[objectKey] = Boolean(filters[objectKey]);
    }
    return filtersObject;
}

async function login(req, res) {
    try{
        const { email, password } = req.query;
        const result = await usersOPerationsManagmentFunctions.login(email.toLowerCase(), password);
        if (!result.error) {
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token: sign(result.data, process.env.secretKey, {
                        expiresIn: "7d",
                    }),
                },
            });
            return;
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function loginWithGoogle(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.loginWithGoogle(req.query);
        res.json({
            msg: result.msg,
            error: result.error,
            data: {
                ...result.data,
                token: sign(result.data, process.env.secretKey, {
                    expiresIn: "7d",
                }),
            },
        });
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getUsersCount(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.getUsersCount(req.data._id, getFiltersObject(req.query));
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
            res.json(result);
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllUsersInsideThePage(req, res) {
    try{
        const filters = req.query;
        const result = await usersOPerationsManagmentFunctions.getAllUsersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters));
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
            res.json(result);
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const { email, userType } = req.query;
        let result = await usersOPerationsManagmentFunctions.isExistUserAccount(email, userType);
        if (!result.error) {
            if (userType === "user") {
                if (!result.data.isVerified) {
                    res.json({
                        msg: "Sorry, The Email For This User Is Not Verified !!",
                        error: true,
                        data: result.data,
                    });
                    return;
                }
            }
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, "to reset password");
            if (result.error) {
                res.json(result);
                return;
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                res.json(await addNewAccountVerificationCode(email, result.data, "to reset password"));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function createNewUser(req, res) {
    try {
        const { email, password, language } = req.body;
        const result = await usersOPerationsManagmentFunctions.createNewUser(email.toLowerCase(), password, language);
        if (result.error) {
            return res.json(result);
        }
        await sendCongratulationsOnCreatingNewAccountEmail(email, language);
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try{
        const { email, typeOfUse, userType } = req.query;
        let result = typeOfUse === "to activate account" && userType === "user" ? await usersOPerationsManagmentFunctions.isExistUserAndVerificationEmail(email) : usersOPerationsManagmentFunctions.isExistUserAccount(email, userType);
        if (!result.error) {
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, typeOfUse);
            if (result.error) {
                res.json(result);
                return;
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                res.json(await addNewAccountVerificationCode(email, result.data, typeOfUse));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try{
        const { email, code } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to activate account");
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.updateVerificationStatus(email);
            if (!result.error) {
                return res.json({
                    msg: result.msg,
                    error: result.error,
                    data: {
                        ...result.data,
                        token: sign(result.data, process.env.secretKey, {
                            expiresIn: "7d",
                        }),
                    },
                });
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const { email, userType, code, newPassword } = req.query;
        const result = await isAccountVerificationCodeValid(email, code, "to reset password");
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.resetUserPassword(email, userType, newPassword);
            if (!result.error) {
                await sendChangePasswordEmail(email, result.data.language)
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteUser(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.deleteUser(req.data._id, req.params.userId);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
            res.json(result);
            return;
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    createNewUser,
    postAccountVerificationCode,
    login,
    loginWithGoogle,
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    getForgetPassword,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    deleteUser
}