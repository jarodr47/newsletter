const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


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
        auth: "anyuser13:80c7ab85e65e614edda3d58adbc8a842-us14"
    }

    const request = https.request(url, options, function(response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        
        response.on("data", function(data) {
            let parsedData = JSON.parse(data);
            console.log(parsedData.total_created);
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.listen(3000, function () {
    console.log("starting server on port 3000");
})