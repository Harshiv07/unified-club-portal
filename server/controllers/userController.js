import mongoose from "mongoose";
import User from "../models/user";
import Event from "../models/event";

export const getRegisteredEvents = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id).exec();
    const eventIds = user["registeredEvents"];
    try {
      const events = eventIds.map(async id => {
        const event = await Event.findById(id).exec();
        if (event) {
          return event;
        }
      });
      const eventList = await Promise.all(events);
      res.status(200).json({
        success: true,
        data: eventList,
      });
    } catch (err) {
      res.status(500).json({ errors: [err.message] });
    }
  } catch (error) {
    console.log("Catch", error.message);
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getUserList = async (req, res) => {
  const ids = req.body.ids;
  try {
    const users = ids.map(async id => {
      const user = await User.findById(id).exec();

      if (user) {
        return user;
      }
    });
    const userList = await Promise.all(users);
    res.status(200).json({
      success: true,
      data: userList,
    });
  } catch (err) {
    console.log("Catch", err.message);
    res.status(500).json({
      errors: [err.message],
    });
  }
};
