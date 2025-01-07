const { where } = require("sequelize");
const db = require("../config/db");
const Sequelize=require('sequelize')
const Car = db.car;

const addNewCar = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid"); // Dinamik import va destructuring
    const nanoid = customAlphabet("1234567890", 8);
    const id = nanoid();
    const { make, model, year, pricePerDay, availabilityStatus } = req.body;
        
    if (!make) {
      return res.status(400).json({
        message: "Validation error",
        error: "Please enter make of car",
      });
    }
    if (!model) {
        return res.status(400).json({
          message: "Validation error",
          error: "Please enter model of car",
        });
      }
      if (!year) {
        return res.status(400).json({
          message: "Validation error",
          error: "Please enter year of car",
        });
      }
      if (!pricePerDay) {
        return res.status(400).json({
          message: "Validation error",
          error: "Please enter daily payment of car",
        });
      }
      if (!availabilityStatus) {
        return res.status(400).json({
          message: "Validation error",
          error: "Please enter existing status of car",
        });
      }

    const car = await Car.create({
      id: id,
      make:make,
      model: model,
      year: year,
      pricePerDay: pricePerDay,
      availabilityStatus:availabilityStatus
    });

    res.status(200).json({
      message: "Success",
      car: car,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const getCars = async (req, res) => {
  try {
   
    const limit=parseInt(req.query.limit)||5
    const page=parseInt(req.query.page)||1
    const total=await Car.count()
    
    const cars=await Car.findAll({
      offset:(page-1)*limit,
      limit:limit
    })
    res.status(200).json({
        message:'Success',
        currentpage:page,
        pageCount:Math.ceil(total/limit),
        nextPage:Math.ceil(total/limit)< page+1 ? null : page+1 ,
        data:cars,
        total:total
    })


  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    const { make, model, year, pricePerDay, availabilityStatus } = req.body;
    if (!car) {
      return res.status(404).json({
        message: "Car not found",
        error: `No car found with id:${req.params.id}`,
      });
    } 
    await Car.update(
      {
        make:make,
        model: model,
        year: year,
        pricePerDay: pricePerDay,
        availabilityStatus:availabilityStatus
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
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
        error: `No car found with id:${req.params.id}`,
      });
    }
    await Car.destroy({ where: { id: req.params.id } });

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

const getCarsByMake = async (req, res) => {
  try {
    const cars = await Car.findAll({where:{make:req.body.make}})
    res.status(200).json({
      message: "Success",
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getCarsByModel = async (req, res) => {
  try {
    const cars = await Car.findAll({where:{model:req.body.model}})
    res.status(200).json({
      message: "Success",
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getCarsByYear = async (req, res) => {
  try {
    const cars = await Car.findAll({where:{year:req.body.year}})
    res.status(200).json({
      message: "Success",
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getCarsByPrice = async (req, res) => {
  try {
    const cars = await Car.findAll(
    {   where:{
      pricePerDay:{
      [Sequelize.Op.between]:[req.body.minPrice,req.body.maxPrice]
      }
      
      }
      })
        res.status(200).json({
      message: "Success",
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getCarsWithSort = async (req, res) => {
  try {
    const cars = await Car.findAll({order: [['pricePerDay', 'ASC']]});
    res.status(200).json({
      message: "Success",
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};


module.exports = {
  addNewCar,
  getCars,
  updateCar,
  deleteCar,
  getCarsByMake,
  getCarsByModel,
  getCarsByYear,
  getCarsByPrice,
  getCarsWithSort
};
