// Import Subscription Model Object

const { subscriptionModel } = require("../models/all.models");

async function addNewSubscription(email) {
    try {
        const subscription = await subscriptionModel.findOne({ email });
        if (subscription) {
            return {
                msg: "Sorry, This Subscription Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        await (new subscriptionModel({
            email,
        })).save();
        return {
            msg: "Creating New Subscription Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewSubscription,
}