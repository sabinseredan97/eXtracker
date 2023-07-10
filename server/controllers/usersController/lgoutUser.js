function logoutUser(req, res) {
  try {
    res.cookie("access-token", "", { maxAge: 1 });
  } catch (err) {
    return res.status(404).send(err);
  }
  return res.status(200).send("logged out");
}

module.exports = { logoutUser };
