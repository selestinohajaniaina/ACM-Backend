const express = require('express');
const router = express.Router();
const { Checkin, Member, sequelize } = require('../models');
const authentification = require('../middleware');
const { Op, Sequelize } = require('sequelize');

router.post('/', async (req, res) => {
  try {
    const { registrationNumber, activityId, checkInTime, checkOutTime, visitReason } = req.body;

    const member = await Member.findOne({ where: { registrationNumber }});

    if (!member) return res.json({ success: false, message: 'Member is not registred', data: null });
    const memberId = member.id;

    const now = new Date(checkInTime);
    const hour = now.getUTCHours();

    // Déterminer si c'est le matin (<12) ou l’après-midi (>=12)
    let periodStart, periodEnd;
    if (hour < 12) {
      periodStart = new Date(now);
      periodStart.setUTCHours(0, 0, 0, 0);
      periodEnd = new Date(now);
      periodEnd.setUTCHours(12, 0, 0, 0);
    } else {
      periodStart = new Date(now);
      periodStart.setUTCHours(12, 0, 0, 0);
      periodEnd = new Date(now);
      periodEnd.setUTCHours(18, 0, 0, 0);
    }

    const existingCheckin = await Checkin.findOne({
      where: {
        memberId,
        checkInTime: { [Op.between]: [periodStart, periodEnd] },
      },
    });

    if (existingCheckin) return res.json({ success: false, message: 'Member has already checked in', data: existingCheckin});

    const checkin = await Checkin.create({ memberId, activityId, checkInTime, checkOutTime, visitReason, });
    res.status(201).json({ success: true, message: 'Checkin created successfully', data: checkin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message ??= 'Error creating checkin', data: null });
  }
});

router.get('/', async (req, res) => {
  try {
    const checkins = await Checkin.findAll({ order: [['id', 'DESC']] });
    res.status(201).json({ success: true, message: 'All checkin', data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message ??= 'Error getting checkins', data: null });
  }
});

router.get('/:registrationNumber', async (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber;
    const checkins = await Checkin.find({ where: {registrationNumber} });
    if (!checkins) {
        res.status(404).json({ success: false, message: 'no checkin found for this member', data: null });
    }
    res.status(201).json({ success: true, message: 'Checkins founds', data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message ??= 'Error getting checkins', data: null });
  }
});

module.exports = router;