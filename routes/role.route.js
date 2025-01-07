const Router=require('express')
const { addNewRole, getRoles, updateRole, deleteRole } = require('../controllers/role.controllers')
const router=Router()

router.post('/roles',addNewRole)
router.get('/roles',getRoles)
router.put('/roles/:id',updateRole)
router.delete('/roles/:id',deleteRole)
module.exports=router