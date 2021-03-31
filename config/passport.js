const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/UserSchema');

module.exports = function (passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function (email, password, done) {

            User.findOne({
                email: email
            }).then(async(user)=> {
                console.log(user);
                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        console.log(password, "  = ", user.password);
                        return done(null, user);
                       
                    } else {
                        return done(null, false, {
                            message: "Password Anda Salah"
                        });
                    }
                } else {
                    return done(null, false, {
                        message: "Email Anda Tidak Terdaftar"
                    });
                }
            }).catch(e => {
                console.log('There has been a problem with your fetch operation: ' + e.message);
              });

        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}