const {Sequelize,DataTypes}=require('sequelize')
const { user } = require('../models/user.model')
const { role } = require('../models/role.model')
const { booking } = require('../models/booking.model')
const { car } = require('../models/car.model')
const {transaction}=require('../models/transaction.model')

const sequelize=new Sequelize('Car','postgres', 'admin',{
    host:'localhost',
    dialect:'postgres'
})

const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize

db.user=user(sequelize,Sequelize)
db.role=role(sequelize,Sequelize)
db.booking=booking(sequelize,Sequelize)
db.car=car(sequelize,Sequelize)
db.transaction=transaction(sequelize,Sequelize)

db.transaction.belongsTo(db.booking, {foreignKey:'bookingId'})
db.booking.hasMany(db.transaction, {foreignKey:'bookingId'})

module.exports=db