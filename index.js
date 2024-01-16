const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const youtubeUrl = require('youtube-url');
const decode = require('urldecode');
const fs = require('fs');
const join = require('path').join;

app.set("view engine", "ejs");

app.get("/lh", (req, res) => {
    return res.send('<script>location.href="https://www.tw-goldenwinner-57.com/";</script>');
})

app.get("/ip", async (req, res) => {
    res.setHeader('content-type', 'text/json');
    var ip = (req.headers["x-forwarded-for"] || "").split(",").pop() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    res.send("var ip = '" + ip + "';");
    return
})

app.get("/api", async (req, res) => {
    res.setHeader('content-type', 'text/json');
    if (!req.query.ip) {
        res.send('Invalid IP Address');
        return;
    }
    if (youtubeUrl.valid(decode(req.url.split('/api?url=')[1])) != true) {
        res.send('Invalid URL');
        return;
    }
    const info = await ytdl.getInfo(req.query.url);
    var list = [];
    return res.render("api", {
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        }),
    });
});

app.get("/download", async (req, res) => {
    if (youtubeUrl.valid(decode(req.url.split('/download?url=')[1])) != true) {
        res.send('Invalid URL');
        return;
    }
    const v_id = req.query.url.split('v=')[1];
    const info = await ytdl.getInfo(req.query.url);
    console.log(info.formats[4]);
    console.log(info.formats[1]);

    return res.json({
        url: "https://www.youtube.com/embed/" + v_id,
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        }),
    })

    /*
    return res.render("download", {
        url: "https://www.youtube.com/embed/" + v_id,
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        }),
    });
    */
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`);
});

app.get("/videos", (req, res) => {
    let jsonPath = "videos";
    let jsonFiles = [];
    function findJsonFile(path) {
        let files = fs.readdirSync(path);
        files.forEach(function(item, index) {
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
    if (youtubeUrl.valid(req.url.split('/isvalid?ytu=')[1]) != true) {
        res.send('false');
        return;
    } else {
        res.send('true');
        return;
    }
})

app.use(express.static(`${__dirname}/ytp.js`), (req, res, next) => {
    res.status(404)
    res.sendFile(`${__dirname}/404.html`);
    res.end();
})

app.listen(3000, () => {
    console.log("Server is running");
});