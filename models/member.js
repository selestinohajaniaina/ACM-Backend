'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.hasMany(models.Checkin, { foreignKey: 'memberId' });
    }
  }
  Member.init({
    registrationNumber: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    birthPlace: DataTypes.STRING,
    address: DataTypes.STRING,
    occupation: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    studyOrWorkPlace: DataTypes.STRING,
    joinDate: DataTypes.DATE,
    profileImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};