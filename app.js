const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require(bodyParser);
const jsonParser = bodyParser.json();

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

let reviews = [
    { starredReview: 0,
      costReview: 0,
      reviewContent: "",
    }
]

app.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// businesses API endpoints & page logic
app.get('/businesses', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(businesses.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageBusinesses = businesses.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/businesses?page=' + (page + 1);
        links.lastPage = '/businesses?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/businesses?page=' + (page - 1);
        links.firstPage = '/businesses?page=1';
    }  
    
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses,
        links: links
    });
});

app.use(express.json());

// use Postman to test this
app.post('/businesses', jsonParser, (req, res) => {
    if (req.body && req.body.name) {
        businesses.push(req.body);
        res.json({"status": "ok"});
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a name field"
        });
    }

    var id = businesses.length - 1;
    res.status(201).json({
        id: id,
        links: {
            business: '/businesses/' + id
        }
    });
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