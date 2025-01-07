const Router=require('express')
const { addNewUser, getUsers, updateUser, deleteUser } = require('../controllers/user.controllers')
const router=Router()

router.post('/users',addNewUser)
router.get('/users',getUsers)
router.put('/users/:id',updateUser)
router.delete('/users/:id',deleteUser)

module.exports=router