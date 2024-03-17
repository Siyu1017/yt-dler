const express = require("express");
const app = express();
const cors = require('cors');
const ytdl = require("ytdl-core");
const youtubeUrl = require('youtube-url');
const decode = require('urldecode');
const fs = require('fs');
const join = require('path').join;

app.use(cors({
    origin: '*'
}))

app.get("/ip", async (req, res) => {
    res.setHeader('content-type', 'text/json');
    var ip = (req.headers["x-forwarded-for"] || "").split(",").pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    res.json({ 
        ip: ip 
    });
    return;
})

app.get("/api", async (req, res) => {
    if (youtubeUrl.valid(req.query.url) != true) {
        return res.json({
            status: "error",
            message: "Invalid Youtube URL.",
            url: "",
            info: ""
        });
    }
    const v_id = req.query.url.split('v=')[1];
    const info = await ytdl.getInfo(req.query.url);

    return res.json({
        status: "ok",
        message: "",
        url: "https://www.youtube.com/embed/" + v_id,
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        })
    })
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`);
});

app.get("/videos", (req, res) => {
    let jsonPath = "videos";
    let jsonFiles = [];
    function findJsonFile(path) {
        let files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            let fPath = join(path, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                findJsonFile(fPath);
            }
            if (stat.isFile() === true) {
                jsonFiles.push(fPath.split('videos/')[1].split('.mp4')[0]);
            }
        });
    }
    findJsonFile(jsonPath);
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write(`var vida = ${JSON.stringify(jsonFiles)}`);
    res.end();
})

app.get('/watch', (req, res) => {
    res.sendFile(`${__dirname}/ytp.html`);
})

app.get('/player', (req, res) => {
    try {
        if (fs.existsSync(`${__dirname}/videos/${req.query.v}.mp4`)) {
            res.sendFile(`${__dirname}/videos/${req.query.v}.mp4`);
        } else {
            res.setHeader('content-type', 'text/plain');
            res.send(`Invalid Video ID`);
        }
    } catch (err) {
        res.setHeader('content-type', 'text/plain');
        res.send(`Error : ${err}`);
    }
})

app.get('/isvalid', (req, res) => {
    if (!req.query.url) {
        return res.json({
            status: "error",
            message: "Query String Parameter <url> is required.",
            isvalid: false
        })
    }
    res.json({
        status: "ok",
        message: "",
        isvalid: youtubeUrl.valid(req.query.url)
    })
    return;
})

app.use(express.static(`${__dirname}/ytp.js`), (req, res, next) => {
    res.status(404).redirect("/")
})

app.listen(3000, () => {
    console.log("Server is running");
});