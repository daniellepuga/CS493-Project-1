const express = require('express');
const app = express();
const PORT = 3000;

// const bodyParser = require(bodyParser);
// const jsonParser = bodyParser.json();

// for project we can use an array and do post requests to 
// add info to it. we can pre-populate with data to
// test and error check.

// structure:
// app.METHOD(PATH, MIDDLEWARE);

// test array with all fields. blanks are optional
let businesses = [
    { businessName: "Test123",
      businessAddress: "123 Cherry Tree Lane",
      businessCity: "Bend",
      businessState: "Oregon",
      businessZip: "55555",
      businessPhone: "555-123-4567",
      businessCategory: "Restaurant",
      businessSubcategory: "Pizza",
      businessWebste: "",
      businessEmail: "",
    }
]
  
app.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.get('/business', (req, res) => {
    res.status(200);
    res.send(businesses);
});

// use Postman to test this
app.post('/business', (req, res) => {
    let data = req.body;
    res.send("Business information received: " + JSON.stringify(data));
});


// end catch all for paths we havent specified
app.use('*', function (req, res) {
    res.status(404).send({
        err: "The requested resource doesn't exist"
    });
});

app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);