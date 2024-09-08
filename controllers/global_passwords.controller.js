const { getResponseObject } = require("../global/functions");

const globalPasswordsManagmentFunctions = require("../models/global_passwords.model");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const { email, password, newPassword } = req.query;
        const result = await globalPasswordsManagmentFunctions.changeBussinessEmailPassword(req.data._id, email.toLowerCase(), password, newPassword);
        if (result.error) {
            if (result.msg !== "Sorry, Email Or Password Incorrect !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}