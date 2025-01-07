const moment = require("moment");
const db = require("../config/db");
const Booking = db.booking;
const Car = db.car;
const addBooking = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid"); // Dinamik import va destructuring
    const nanoid = customAlphabet("1234567890", 8);
    const id = nanoid();
    const { userId, carId, startDate, endDate } = req.body;
    const checker = await Car.findByPk(carId);
    dat1 = moment(startDate);
    dat2 = moment(endDate);
    const days = dat2.diff(dat1, "days");
    if (checker === null) {
      return res.status(400).json({
        message: "Validation error",
        error: "No any car in this id please check car id again",
      });
    }

    if (!checker.availabilityStatus) {
      return res.status(400).json({
        message: "Validation error",
        error: "This car is sold out in the showroom.",
      });
    }

    const booking = await Booking.create({
      id: id,
      userId: userId,
      carId: carId,
      startDate: startDate,
      endDate: endDate,
      totalCost: checker.pricePerDay * days,
    });

    res.status(200).json({
      message: "Success",
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const getBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const total = await Booking.count();

    if (req.headers.role === "admin") {
      const bookings = await Booking.findAll({
        offset: (page - 1) * limit,
        limit: limit,
      });
      return res.status(200).json({
        message: "Success",
        currentpage: page,
        pageCount: Math.ceil(total / limit),
        nextPage: Math.ceil(total / limit) < page + 1 ? null : page + 1,
        bookings: bookings,
      });
    }

    if (req.body.userId === undefined) {
      return res.json("Please enter your id. Only admins can see all bookings");
    }
    const userBookings = await Booking.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      where: {
        userId: req.body.userId,
      },
    });
    res.status(200).json({
      message: "Success",
      currentpage: page,
      pageCount: Math.ceil(total / limit),
      nextPage: Math.ceil(total / limit) < page + 1 ? null : page + 1,
      bookings: userBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    const { startDate, endDate, status } = req.body;
    const justDate = new Date(Date.now());
    const anDate = new Date(startDate);

    dat1 = moment(startDate);
    dat2 = moment(endDate);
    const days = dat2.diff(dat1, "days");
    const car = await Car.findByPk(booking.carId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        error: `No booking found with id:${req.params.id}`,
      });
    }

    if (justDate > anDate) {
      return res.status(404).json({
        message: "Date confliction",
        error: `You can't change start date.If you want to change dates, you should try earlier than start date`,
      });
    }
    await Booking.update(
      {
        startDate: startDate,
        endDate: endDate,
        status: status,
        totalCost: car.pricePerDay * days,
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
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        error: `No booking found with id:${req.params.id}`,
      });
    }
    await Booking.destroy({ where: { id: req.params.id } });

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
  addBooking,
  getBookings,
  updateBooking,
  deleteBooking,
};
