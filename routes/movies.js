const express = require('express');
const router = express.Router();
const moment = require('moment');
const Movie = require("../models/MovieSchema")

const { CekAuth } = require('../config/auth');

// Get All Movies
router.get('/', CekAuth, (req,res,next) => {
    let ListMovies = [];
    Movie.find((err, movies) => {
        if (movies) {
            for(let data of movies){
                ListMovies.push({
                    id:data._id,
                    name:data.name,
                    released_on:data.released_on
                });
            }
            res.render("movie/allMovies",{ListMovies});
        } else {
            ListMovies.push({
                id:"",
                name:"",
                released_on:""
            });
            res.render("movie/allMovies",{ListMovies});
        }
    });
});

// Create Movies
router.get('/create', CekAuth, (req,res,next) => {
    res.render("movie/createMovie",{ title: "Halaman Create Movie" })
});

// Update Movies
router.get('/update/:movieId', CekAuth, (req,res,next) => {
    Movie.findById(req.params.movieId, (err, movieInfo) => {
        let newDate = moment(movieInfo.released_on).format("YYYY-MM-DD");
        
        if (movieInfo) {
            console.log(movieInfo);
            res.render("movie/updateMovie", {
                movies:movieInfo,
                newDate
            });
        }
    });
});

// Action create
router.post("/create", CekAuth, function(req,res){
    // console.log(req.body);
    const { name, date } = req.body;

    let errors = [];

    if (!name || !date) {
        errors.push({msg:"Silahkan data yang dibutuhkan!!!"});
        console.log("Silahkan data yang dibutuhkan!!!");
    }

    if (errors.length > 0) {
        res.render("movie/createMovie",{errors});
    } else {
        const newMovie = Movie({
            name,
            released_on: date
        });
        newMovie.save().then(
            movie =>{
                errors.push({msg:"Data Movie berhasil ditambahkan"});
                res.render('movie/createMovie',{errors})
            }
        ).catch(err => console.log(err));
    }
});

// Action update
router.post("/update", CekAuth, (req,res) => {
    console.log(req.body);

    let errors = [];

    Movie.findByIdAndUpdate(req.body.id,{name:req.body.name, released_on:req.body.date},
        function(err){
            if (err) {
                console.log(err);
            } else {
                errors.push({msg:"Data Berhasil Terupdate"});
                var newMovies ={ _id:req.body.id, name:req.body.name };
                var newDate = moment(req.body.date).format("YYYY-MM-DD");
                res.render("movie/updateMovie",{
                    movies: newMovies,
                    newDate,
                    errors
                });
            }
        });
});

router.get("/delete/:movieId", CekAuth, (req,res) => {
    // console.log(req.params.movieId);
    Movie.findByIdAndDelete(req.params.movieId, function() {
        res.redirect("/movies");
    });
});

module.exports = router;