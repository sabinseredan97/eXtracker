module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define("products", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return products;
};
