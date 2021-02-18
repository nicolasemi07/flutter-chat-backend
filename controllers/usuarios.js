const { response } = require("express");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res = response) => {
  try {

    const desde = Number(req.query.desde) || 0;

    // Muestra primero los 20 usuarios que están conectados (filtrando al usuario logueado y paginando usuarios)
    const usuarios = await Usuario
        .find({ _id: { $ne: req.uid } })
        .sort("-online")
        .skip(desde)
        .limit(20);

    res.status(500).json({
      ok: true,
      usuarios,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

module.exports = { getUsuarios };
