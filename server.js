var http = require("http");
var fs = require("fs");
var przychodzacyDiv = []
var czlonek = []

var server = http.createServer(function (req, res) {

  switch (req.method) {
    case "GET":
      if (req.url === "/") {
        fs.readFile("index.html", function (error, data) {
          res.writeHead(200, {
            "Content-Type": "text/html"
          });
          res.write(data);
          res.end();
        });
      }
      else if (req.url === "/jquery.cssemoticons.js") {
        fs.readFile("jquery.cssemoticons.js", function (error, data) {
          res.writeHead(200, {
            "Content-Type": "application/javascript"
          });
          res.write(data);
          res.end();
        });
      }
      else if (req.url === "/jquery.cssemoticons.css") {
        fs.readFile("jquery.cssemoticons.css", function (error, data) {
          res.writeHead(200, {
            "Content-Type": "text/css"
          });
          res.write(data);
          res.end();
        });
      } 
      else {
        res.writeHead(404, {
          "Content-Type": "text/html"
        });
        res.write("<h1>Popsute</h1>");
        res.end();
      }
      break;
    case "POST":
      if (req.url == "/dzialaj") {
        sluchaPool(req, res);
      }
      else if (req.url == "/wysylaj") {
        odbieranie(req, res)        
      }
      break;
  }
});
setInterval(sprawdzPool, 20100)

function sluchaPool(req, res) {
  var allData = "";

  req.on("data", function (data) {
    allData += data;
  });

  req.on("end", function (data) {
    czlonek.push(res)
    var finish = allData;    
  });
}
function sprawdzPool() {
  for (var i = 0; i < czlonek.length; i++) {
    czlonek[i].end()
  }
  czlonek = []
}

function odbieranie(req, res) {
  var allData = "";

  req.on("data", function (data) {
    allData += data;
  })

  req.on("end", function (data) {
    var finish = allData;
    przychodzacyDiv.push(finish)
    if (przychodzacyDiv.length > 10) {
      przychodzacyDiv.shift()
    }
    for (i = 0; i < czlonek.length; i++) {
      let wiad = przychodzacyDiv[przychodzacyDiv.length - 1];      
      czlonek[i].end(wiad);
    }
    res.end()
  })
}

server.listen(3000, function () {
  console.log("Super serwerek komunikatorerk w koncu działa");
});