const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const apiKey = process.env.API_KEY;


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req,res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function (req,res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    
    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/b997b5a574"
    const options = {
        method: "POST",
        auth: String(apiKey)
    }

    const request = https.request(url, options, function(response) {
        
        console.log(options.auth);
        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
            console.log(apiKey);
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        
        response.on("data", function(data) {
            let parsedData = JSON.parse(data);
            console.log(parsedData);
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.listen(process.env.PORT || 3000);