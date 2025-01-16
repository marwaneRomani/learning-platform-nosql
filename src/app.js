const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Course Management API',
      description: 'API for managing courses',
      version: '1.0.0',
    },
  },
  apis: ['./routes/courseRoutes.js', './docs/courseSwagger.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();



async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();



    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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