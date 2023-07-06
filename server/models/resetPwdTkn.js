module.exports = (sequelize, DataTypes) => {
  const resetPwdTkn = sequelize.define("resetPwdTkn", {
    resetTkn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(Date.now() + 3600000), //Date.now() + 3600,
    },
  });

  return resetPwdTkn;
};
