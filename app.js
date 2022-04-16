const express = require("express"); //express is an npm package we are using to manage our requests
const bodyParser = require("body-parser"); //npm package to parse website body data on res and req
const request = require("request"); //npm request package for HTTP
const https = require("https"); //https package for https requests, mainly for API use. Axios would also work here
const apiKey = process.env.API_KEY; //global variable to store heroku environment variable. To set use heroku CLI and do 'heroku config:set API_KEY=<apikey>'


const app = express(); //set our app to use express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //this is so that we can pass static files on our responses such as styles.css and images

app.get("/", function (req,res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function (req,res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    
    //the data object is what we are passing to the mailchimp API call to create a new member
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

    //stringify our data object
    let jsonData = JSON.stringify(data);

    //create API url and parameters
    const url = "https://us14.api.mailchimp.com/3.0/lists/b997b5a574"
    const options = {
        method: "POST",
        auth: `uname:${String(apiKey)}`
    }

    //build our API call
    const request = https.request(url, options, function(response) {
        
        console.log(options.auth);
        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        
        // response.on("data", function(data) {
        //     let parsedData = JSON.parse(data);
        //     console.log(parsedData);
        // })
    })

    //write and request our data
    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.listen(process.env.PORT || 3000);