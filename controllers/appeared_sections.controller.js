const { getResponseObject } = require("../global/functions");

const appearedSectionsOPerationsManagmentFunctions = require("../models/appeared_sections.model");

async function getAllSections(req, res) {
    try{
        res.json(await appearedSectionsOPerationsManagmentFunctions.getAllSections());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putSectionsStatus(req, res) {
    try{
        const result = await appearedSectionsOPerationsManagmentFunctions.updateSectionsStatus(req.data._id, req.body.sectionsStatus);
        if (result.error) {
            return res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}