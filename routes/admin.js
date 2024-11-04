var express = require('express');
var router = express.Router();
const { addStation, getAllStations, getAllTrains, addTrain } = require('../helpers/AdminHelper')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('Admin/adminsignin', { layout: false });
});

router.post('/submit', (req, res) => {
  const userdata = req.body


  if (userdata.email == 'admin@gmail.com', userdata.pw == 'admin') {
    res.render('Admin/adminhome')
  }

})

router.get('/addstation', (req, res) => {
  res.render('Admin/addstation')
})
router.post('/addstation', async (req, res) => {

  try {
    await addStation(req.body)
    res.redirect('/admin/addstation')
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).sendStatus('Internal Server Error')

  }

})
router.get('/addtrain', (req, res) => {
  res.render('Admin/addtrain')
})
router.post('/addtrain', async (req, res) => {
  try {
    const trainData = req.body; // Extract data from the request body

    console.log('Received train data:', trainData);

    // Add train data to the database
    await addTrain(trainData);

    // Send success response
    res.render('Admin/displayTrain')
  } catch (error) {
    console.error('Error adding train:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/alltrain', async (req, res) => {
  try {
    const trains = await getAllTrains(); // Fetch all trains from the database
    res.render('Admin/displayTrain', { trains }); // Pass trains data to the view
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/allstation', async (req, res) => {
  try {
    const stations = await getAllStations(); // Fetch station data
    res.render('Admin/displayStation', { stations }); // Pass stations to the view
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).send('Internal Server Error');
  }


})



module.exports = router;
