const axios = require("axios");
const express = require("express");
const app = express();
const reg = /"column-1">Firmware (\d+.\d+.\d+).*href="(https:\/\/mega.*?)">/gm;

app.use(express.static("public"));

app.get("/nxfw/latest", async function (_, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  res.json(getJson(response.data)[0]);
});

app.get("/nxfw/list", async function (_, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  res.json(getJson(response.data));
});

app.get("/nxfw/:ver", async function (req, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  let json = getJson(response.data).filter(
    (obj) => obj.version == req.params.ver
  );
  res.json(json.length ? json : { error_code: 404 });
});

app.listen(80, function () {
  console.log("App listening on port 80!");
});

function getJson(data) {
  const arr = [];
  let result;
  while ((result = reg.exec(data)) !== null) {
    arr.push({
      url: result[2],
      version: result[1],
    });
  }
  return arr;
}
