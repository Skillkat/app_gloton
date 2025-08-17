const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { isAuthenticated, isTipo } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes JPEG o PNG'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', isAuthenticated, isTipo(['comercio', 'admin']), productoController.index);
router.get('/create', isAuthenticated, isTipo(['comercio', 'admin']), productoController.create);
router.post('/', isAuthenticated, isTipo(['comercio', 'admin']), upload.single('imagen'), productoController.store);
router.get('/:id/edit', isAuthenticated, isTipo(['comercio', 'admin']), productoController.edit);
router.put('/:id', isAuthenticated, isTipo(['comercio', 'admin']), upload.single('imagen'), productoController.update);
router.delete('/:id', isAuthenticated, isTipo(['comercio', 'admin']), productoController.destroy);

module.exports = router;