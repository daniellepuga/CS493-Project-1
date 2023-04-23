const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// pretty print for JSON
app.set('json spaces', 4);


const jsonParser = bodyParser.json();

// for project we can use an array and do post requests to 
// add info to it. we can pre-populate with data to
// test and error check.

// structure:
// app.METHOD(PATH, MIDDLEWARE);

app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);

// test arrays with all fields.
let businesses = [
    { businessName: "Benderoni",
      businessAddress: "123 Cherry Tree Lane",
      businessCity: "Bend",
      businessState: "Oregon",
      businessZip: "55555",
      businessPhone: "555-123-4567",
      businessCategory: "Restaurant",
      businessSubcategory: "Pizza",
      businessWebsite: "",
      businessEmail: "",
    },

    { businessName: "Casa Bonita",
      businessAddress: "151 Yippee Ave",
      businessCity: "Denver",
      businessState: "CO",
      businessZip: "12345",
      businessPhone: "555-420-6969",
      businessCategory: "Restaurant",
      businessSubcategory: "Mexican",
      businessWebsite: "",
      businessEmail: "casa@bonita.com",
    },

    { businessName: "Chop Shop",
    businessAddress: "9541 Snack St",
    businessCity: "Cookington",
    businessState: "OR",
    businessZip: "13372",
    businessPhone: "555-1357-1111",
    businessCategory: "Shop",
    businessSubcategory: "Food Service",
    businessWebsite: "https://www.shoptillyouchop.com",
    businessEmail: "",
    },

    { businessName: "Los Pollos Hermanos",
    businessAddress: "308 Negra Arroyo Lane",
    businessCity: "Albequerque",
    businessState: "NM",
    businessZip: "87104",
    businessPhone: "555-111-2222",
    businessCategory: "Restaurant",
    businessSubcategory: "Fast Food",
    businessWebsite: "",
    businessEmail: "gustavo@fring.com",
    },
]

let reviews = [
    { starRating: 0,
      costRating: 1,
      reviewContent: "YIKES.",
    },

    { starRating: 3,
      costRating: 2,
      reviewContent: "Averagely average. Might return.",
    },

    { starRating: 5,
      costRating: 4,
      reviewContent: "Sacrificed my life savings to go here, but it was so worth it!",
    },
]

let photos = [
    {  imageSrc: "/test.jpg",
       imageCaption: "This is a test!",
    }
]

// Root of server
app.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of the Project 1 server");
});

// Businesses API endpoints & page logic
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
// Post a new business
app.post('/businesses', jsonParser, (req, res) => {
    if (req.body && req.body.businessName) {
        businesses.push(req.body);
        res.json({"status": "ok"});
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a businessName field"
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

// Get business by ID
app.get('/businesses/:businessID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        res.status(200).json(businesses[businessID]);
    } else {
        next();
    }
});

// Edit a business
app.put('/businesses/:businessID', (req, res) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        if (req.body && req.body.businessName) {
            businesses[businessID] = req.body;
            res.status(200).json({
                links: {
                    business: '/businesses/' + businessID
                }
        });
        } else {
            res.status(400).json({
                err: "Request needs a JSON body with a businessName field"
            });
        }
    } else {
        next();
    }
});

// Delete a business
app.delete('/businesses/:businessID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        businesses[businessID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

// Review API endpoints
// Get all reviews
app.get('/reviews', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(reviews.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageReviews = reviews.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/reviews?page=' + (page + 1);
        links.lastPage = '/reviews?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/reviews?page=' + (page - 1);
        links.firstPage = '/reviews?page=1';
    }  
    
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: reviews.length,
        reviews: pageReviews,
        links: links
    });
});

// Post a review
app.post('/reviews', jsonParser, (req, res) => {
    if (req.body && req.body.starRating && req.body.costRating) {
        if(req.body.starRating > -1 && req.body.starRating < 6){
            if(req.body.costRating > 0 && req.body.costRating <  5){
        reviews.push(req.body);
        res.json({"status": "200 OK"});}}
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a star rating field, and a dollar rating field"
        });
    }

    var id = reviews.length - 1;
    res.status(201).json({
        id: id,
        links: {
            review: '/reviews/' + id
        }
    });
});

// Edit a review
app.put('/reviews/:reviewID', (req, res, next) => {
    var reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
        if (req.body && req.body.starRating && req.body.costRating) {
            if(req.body.starRating > -1 && req.body.starRating < 6){
                if(req.body.costRating > 0 && req.body.costRating < 5){
                    reviews[reviewID] = req.body;
                    res.status(200).json({
                        links: {
                            review: '/reviews/' + reviewID
                        }
        });
        }}} else {
            res.status(400).json({
                err: "Request needs a JSON body with a star rating field with value between 0 and 5, and a cost rating field with value between 1 and 4."
            });
        }
    } else {
        next();
    }
});

// Delete a review
app.delete('/reviews/:reviewID', (req, res, next) => {
    var reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
        reviews[reviewID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

// Photo API endpoints
// Get all photos like previous endpoints
app.get('/photos', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(photos.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pagephotos = photos.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/photos?page=' + (page + 1);
        links.lastPage = '/photos?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos?page=' + (page - 1);
        links.firstPage = '/photos?page=1';
    }  
    
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: photos.length,
        photos: pagephotos,
        links: links
    });
});

// Add photo similar to previous post endpoints
app.post('/photos', jsonParser, (req, res) => {
    if (req.body && req.body.imageFile) {
        photos.push(req.body);
        res.json({"status": "ok"});
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with an Image"
        });
    }

    var id = photos.length - 1;
    res.status(201).json({
        id: id,
        links: {
            photos: '/photos/' + id
        }
    });
});

// Modify photo caption
app.put('/photos/:photoID', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
        if (req.body && req.body.imageFile) {
            photos[photoID] = req.body;
            res.status(200).json({
                links: {
                    photos: '/photos/' + photoID
                }
        });
        } else {
            res.status(400).json({
                err: "Request needs a JSON body with an image"
            });
        }
    } else {
        next();
    }
});

// Delete photo
app.delete('/photos/:photoID', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
        photos[photoID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

// Get photos for only specific business
app.get('/photos/:photoID/businesses', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
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
        links.nextPage = '/photos/:photoID/businesses?page=' + (page + 1);
        links.lastPage = '/photos/:photoID/businesses?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos/:photoID/businesses?page=' + (page - 1);
        links.firstPage = '/photos/:photoID/businesses?page=1';
    }  
    
    if (photos[photoID]) {
        res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses[photoID],
        links: links});
    } else {
        next();
    }
});

// Get photos for a certain review ID
app.get('/photos/:photoID/reviews', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(reviews.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pagereviews = reviews.slice(start, end);
    var links = {};

    if (page < lastPage) {
        links.nextPage = '/photos/:photoID/reviews?page=' + (page + 1);
        links.lastPage = '/photos/:photoID/reviews?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos/:photoID/reviews?page=' + (page - 1);
        links.firstPage = '/photos/:photoID/reviews?page=1';
    }  
    
    if (photos[photoID]) {
        res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: reviews.length,
        reviews: pagereviews[photoID],
        links: links});
    } else {
        next();
    }
});

// end catch all for paths we havent specified
app.use('*', function (req, res) {
    res.status(404).send({
        err: "The requested resource doesn't exist"
    });
});