const express = require('express');
const app = express();
const PORT = 3000;

// const bodyParser = require(bodyParser);
// const jsonParser = bodyParser.json();

// for project we can use an array and do post requests to 
// add info to it. we can pre-populate with data to
// test and error check.
  
app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);