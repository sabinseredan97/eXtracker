const { categories, products } = require("../models");
const { Op, Sequelize } = require("sequelize");

async function getTotalExpenses(req, res) {
  const { startDate, endDate } = req.params;
  try {
    const categoryExpenses = await products.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("sum", Sequelize.col("price")), "totalPrice"],
      ],
      include: categories,
      group: ["categoryId"],
      where: {
        userId: req.user.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });

    const totalExpenses = await products.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("sum", Sequelize.col("price")), "totalPrice"],
      ],
      group: ["userId"],
      where: {
        userId: req.user.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });
    res.status(200).send({ totalExpenses, categoryExpenses });
  } catch (error) {
    return res.status(400).send({ message: "there was a error" });
  }
}

async function periodExpenses(req, res) {
  const { startDate, endDate } = req.params;
  try {
    const periodExpenses = await products.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdat")), "date"],
        [Sequelize.fn("sum", Sequelize.col("price")), "totalPrice"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
      where: {
        userId: req.user.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });
    res.status(200).send(periodExpenses);
  } catch (error) {
    return res.status(400).send({ message: "there was a error" });
  }
}

module.exports = { getTotalExpenses, periodExpenses };
