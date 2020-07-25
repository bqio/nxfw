const axios = require("axios");
const express = require("express");
const app = express();
const reg = /"column-1">Firmware (\d+.\d+.\d+).*href="(https:\/\/mega.*?)">/gm;

app.use(express.static("public"));

app.get("/nxfw/latest", async function (_, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  const result = reg.exec(response.data);

  const json = {
    url: result[2],
    version: result[1],
  };

  res.json(json);
});

app.get("/nxfw/list", async function (_, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  const arr = [];
  let result;
  while ((result = reg.exec(response.data)) !== null) {
    arr.push({
      url: result[2],
      version: result[1],
    });
  }

  res.json(arr);
});

app.get("/nxfw/:ver", async function (req, res) {
  const response = await axios.get(
    "https://darthsternie.net/switch-firmwares/"
  );

  const vers = [];
  const urls = [];
  let result;
  while ((result = reg.exec(response.data)) !== null) {
    vers.push(result[1]);
    urls.push(result[2]);
  }

  const idx = vers.indexOf(req.params.ver);
  if (idx != -1) {
    res.json({ url: urls[idx] });
  } else {
    res.json({ error_code: 404 });
  }
});

app.listen(80, function () {
  console.log("App listening on port 80!");
});
