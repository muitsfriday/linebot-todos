"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.load();

var app = (0, _express.default)();
var port = process.env.PORT;
app.get('/', function (req, res) {
  res.send('Hello World');
});
app.listen(port, function () {
  console.log("Listening ".concat(port));
});