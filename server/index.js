const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");
const JsonDocument = require("./JsonDocument");

// SOCKET.IO PART

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("fetch-document-id-list", async () => {
    try {
      const documentIdList = await getDocumentIds();
      socket.emit("send-document-id-list", documentIdList);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("create-new-or-get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);

    socket.emit("load-document", document.data);

    socket.on("send-username", async (username) => {
      socket.username = username;
      const usersInFile = (await io.in(documentId).fetchSockets()).map((user) => user.username);
      io.sockets.in(documentId).emit("update-user-list", usersInFile);
    });

    socket.on("leave-file", async () => {
      socket.leave(documentId);

      const allSockets = await io.in(documentId).fetchSockets();
      const usersInFile = allSockets.map((user) => user.username);

      io.sockets.in(documentId).emit("update-user-list", usersInFile);
    });
  });

  socket.on("update-json", ({ jsonData, documentId }) => {
    io.sockets.in(documentId).emit("receive-changes", jsonData);
  });

  socket.on("save-document", async ({ data, documentId }) => {
    await JsonDocument.findByIdAndUpdate(documentId, { data });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

// MONGODB PART

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mytestcluster.9rxqxil.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI, { dbName: "JsonCollabApp" })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`Connection error ${err}`);
  });

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await JsonDocument.findById(id);
  if (document) return document;
  return await JsonDocument.create({ _id: id, data: "" });
}

async function getDocumentIds() {
  const documentIds = await JsonDocument.find({}).distinct("_id");
  return documentIds;
}
