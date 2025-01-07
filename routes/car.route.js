const Router=require('express')
const { addNewCar, getCars, updateCar, deleteCar,  getCarsByMake, getCarsByModel, getCarsByYear, getCarsByPrice, getCarsWithSort } = require('../controllers/car.controllers')
const adminAccess = require('../middlewares/access')
const router=Router()

router.post('/cars',adminAccess,addNewCar)
router.get('/cars',getCars)
router.get('/cars/make',getCarsByMake)
router.get('/cars/model',getCarsByModel)
router.get('/cars/year',getCarsByYear)
router.get('/cars/price',getCarsByPrice)
router.get('/cars/sort',getCarsWithSort)
router.put('/cars/:id',adminAccess,updateCar)
router.delete('/cars/:id',adminAccess,deleteCar)

module.exports=router