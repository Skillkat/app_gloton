const db = require('../models');
const Comercio = db.Comercio;

exports.index = async (req, res) => {
  const comercios = await Comercio.findAll();
  res.render('comercios/index', { comercios });
};

exports.create = (req, res) => {
  res.render('comercios/create');
};

exports.store = async (req, res) => {
  await Comercio.create(req.body);
  res.redirect('/comercios');
};

exports.edit = async (req, res) => {
  const comercio = await Comercio.findByPk(req.params.id);
  res.render('comercios/edit', { comercio });
};

exports.update = async (req, res) => {
  await Comercio.update(req.body, { where: { id: req.params.id } });
  res.redirect('/comercios');
};

exports.destroy = async (req, res) => {
  await Comercio.destroy({ where: { id: req.params.id } });
  res.redirect('/comercios');
};
