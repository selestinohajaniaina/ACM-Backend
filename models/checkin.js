'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checkin.belongsTo(models.Member, { foreignKey: 'memberId' });
      Checkin.belongsTo(models.Activity, { foreignKey: 'activityId' });
    }
  }
  Checkin.init({
    memberId: DataTypes.INTEGER,
    activityId: DataTypes.INTEGER,
    checkInTime: DataTypes.DATE,
    checkOutTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Checkin',
  });
  return Checkin;
};