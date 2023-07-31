const Patient = require('../models/patient_model')
const Location = require('../models/location_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');

const id = uuidv4();
const lid = uuidv4();

const register = (req, res) => {
    var email = req.body.email
    var type = req.body.type
    var locationName = req.body.location
    var userId = id
    
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }
        let userModel = new Patient({
            userId: userId,
            name: req.body.name,
            email: req.body.email,   
            phone: req.body.phone,
            type: req.body.type,
            password: hashedPass,
            location: req.body.location
        })
        let locationModel = new Location({
            locationId : lid,
            location_name : req.body.location,   
        })
        Patient.findOne({email:email}).then(user => {
            if(user){
            res.status(404).json({
                status: false,
                message: 'user exists'
            })
        }else{
        userModel.save()
        .then(response => {
        res.json({
            status: true,
              message: 'User Added Successfully',
              data: response
        })
        Location.findOne({location_name: locationName}).then(location =>{
            if(location){
                if(type == 'doctor'){
                    Location.findOneAndUpdate({location_name: locationName}, 
                        {$push:{doctors: userModel}})
                    .then(response => {
                        console.log(response)
                    }).catch(error => {
                        console.log(error)
                    }) 
                   }else if(type == 'patient'){
                   Location.findOneAndUpdate({location_name: locationName}, 
                    {$push:{patients: userModel}})
                   .then(response => {
                     console.log(response)
                   }).catch(error => {
                     console.log(error)
                   }) 
                   }
            }else{
                locationModel.save().then(response => {
                console.log(response)
                if(type == 'doctor'){
                    Location.findOneAndUpdate({location_name: locationName}, 
                        {$push:{doctors: userModel}})
                    .then(response => {
                        console.log(response)
                    }).catch(error => {
                        console.log(error)
                    }) 
                   }else if(type == 'patient'){
                   Location.findOneAndUpdate({location_name: locationName}, 
                    {$push:{patients: userModel}})
                   .then(response => {
                     console.log(response)
                   }).catch(error => {
                     console.log(error)
                   }) 
                   }
                }).catch(error => {
                console.log(error)
                })
            }
        })
        
    }).catch(error => {
        res.status(500).json({
        message: 'An error occured: ' + error
                    })
                })
            }
        })
    }) 
}

const login = (req, res) => {
    var email = req.body.email
    var password = req.body.password
    Patient.findOne({$or: [{email:email}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                        res.status(404).json({
                            status: false,
                            error: err
                        })
                    }
                if(result){
                       res.status(200).json({
                        status: true,
                        message: 'Login Successful',
                        data: user
                       })
                    }else{
                        res.status(500).json({
                            status: false,
                            message: 'Invalid Password',
                            
                        })
                    }
                })
            }
        })
    }

module.exports = {
        register, login
     }