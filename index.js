const http = require("http");
const fs = require("fs");
var requests = require('requests');
const { url } = require("inspector");

const homeFile = fs.readFileSync("home.html", "utf8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%temp%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%statusicon%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&units=metric&appid=828ed5756417ef0e2dbe62f2fed38b7d")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arraydata = [objdata];
                // console.log(arraydata[0].main.temp);
                const realTimeData = arraydata
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000, "127.0.0.1");