const express = require('express');
const router = express.Router();
const { Checkin, Member, Activity } = require('../models');
const authentification = require('../middleware');
const { Op } = require('sequelize');

router.get('/', authentification, async (req, res) => {
  try {
    let statistic = {};

    const today = new Date();
    const checkins = await Checkin.findAll({
        where: {
            createdAt: {
                [Op.between]: [
                    new Date(today.setHours(0, 0, 0, 0)),
                    new Date(today.setHours(23, 59, 59, 999))
                ]
            }
        },
        include: [
            {
                model: Member,
            },
            {
                model: Activity,
            }
        ]
    });
    statistic.checkins = checkins;

    const member = await Member.count();
    statistic.member = member;

    const activity = await Activity.count();
    statistic.activity = activity;

    res.status(201).json({ success: true, message: 'All Statistics', data: statistic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message ??= 'Error getting statistics', data: null });
  }
});

module.exports = router;