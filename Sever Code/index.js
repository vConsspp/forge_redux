var express = require('express')
var app = express();
var config = require('./config')
var request = require('request')

app.listen(8081, () => {
    console.log("your app is runninng @ 8081")
});

app.get('/oauth/callback/', function(req, res) {
    var code = req.query.code;
    var definedBody = "client_id=" + config.clientId + "&client_secret=" + config.clientSecret +
        "&grant_type=authorization_code" + "&code=" + code + "&redirect_uri=" + config.redirect_uri
    console.log(code);
    request({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/gettoken',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: definedBody
    }, function(err, result, body) {
        var parsedOutput = JSON.parse(body);
        console.log("accesstoken", parsedOutput)
        res.redirect(`${config.clientLink}?accessToken=${parsedOutput["access_token"]}`);
    });
})