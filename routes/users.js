var express = require('express');
var router = express.Router();
const mysql=require('mysql2')
const dotenv =require ('dotenv')
const{createUser,loginUser}=require('../database')
const{getAllTrains,getAllStations}=require('../helpers/AdminHelper')
dotenv.config()
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('User/usersignin',{layout:false})
});

router.post('/submit',async(req,res)=>{

  console.log(req.body);
  try {
    await createUser(req.body); // Await the createUser promise
    res.render('User/ticket')
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error'); // Send error response
}

})

// router.get('/signin',(req,res)=>{
//   res.render('/signin',{title:"express"})

// })
router.get('/login',(req,res)=>{
  res.render('User/userlogin',{layout:false})
})
router.get('/all', async (req, res) => {
  try {
      const users = await getUsers();
      console.log(users);
       // Fetch all users from the database
      res.render('userlist', { users }); // Render a view to display the users
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error'); // Send error response
  }
});
router.post('/login',async(req,res)=>{
  console.log(req.body);
  try {
    await loginUser(req.body); // Await the createUser promise
    res.render('User/ticket')
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error'); // Send error response
}
  

})
router.get('/searchtrain',async(req,res)=>{
  try {
    const trains = await getAllTrains(); // Fetch all trains from the database
    res.render('User/search', { trains }); // Pass trains data to the view
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).send('Internal Server Error');
  }
})
// router.get('/api/searchtrain', async (req, res) => {
  
//   const { train_Name } = req.query; // Get train name from query parameters

  
//   try {
//       const allTrains = await getAllTrains();
      
//       // Filter trains based on train name (case insensitive)
//       const filteredTrains = allTrains.filter(train => 
//           train.train_name.toLowerCase().includes(train_Name.toLowerCase())
//       );
//       console.log(filteredTrains);
      
//       if (filteredTrains.length > 0) {
//           res.json(filteredTrains[0]); // Send back filtered trains
//       } else {
//           res.status(404).send('No trains found with that name.');
//       }
//   } catch (error) {
//       res.status(500).send('Internal Server Error');
//   }
// });
router.get('/searchstation',async(req,res)=>{
  try {
    const stations = await getAllStations(); // Fetch all trains from the database
    res.render('User/display', { stations }); // Pass trains data to the view
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).send('Internal Server Error');
  }
})
router.get('/bookticket',async(req,res)=>{
  res.render('User/ticket')
  
})
router.get('/ticketprice',async(req,res)=>{
  res.render("User/priceTicket")
})
router.post('/ticketprice',async(req,res)=>{
  try {
  const{destkm, ticketClass, ticno}=req.body
  const TicPrice=calculateTicketPrice(destkm, ticketClass, ticno)
  console.log(TicPrice);
  
  return res.status(200).json({price:TicPrice})
  } catch (error) {
    console.error('Error booking ticket:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
}
})


router.post('/bookticket', async (req, res) => {
    try {
        // Log the incoming request data
        console.log(req.body);

        // Extract booking information from the request body
        const {
            selectedStation,
            destination,
            destkm,
            passengerName,
            time,
            date,
            class: ticketClass,
            train,
            trainno,
            ticno
        } = req.body;

        // Here, you would implement your ticket booking logic.
        // This could involve checking seat availability, calculating prices, etc.
        // For this example, we're just mocking a successful booking response.

        const ticketPrice = calculateTicketPrice(destkm, ticketClass, ticno); // Replace with your pricing logic

        // Create a mock booking confirmation
        const bookingConfirmation = {
            passengerName,
            selectedStation,
            destination,
            time,
            date,
            train,
            trainno,
            ticketClass,
            ticno,
            ticketPrice: ticketPrice,
            message: "Ticket booked successfully!"
        };

        // Respond with the booking confirmation
        return res.status(200).json(bookingConfirmation);

    } catch (error) {
        console.error('Error booking ticket:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Example function to calculate ticket price based on distance and class
function calculateTicketPrice(destkm, ticketClass, ticno) {
    const baseFare = 100; // Base fare per km
    let additionalCharge = 0;

    switch (ticketClass) {
        case "1A":
            additionalCharge = 200; // Additional for First AC
            break;
        case "EA":
            additionalCharge = 150; // Additional for Second AC
            break;
        case "3E":
            additionalCharge = 0; // No additional for Sleeper
            break;
        case "2A":
            additionalCharge = 100; // Additional for Third AC
            break;
        default:
            additionalCharge = 0;
    }

    // Calculate total fare
    return (baseFare * destkm + additionalCharge) * ticno;
}





module.exports = router;
