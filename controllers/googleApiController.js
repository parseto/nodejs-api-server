const express = require("express");
const router = express.Router();

const { log } = console

const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
// const { client_email, private_key } = require("../public/resources/.key.json");

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
    // email: client_email,
    email: process.env.S1,
    // key: private_key,
    key: process.env.S2.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});


const rowSample = [
    {
        name: "sample",
        page: "10000",
        isClick: "FALSE",
        url: "https://www.inflearn.com/",
        category: "no-data",
    },
]

const functions = {
    updateTitle: async (doc) =>
        await doc.updateProperties({ title: "renamed doc" }),
    addSheet: async (doc) =>
        await doc.addSheet({ headerValues: ["name", "email"] }),
    getTitle: async (doc) => doc.title,
    getRow: async (sheet) => await sheet.getRows(),
    loadInfo: async (doc) => await doc.loadInfo(),
    addRow: async (sheet, data) => await sheet.addRows(data),
};

async function postDataMain(row) {
    const doc = new GoogleSpreadsheet(
        "1Qijz4n5LbuSoMQFBSChYE35qgGID2p1b4qoGRU5NTfU",
        serviceAccountAuth
    );

    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsByIndex[0];


    const makeRow = (row) => ({ name: row[0], page: row[1], isClick: row[2], url: row[3], category: row[4] })

    const writeRow = await functions.addRow(sheet, row.map(makeRow) || rowSample);

    return writeRow.map((d) => d._rawData);
}

async function getDataMain() {
    const doc = new GoogleSpreadsheet(
        "1Qijz4n5LbuSoMQFBSChYE35qgGID2p1b4qoGRU5NTfU",
        serviceAccountAuth
    );

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await functions.getRow(sheet);
    return rows.map((d) => d._rawData);
}

const postData = async (req, res) => {
    const row = req.body
    log(row)
    // const appResult = { "a": 1 };
    const appResult = postDataMain(row);
    res.json(appResult);
}

const getData = async (req, res) => {
    const appResult = await getDataMain();
    res.json(appResult);
}

module.exports = { getData, postData };
