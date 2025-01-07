const Router=require('express')
const {  addBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/booking.controllers')
const router=Router()

router.post('/bookings',addBooking)
router.get('/bookings',getBookings)
router.put('/bookings/:id',updateBooking)
router.delete('/bookings/:id',deleteBooking)
module.exports=router