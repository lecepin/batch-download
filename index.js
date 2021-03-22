(function () {
  "use strict";
  const http = require("http");
  const https = require("https");
  const fs = require("fs");
  const path = require("path");
  const chalk = require("chalk");

  const urlList = require("./list.json");

  function mkdirs(dirpath) {
    if (!fs.existsSync(path.dirname(dirpath))) {
      mkdirs(path.dirname(dirpath));
    }
    try {
      fs.mkdirSync(dirpath);
    } catch (e) {}
  }

  function getHttpReqCallback(url, dirName, index) {
    var fileName = path.basename(url);
    var callback = function (res) {
      console.log(
        chalk.blueBright("---> 请求: ") +
          url +
          chalk.blueBright(" 反回状态: ") +
          chalk.yellow(res.statusCode)
      );
      var contentLength = parseInt(res.headers["content-length"]);
      var fileBuff = [];
      res.on("data", function (chunk) {
        var buffer = new Buffer(chunk);
        fileBuff.push(buffer);
      });
      res.on("end", function () {
        if (isNaN(contentLength)) {
          console.log(chalk.redBright(url) + " 内容错误");
          return;
        }
        var totalBuff = Buffer.concat(fileBuff);

        if (
          totalBuff.length < contentLength ||
          !Number(totalBuff.length) ||
          (res.statusCode + "")[0] != "2"
        ) {
          console.log(chalk.bgRed("错误: " + url));
          return;
        }
        console.log(
          chalk.bold(
            chalk.greenBright("===> 下载完成") +
              url +
              chalk.greenBright(
                "  ===> 总大小: " +
                  (totalBuff.length / 1024 / 1024).toFixed(2) +
                  "MB "
              )
          )
        );

        mkdirs(dirName);
        fs.appendFile(dirName + "/" + fileName, totalBuff, function (err) {});
      });
    };

    return callback;
  }

  var startDownloadTask = function (url, dirName, index) {
    console.log(chalk.bgBlue("开始下载") + url);
    var req = (url.indexOf("https://") == 0 ? https : http).request(
      url,
      getHttpReqCallback(url, dirName, index)
    );
    req.on("error", function (e) {
      console.log(chalk.redBright("地址： " + url + " 错误"));
    });
    req.end();
  };

  urlList.forEach(function (item, index, array) {
    startDownloadTask(item, "./downloads", index);
  });
})();
