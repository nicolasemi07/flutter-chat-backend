const { io } = require("../index");
const { comprobarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
} = require("../controllers/socket");

// Mensajes de sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  // console.log(client.handshake.headers);
  // console.log(client.handshake.headers['x-token']);

  const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);

  if (!valido) {
    return client.disconnect();
  }

  console.log("Cliente autenticado");

  usuarioConectado(uid);

  // Ingresar al usuario a una sala en particular
  client.join(uid); // Se une a su propia sala para escuchar mensajes personales

  client.on("mensaje-personal", async (payload) => {
    // console.log(payload);
    await grabarMensaje(payload);
    io.to(payload.para).emit("mensaje-personal", payload);
  });

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
    usuarioDesconectado(uid);
  });
});
