const { products, categories, users } = require("../../models");

async function addProduct(req, res) {
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

module.exports = { addProduct };
