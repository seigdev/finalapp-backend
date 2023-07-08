const Location = require('../models/location_model')

// show all locations
const all = (req, res) => {
    Location.find()
    .then(response => {
        res.status(200).json({
            data: response
        })
    }).catch(error => {
        res.status(!200).json({
            message: 'An error occured'
        })
    })
}

// get cafetaria by ID
const one = (req, res) => {
    const locationName = req.params.locationName
    Location.findOne({location_name: locationName}).then(document => {
        if (!document) {
            res.status(404).json({
            message: 'Location not found.'
            })
          console.log('Document not found.');
          return;
        }
        res.status(200).json({
            data: document
        })
        console.log('Document:', document);
      })
      .catch(error => {
        res.status(500).json({
            message: 'Error finding Location'
        })
        console.error('Error finding document:', error);
      })
}

module.exports = {
    all, one 
}