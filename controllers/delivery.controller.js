const db = require('../models');
const Delivery = db.Delivery;

exports.index = async (req, res) => {
  const deliverys = await Delivery.findAll();
  res.render('deliverys/index', { deliverys });
};

exports.create = (req, res) => {
  res.render('deliverys/create');
};

exports.store = async (req, res) => {
  await Delivery.create(req.body);
  res.redirect('/deliverys');
};

exports.edit = async (req, res) => {
  const delivery = await Delivery.findByPk(req.params.id);
  res.render('deliverys/edit', { delivery });
};

exports.update = async (req, res) => {
  await Delivery.update(req.body, { where: { id: req.params.id } });
  res.redirect('/deliverys');
};

exports.destroy = async (req, res) => {
  await Delivery.destroy({ where: { id: req.params.id } });
  res.redirect('/deliverys');
};
