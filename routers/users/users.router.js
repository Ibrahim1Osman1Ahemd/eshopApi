const bycrpt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const { 
    httpGetUsers,
    httpGetUser,
    httpGetUsersCount,
    httpNewUser,
    httpLogin,
    httpDeleteUser,
} = require('./users.controllers');

const router = express.Router();

router.get('/' , httpGetUsers);

router.get('/:id' , httpGetUser);

router.get('/get/count' , httpGetUsersCount);

router.post(`/register` , httpNewUser);

router.post(`/login` , httpLogin);



router.delete('/:id' , httpDeleteUser);

module.exports = router;