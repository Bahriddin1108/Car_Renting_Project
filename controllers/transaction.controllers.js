
const Sequelize=require('sequelize')
const db = require("../config/db");
const Transaction= db.transaction;
const Booking=db.booking
const Car=db.car

const addTransaction = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid"); // Dinamik import va destructuring
    const nanoid = customAlphabet("1234567890", 8);
    const id = nanoid();
    const { bookingId, amountPaid, paymentDate  } = req.body;
    const checker=await Booking.findByPk(bookingId)
    const carCheck=await Car.findByPk(checker.carId)
    
    if (checker===null) {
        return res.status(400).json({
          message: "Validation error",
          error: "No any booking in this id please check booking id again",
        });
      }

    if (checker.totalCost>amountPaid) {
      return res.status(400).json({
        message: "Validation error",
        error: "Your balance is not enough for this transaction",
      });
    }

    if (typeof(amountPaid)!=='number') {
      
      return res.status(400).json({
        message: "Validation error",
        error: "Your should enter number for amountPaid",
      });
    }
    
   if (carCheck.availabilityStatus<=0) {
    return res.status(400).json({
      message: "Validation error",
      error: "This car is sold out in the showroom.",
    });
   } 
   


    const transaction = await Transaction.create({
      id: id,
      bookingId:bookingId,
      amountPaid:amountPaid,
      paymentDate:paymentDate,
      paymentStatus:'pending' 
    });

    const cars=await Car.findByPk(checker.carId)
     await Car.update(
    {   availabilityStatus:cars.availabilityStatus-1},
   
    {  where:{id:checker.carId},}

     

     )
    res.status(200).json({
      message: "Success",
      transaction: transaction,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const getTransactions= async (req, res) => {
  try {
    const dateCurrent=new Date(Date.now())
    await Transaction.update({
      paymentStatus:'completed'
    },{
      where:{
        paymentDate:{
          [Sequelize.Op.lt]:dateCurrent
        }
      }
    })
    const transactions = await Transaction.findAll({
      include:{
        model:db.booking,
        attributes:['userId'],
        required: true,
        where:{
          userId:req.body.userId,
        }
      },
      where:{
        bookingId:req.body.bookingId,
      }
    });
    res.status(200).json({
      message: "Success",
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    const { paymentStatus } = req.body;
   
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
        error: `No transaction found with id:${req.params.id}`,
      });
    } 
    await Transaction.update(
      {
        paymentStatus:paymentStatus
      },
      {
        where: { id: req.params.id },
      }
    );

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
 
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
        error: `No transaction found with id:${req.params.id}`,
      });
    }
    await Transaction.destroy({ where: { id: req.params.id } });

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
 addTransaction,
 getTransactions,
 updateTransaction,
 deleteTransaction
};
