const { users, categories, products } = require("../models");
const { resultsValidator } = require("../middlewares/userDataValidation");

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

module.exports = { getCategories, addProduct };
