// Import Global Password Model And Admin Model Object

const { globalPasswordModel, adminModel } = require("./all.models");

// require cryptoJs module for password encrypting

const { AES, enc } = require("crypto-js");

async function getPasswordForBussinessEmail(email){
    try{
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            return {
                msg: "Get Password For Bussiness Email Process Has Been Successfully !!",
                error: false,
                data: AES.decrypt(user.password, process.env.secretKey).toString(enc.Utf8),
            }
        }
        return {
            msg: "Sorry, Email Incorrect !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(authorizationId, email, password, newPassword) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (admin.isWebsiteOwner) {
                const user = await globalPasswordModel.findOne({ email });
                if (user) {
                    const bytes = AES.decrypt(user.password, process.env.secretKey);
                    const decryptedPassword = bytes.toString(enc.Utf8);
                    if (decryptedPassword === password) {
                        await globalPasswordModel.updateOne({ password: AES.encrypt(newPassword, process.env.secretKey).toString() });
                        return {
                            msg: "Changing Bussiness Email Password Process Has Been Successfully !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, Email Or Password Incorrect !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, Email Or Password Incorrect !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, Permission Denied Because This Admin Is Not Website Owner !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}