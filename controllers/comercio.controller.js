const db = require('../models');
const Comercio = db.Comercio;

exports.index = async (req, res) => {
  try {
    const comercios = await Comercio.findAll();
    res.render('comercios/index', { comercios });
  } catch (error) {
    console.error(error);
    res.render('comercios/index', { comercios: [], error: 'Error al cargar comercios' });
  }
};

exports.create = (req, res) => {
  res.render('comercios/create');
};

exports.store = async (req, res) => {
  try {
    await Comercio.create(req.body);
    res.redirect('/comercios');
  } catch (error) {
    console.error(error);
    res.render('comercios/create', { error: 'Error al crear comercio' });
  }
};

exports.edit = async (req, res) => {
  try {
    const comercio = await Comercio.findByPk(req.params.id);
    if (!comercio) return res.redirect('/comercios');
    res.render('comercios/edit', { comercio });
  } catch (error) {
    console.error(error);
    res.redirect('/comercios');
  }
};

exports.update = async (req, res) => {
  try {
    await Comercio.update(req.body, { where: { id: req.params.id } });
    res.redirect('/comercios');
  } catch (error) {
    console.error(error);
    const comercio = await Comercio.findByPk(req.params.id);
    res.render('comercios/edit', { comercio, error: 'Error al actualizar comercio' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Comercio.destroy({ where: { id: req.params.id } });
    res.redirect('/comercios');
  } catch (error) {
    console.error(error);
    res.redirect('/comercios');
  }
};