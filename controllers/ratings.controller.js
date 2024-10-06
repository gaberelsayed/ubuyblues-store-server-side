const { getResponseObject } = require("../global/functions");

const ratingOPerationsManagmentFunctions = require("../models/ratings.model");

async function postSelectProductRating(req, res){
    try{
        res.json(await ratingOPerationsManagmentFunctions.selectProductRating(req.data._id, req.body, req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getProductRatingByUserId(req, res) {
    try{
        res.json(await ratingOPerationsManagmentFunctions.getProductRatingByUserId(req.data._id, req.params.productId, req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postSelectProductRating,
    getProductRatingByUserId
}