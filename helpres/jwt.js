const expressJwt = require('express-jwt');

function authJwt() {
    try {
        const secret = process.env.SECRET;
        const API = process.env.API_URL
        return expressJwt({
            secret: secret,
            algorithms: ["HS256"],
            isRevoked: isRevoked,
        }).unless({
            path: [
                {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS']},
                {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS']},
                `${API}/users/login`,
                `${API}/users/register`
            ]
        });
        
    } catch (err) {
        // res.json(err.message);
        console.log(err.message)
    }
}

async function isRevoked(req , payload ,done) {
    if(!payload.isAdmain) {
        done(null , true);
    }

    done();
}

module.exports = authJwt;