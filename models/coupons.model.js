// Import Admin Model Object

const { adminModel, couponModel } = require("./all.models");

async function getAllCoupons(admintId) {
    try {
        const admin = await adminModel.findById(admintId);
        if (admin) {
            if (!admin.isBlocked) {
                return {
                    msg: "Get All Coupons Process Has Been Successfully !!",
                    error: false,
                    data: await couponModel.find({ storeId: admin.storeId }),
                }
            }
            return {
                msg: "Sorry, This Admin Has Been Blocked !!",
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getCouponDetails(code) {
    try{
        const couponDetails = await couponModel.findOne({ code });
        if (couponDetails) {
            return {
                msg: "Get Coupon Details Process Has Been Successfully !!",
                error: false,
                data: couponDetails,
            }
        } else {
            return {
                msg: "Sorry, This Code Is Not Exist !!",
                error: true,
                data: {},
            }
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function addNewCoupon(adminId, couponInfo) {
    try{
        const admin = await adminModel.findById(adminId);
        if (admin) {
            if (!admin.isBlocked) {
                const couponDetails = await couponModel.findOne({ code: couponInfo.code });
                if (!couponDetails) {
                    couponInfo.storeId = admin.storeId;
                    await(new couponModel(couponInfo)).save();
                    return {
                        msg: "Create New Coupon Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Coupon Is Already Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Admin Has Been Blocked !!",
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateCouponInfo(adminId, couponId, newCouponDetails) {
    try {
        const admin = await adminModel.findById(adminId);
        if (admin) {
            if (!admin.isBlocked) {
                const couponDetails = await couponModel.findOne({ code: newCouponDetails.code, _id: { $ne: couponId } });
                if (!couponDetails) {
                    const couponInfo = await couponModel.findOneAndUpdate({ _id: couponId }, newCouponDetails);
                    if (couponInfo) {
                        return {
                            msg: "Updating Coupon Details Process Has Been Successfully !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, This Coupon Is Not Exist !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This New Code Is Already Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Admin Has Been Blocked !!",
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteCoupon(adminId, couponId){
    try{
        const admin = await adminModel.findById(adminId);
        if (admin) {
            if (!admin.isBlocked) {
                const couponDetails = await couponModel.findOneAndDelete({ _id: couponId });
                if (couponDetails) {
                    return {
                        msg: "Delete Coupon Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Coupon Is Not Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Admin Has Been Blocked !!",
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    getAllCoupons,
    getCouponDetails,
    addNewCoupon,
    updateCouponInfo,
    deleteCoupon
}