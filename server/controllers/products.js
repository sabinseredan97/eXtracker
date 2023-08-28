const { users, categories, products } = require("../models");
const { resultsValidator } = require("../middlewares/userDataValidation");
const { Op, Sequelize } = require("sequelize");

async function getCategories(req, res) {
  const allCategories = await categories.findAll();
  return res.status(200).send({
    allCategories,
  });
}

async function addProduct(req, res) {
  const errors = resultsValidator(req);
  if (errors.length > 0) {
    return res.status(400).send({
      method: req.method,
      status: res.statusCode,
      error: errors,
    });
  }
  try {
    const { category, product, price, currency } = req.body;
    const categTable = await categories.findOne({ where: { name: category } });
    const user = await users.findOne({
      where: { username: req.user.username },
    });
    await products.create({
      name: product,
      price: price,
      currency: currency,
      userId: user.id,
      categoryId: categTable.id,
    });
    return res.status(200).send({
      message: "Product added successfully!",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ error: "The product wasn't added due to a error!" });
  }
}

async function getProducts(req, res) {
  try {
    const { order, column, startDate, endDate } = req.params;
    const sortedProducts = await products.findAll({
      where: {
        userId: req.user.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      order: [[column, order]],
      include: categories,
    });
    return res.status(200).send(sortedProducts);
  } catch (error) {
    return res.status(400).send({ message: "there was a error" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await products.destroy({ where: { id: id } });
    return res.status(204).send();
  } catch (error) {
    return req
      .status(400)
      .send({ message: "a error occured while deleting the expense" });
  }
}

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
      where: {
        userId: req.user.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });
    res.status(200).send(periodExpenses);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "there was a error" });
  }
}

module.exports = {
  getCategories,
  addProduct,
  getProducts,
  deleteProduct,
  getTotalExpenses,
  periodExpenses,
};
