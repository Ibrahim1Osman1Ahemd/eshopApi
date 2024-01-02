const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const bycrpt = require('bcrypt');



async function httpGetUsers (req,res)  {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        return res.status(500).json({
            success: false,
        })
    }
    return res.json(userList)
}

async function httpGetUser (req,res)  {
    try{
        const user = await User.findById(req.params.id).select('-passwordHash');
        if(!user) return res.status(404).json({
            message: 'The user with the given id is not found',
            success: false,
        })
        return res.status(200).json(user);

    }catch(err){
        console.log(err.message)
        res.end(err.message)
    }
}

async function httpGetUsersCount (req,res)  {
    const userCount = await User.countDocuments();
    if(!userCount) {
        res.status(500).json({success: false})
    }
    res.json({
        userCount : userCount,
    });
}

async function httpNewUser (req,res)  {
    try{
        let user = new User({
            name : req.body.name,
            email: req.body.email,
            passwordHash: bycrpt.hashSync(req.body.password , 11),
            phone: req.body.phone,
            isAdmain : req.body.isAdmain,
            street: req.body.street,
            appartment: req.body.appartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });
        user = await user.save();

        if(!user) return res.status(500).json({
            success: false,
            message: 'Cann\'t register the user now try again letter!',
        });

        return res.status(201).json(user);

    }catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: 'There some error pleace try again letter',
        })
    }
}

async function httpLogin (req,res)  {
    try{
       const {email , password} = req.body
       const user = await User.findOne({email : email});
       console.log(user)

       if(!user) return res.status(404).json({
            message: 'Invalid user',
            success: false,
       });
       const passwordHash = await bycrpt.compare(password , user.passwordHash);


       if(passwordHash) {
            const secret = process.env.SECRET;
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmain: user.isAdmain,
                },
                secret,
                {
                    expiresIn: '1d'
                }
            );
            console.log(token)
        return res.status(200).json({
            userEmail: user.email,
            token,
            success: true,
       });
       }
       return res.status(400).json({
            success: false,
            message: 'Worng email or password'
       })

    }catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: 'There some error pleace try again letter',
        })
    }
}

async function httpDeleteUser (req,res)  {
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id);
        if (!user) return res.status(404).json({success: false , message: 'User not found'});
        return res.status(200).json(({
            success: true,
            message: 'The user is deleted',
        }));
    } catch (err) {
    return res.status(400).json({
        success: false, 
        err: err.message
    });
    }
}

module.exports = {
    httpGetUsers,
    httpGetUser,
    httpGetUsersCount,
    httpNewUser,
    httpLogin,
    httpDeleteUser,
}