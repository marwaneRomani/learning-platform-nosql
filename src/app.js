const express = require('express');

const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '/docs/swagger.json'), 'utf8'));


const config = require('./config/env');
const db = require('./config/db');



const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();



async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();



    // Swagger UI route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // // Configurer les middlewares Express
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // // Monter les routes
    app.use('/api/courses', courseRoutes);
    app.use('/api/students', studentRoutes);

    app.get("/", (req, res, next) => {
      res.json({ message: "test" })
    })

    // Démarrer le serveur
    app.listen(config.port, () => {
      console.log(`running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log("Closing connections...");
  db.closeConnections();
  process.exit(0);

});

startServer();