const { response } = require("express");
const Mensaje = require("../models/mensaje");

const obtenerChat = async (req, res = response) => {
  const miId = req.uid;
  const mensajesDe = req.params.de;

  const condicion = [
    { de: miId, para: mensajesDe },
    { de: mensajesDe, para: miId },
  ];

  const last30 = await Mensaje.find({ $or: condicion })
    .sort({ createdAt: "desc" })
    .limit(30);

  res.json({
    ok: true,
    mensajes: last30,
  });
};

module.exports = { obtenerChat };
