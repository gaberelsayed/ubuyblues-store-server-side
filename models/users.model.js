// Import User, Account Verification Codes And Product Model Object

const { userModel, accountVerificationCodesModel, adminModel, productsWalletModel, favoriteProductModel } = require("../models/all.models");

// require bcryptjs module for password encrypting

const { hash, compare } = require("bcryptjs");

// Define Create New User Function

async function createNewUser(email, password, language) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            return {
                msg: "Sorry, Can't Create New User Because It Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        await (new userModel({
            email,
            password: await hash(password, 10),
            language
        })).save();
        return {
            msg: "Creating New User Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function login(email, password) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            // Check From Password
            if (await compare(password, user.password)) {
                return {
                    msg: "Logining Process Has Been Successfully !!",
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                    },
                };
            }
            return {
                msg: "Sorry, Email Or Password Incorrect !!",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, Email Or Password Incorrect !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function loginByGoogle(userInfo) {
    try{
        const user = await userModel.findOne({ email: userInfo.email });
        if (user) {
            return {
                msg: "Logining Process By Google Has Been Successfully !!",
                error: false,
                data: {
                    _id: user._id,
                    isVerified: user.isVerified,
                },
            };
        }
        const { _id, isVerified } = (new userModel({
            email: userInfo.email,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            previewName: userInfo.preview_name,
            password: await hash(process.env.secretKey, 10),
            isVerified: true,
            provider: "google",
        })).save();
        return {
            msg: "Logining Process By Google Has Been Successfully !!",
            error: false,
            data: {
                _id,
                isVerified,
            },
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function getUserInfo(userId) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            return {
                msg: "Get User Info Process Has Been Successfully !!",
                error: false,
                data: user,
            }
        }
        return {
            msg: "Sorry, This User Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function isExistUserAndVerificationEmail(email) {
    try {
        // Check If User Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                return {
                    msg: "This User Is Exist !!",
                    error: false,
                    data: user,
                };
            }
            return {
                msg: "Sorry, This Email Has Been Verified !!",
                error: true,
                data: {},
            };
        };
        return {
            msg: "Sorry, This User Is Not Exist !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function getUsersCount(authorizationId, filters) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: "Get Users Count Process Has Been Successfully !!",
                    error: false,
                    data: await userModel.countDocuments(filters),
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
    } catch (err) {
        throw Error(err);
    }
}

async function getAllUsersInsideThePage(authorizationId, pageNumber, pageSize, filters) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: `Get All Users Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
                    error: false,
                    data: await userModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ dateOfCreation: -1 }),
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
    } catch (err) {
        throw Error(err);
    }
}

async function isExistUserAccount(email, userType) {
    try {
        if (userType === "user") {
            const user = await userModel.findOne({ email });
            if (user) {
                return {
                    msg: "User Is Exist !!",
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                    },
                }
            }
            return {
                msg: "Sorry, This Admin Is Not Exist !!",
                error: true,
                data: {},
            }
        }
        const admin = await adminModel.findOne({ email });
        if (admin) {
            return {
                msg: "Admin Is Exist !!",
                error: false,
                data: {
                    _id: admin._id,
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

async function updateUserInfo(userId, newUserData) {
    try {
        const userInfo = await userModel.findById(userId);
        if (userInfo) {
            let newUserInfo = newUserData;
            if (newUserData.password && newUserData.newPassword) {
                if (!(await compare(newUserData.password, userInfo.password))) {
                    return {
                        msg: "Sorry, This Password Is Uncorrect !!",
                        error: true,
                        data: {},
                    }
                }
                newUserInfo = {
                    ...newUserData,
                    password: await hash(newUserData.newPassword, 10),
                }
            }
            if (newUserData.email && newUserData.email !== userInfo.email) {
                const user = await userModel.findOne({ email: newUserData.email });
                if (user) {
                    return {
                        msg: "Sorry, This Email Is Already Exist !!",
                        error: true,
                        data: {},
                    }
                }
            }
            await userModel.updateOne({ _id: userId }, newUserInfo);
            return {
                msg: "Updating User Info Process Has Been Successfuly !!",
                error: false,
                data: {},
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

async function updateVerificationStatus(email) {
    try{
        const userInfo = await userModel.findOneAndUpdate({ email }, { isVerified: true });
        if(userInfo) {
            await accountVerificationCodesModel.deleteOne({ email, typeOfUse: "to activate account" });
            return {
                msg: "Updating Verification Status Process Has Been Successfully !!",
                error: false ,
                data: {
                    _id: userInfo._id,
                    isVerified: userInfo.isVerified,
                },
            };
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        };
    }
    catch(err) {
        throw Error(err);
    }
}

async function resetUserPassword(email, userType, newPassword) {
    try {
        if (userType === "user") {
            const user = await userModel.findOneAndUpdate({ email }, { password: await hash(newPassword, 10) });
            if (user) {
                return {
                    msg: "Reseting Password Process Has Been Successfully !!",
                    error: false,
                    data: {
                        language: user.language,
                    },
                };
            }
            return {
                msg: "Sorry, This Admin Is Not Exist !!",
                error: true,
                data: {},
            }
        }
        const admin = await adminModel.findOneAndUpdate({ email }, { password: await hash(newPassword, 10) });
        if (admin) {
            return {
                msg: "Reseting Password Process Has Been Successfully !!",
                error: false,
                data: {
                    language: admin.language,
                },
            };
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

async function deleteUser(authorizationId, userId){
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const user = await userModel.findOneAndDelete({ _id: userId });
                if (user) {
                    await productsWalletModel.deleteMany({ userId });
                    await favoriteProductModel.deleteMany({ userId });
                    return {
                        msg: "Deleting User Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Admin Is Not Exist !!",
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
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    createNewUser,
    login,
    loginByGoogle,
    getUserInfo,
    isExistUserAccount,
    isExistUserAndVerificationEmail,
    getUsersCount,
    getAllUsersInsideThePage,
    updateUserInfo,
    updateVerificationStatus,
    resetUserPassword,
    deleteUser
}