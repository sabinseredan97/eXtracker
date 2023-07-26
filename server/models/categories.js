module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define("categories", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  categories.sync({ alter: true }).then(() => {
    return categories.bulkCreate(
      [
        { name: "food" },
        { name: "clothes" },
        { name: "home" },
        { name: "investments" },
        { name: "vices" },
        { name: "others" },
      ],
      { updateOnDuplicate: ["name"] }
    );
  });

  return categories;
};
