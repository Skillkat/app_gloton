const db = require('../models');
const Delivery = db.Delivery;

exports.index = async (req, res) => {
  try {
    const deliverys = await Delivery.findAll();
    res.render('deliverys/index', { deliverys });
  } catch (error) {
    console.error(error);
    res.render('deliverys/index', { deliverys: [], error: 'Error al cargar deliverys' });
  }
};

exports.create = (req, res) => {
  res.render('deliverys/create');
};

exports.store = async (req, res) => {
  try {
    await Delivery.create(req.body);
    res.redirect('/deliverys');
  } catch (error) {
    console.error(error);
    res.render('deliverys/create', { error: 'Error al crear delivery' });
  }
};

exports.edit = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return res.redirect('/deliverys');
    res.render('deliverys/edit', { delivery });
  } catch (error) {
    console.error(error);
    res.redirect('/deliverys');
  }
};

exports.update = async (req, res) => {
  try {
    await Delivery.update(req.body, { where: { id: req.params.id } });
    res.redirect('/deliverys');
  } catch (error) {
    console.error(error);
    const delivery = await Delivery.findByPk(req.params.id);
    res.render('deliverys/edit', { delivery, error: 'Error al actualizar delivery' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Delivery.destroy({ where: { id: req.params.id } });
    res.redirect('/deliverys');
  } catch (error) {
    console.error(error);
    res.redirect('/deliverys');
  }
};