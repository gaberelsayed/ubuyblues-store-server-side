const { getResponseObject } = require("../global/functions");

const couponsOPerationsManagmentFunctions = require("../models/coupons.model");

async function getAllCoupons(req, res) {
    try{
        const result = await couponsOPerationsManagmentFunctions.getAllCoupons(req.data._id);
        if (result.error) {
            if (
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postAddNewCoupon(req, res) {
    try{
        const result = await couponsOPerationsManagmentFunctions.addNewCoupon(req.data._id, { code, discountPercentage } = req.body);
        if (result.error) {
            if (
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putCouponInfo(req, res) {
    try{
        const result = await couponsOPerationsManagmentFunctions.updateCouponInfo(req.data._id, req.params.couponId, req.body);
        if (result.error) {
            if (
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteCoupon(req, res) {
    try{
        const result = await couponsOPerationsManagmentFunctions.deleteCoupon(req.data._id, req.params.couponId);
        if (result.error) {
            if (
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAllCoupons,
    postAddNewCoupon,
    putCouponInfo,
    deleteCoupon
}