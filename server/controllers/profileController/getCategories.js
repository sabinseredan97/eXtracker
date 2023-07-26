const { categories } = require("../../models");

async function getCategories(req, res) {
  const allCategories = await categories.findAll();
  return res.status(200).send({
    allCategories,
  });
}

module.exports = { getCategories };
