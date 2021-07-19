import mongoose from 'mongoose';
import Club from '../models/club';
import User from '../models/user';

export const getClubList = async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.status(200).json({ success: true, data: clubs });
  }
  catch {
    res.status(500).send();
  }
};

export const getClubInfo = async (req, res) => {
  try {
    const clubId = req.params.id;
    const club = await Club.findById(clubId).exec();
    res.status(200).json({
      success: true,
      data: club
    });
  }
  catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};

export const saveClub = async (req, res) => {
  let club;
  try {
    if (req.body.hasOwnProperty('_id')) {
      club = await Club.findById(req.body['_id']);
      if (!club) {
        return res.status(404).json({
          errors: ['Entity Not found']
        })
      }
      const updates = Object.keys(req.body);
      updates.forEach((update) => {
        club[update] = req.body[update]
      })
    }
    else {
      club = new Club({ _id: new mongoose.Types.ObjectId, ...req.body });
    }
    await club.save();
    res.status(201).json({ success: true, data: club });
  }
  catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
}

export const enrollMemberInClub = async (req, res) => {
  const { userId, clubId } = req.body;
  try {
    const club = await Club.findById(clubId).exec();
    const user = await User.findById(userId).exec(); //Just to check if user is present in DB
    if (club.members.includes(userId)) {
      res.status(201).json({ success: true, message: 'User is already Enrolled', data: club });
    }
    else {
      club.members.push(userId);
      await club.save();
      res.status(201).json({ success: true, data: club });
    }


  }
  catch (err) {
    console.log('Catch', err.message);
    res.status(500).json({
      errors: [err.message]
    })
  }
}

export const removeMemberFromClub = async (req, res) => {
  const { userId, clubId } = req.body;
  try {
    const club = await Club.findById(clubId).exec();
    const user = await User.findById(userId).exec(); //Just to check if user is present in DB
    if (club.members.includes(userId)) {
      const index = club.members.indexOf(userId);
      if (index > -1) {
        club.members.splice(index, 1);
        await club.save();
      }
    }
    res.status(201).json({ success: true, data: club });


  }
  catch (err) {
    console.log('Catch', err.message);
    res.status(500).json({
      errors: [err.message]
    })
  }
}

