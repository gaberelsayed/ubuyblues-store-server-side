// Import Referal Model Object

const { referalModel } = require("../models/all.models");

async function addNewReferal(referalDetails) {
    try {
        const referal = await referalModel.findOne({ email: referalDetails.email });
        if (referal) {
            return {
                msg: "Sorry, This Referal Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        await (new referalModel(referalDetails)).save();
        return {
            msg: "Creating New Referal Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductReferalsCount(filters) {
    try {
        return {
            msg: "Get Product Referals Count Process Has Been Successfully !!",
            error: false,
            data: await referalModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProductReferalsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get Products Count Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await referalModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewReferal,
    getProductReferalsCount,
    getAllProductReferalsInsideThePage,
}