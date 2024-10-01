// models/UserSettings.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('UserSettings', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Reference to the User model
        key: 'id',
      },
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null values
    },
  });

  UserSettings.associate = function (models) {
    UserSettings.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserSettings;
};
