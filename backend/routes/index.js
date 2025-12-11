const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");
const diagramController = require("../controllers/diagramController");
const profileController = require("../controllers/profileController");
const imageController = require("../controllers/imageController");

/**
 * Ruta GET de salud
 * Verifica que la API está funcionando correctamente.
 * @route GET /
 * @returns {Object} Mensaje de confirmación.
 */
router.get("/", (req, res) => {
  res.json({ mensaje: "✅API funcionando correctamente" });
});

/**
 * Ruta de estado de salud
 * Devuelve el estado actual y timestamp del servidor.
 * @route GET /health
 * @returns {Object} Estado del servidor y timestamp.
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
  });
});

/**
 * Ruta de perfil simplificado
 * Devuelve datos del usuario autenticado.
 * @route GET /perfil
 * @middleware auth - Requiere token JWT válido.
 * @returns {Object} Datos del usuario autenticado.
 */
router.get("/perfil", auth, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Ruta para obtener perfil completo
 * Obtiene los datos completos del usuario autenticado.
 * @route GET /profile
 * @middleware auth - Requiere token JWT válido.
 */
router.get("/profile", auth, (req, res, next) => {
  profileController.getProfile(req, res, next);
});

/**
 * Ruta para obtener estadísticas del usuario
 * Obtiene las estadísticas y logros del usuario autenticado.
 * @route GET /profile/stats
 * @middleware auth - Requiere token JWT válido.
 */
router.get("/profile/stats", auth, (req, res, next) => {
  profileController.getStats(req, res, next);
});

/**
 * Ruta para obtener todos los diagramas del usuario
 * Devuelve la lista de diagramas creados por el usuario autenticado.
 * @route GET /diagrams
 * @middleware auth - Requiere token JWT válido.
 */
router.get("/diagrams", auth, (req, res, next) => {
  diagramController.getDiagrams(req, res, next);
});

/**
 * Ruta para obtener un diagrama específico
 * Obtiene los datos completos de un diagrama por su ID.
 * @route GET /diagrams/:id
 * @middleware auth - Requiere token JWT válido.
 * @param {string} id - ID del diagrama.
 */
router.get("/diagrams/:id", auth, (req, res, next) => {
  diagramController.getDiagramById(req, res, next);
});

/**
 * Ruta para obtener plantillas del usuario
 * Devuelve la lista de plantillas creadas por el usuario autenticado.
 * @route GET /templates
 * @middleware auth - Requiere token JWT válido.
 */
router.get("/templates", auth, (req, res, next) => {
  diagramController.getTemplates(req, res, next);
});

/**
 * Ruta para actualizar perfil
 * Actualiza los datos del perfil del usuario autenticado.
 * @route PUT /profile
 * @middleware auth - Requiere token JWT válido.
 */
router.put("/profile", auth, (req, res, next) => {
  profileController.updateProfile(req, res, next);
});

/**
 * Ruta para exportar datos personales.
 * Exporta todos los datos del usuario en formato JSON.
 * @route GET /profile/data-export
 * @middleware auth - Requiere token JWT válido.
 */
router.get("/profile/data-export", auth, (req, res, next) => {
  profileController.exportUserData(req, res, next);
});

/**
 * Ruta para eliminar cuenta de usuario.
 * Elimina permanentemente la cuenta del usuario y todos sus datos.
 * @route DELETE /profile/account
 * @middleware auth - Requiere token JWT válido.
 */
router.delete("/profile/account", auth, (req, res, next) => {
  profileController.deleteAccount(req, res, next);
});

/**
 * Ruta para actualizar un diagrama
 * Actualiza los datos de un diagrama específico del usuario autenticado.
 * @route PUT /diagrams/:id
 * @middleware auth - Requiere token JWT válido.
 * @param {string} id - ID del diagrama a actualizar.
 */
router.put("/diagrams/:id", auth, (req, res, next) => {
  diagramController.updateDiagram(req, res, next);
});

/**
 * Ruta de echo para pruebas
 * Devuelve el cuerpo de la solicitud enviada (solo en modo desarrollo).
 * @route POST /eco
 * @param {Object} body - Cuerpo de la solicitud.
 */
router.post("/eco", (req, res) => {
  if (process.env.NODE_ENV === "development") {
    console.log("📨 Echo recibido:", req.body);
  }
  res.json(req.body);
});

/**
 * Ruta para registrar un nuevo usuario
 * Crea una nueva cuenta de usuario con email y contraseña.
 * @route POST /auth/register
 */
router.post("/auth/register", (req, res, next) => {
  authController.register(req, res, next);
});

/**
 * Ruta para iniciar sesión
 * Autentica un usuario y devuelve un token JWT.
 * @route POST /auth/login
 */
router.post("/auth/login", (req, res, next) => {
  authController.login(req, res, next);
});

/**
 * Ruta para cerrar sesión
 * Marca la sesión del usuario como finalizada.
 * @route POST /auth/logout
 * @middleware auth - Requiere token JWT válido.
 */
router.post("/auth/logout", auth, (req, res, next) => {
  authController.logout(req, res, next);
});

/**
 * Ruta para crear un nuevo diagrama
 * Crea un nuevo diagrama para el usuario autenticado.
 * @route POST /diagrams
 * @middleware auth - Requiere token JWT válido.
 */
router.post("/diagrams", auth, (req, res, next) => {
  diagramController.createDiagram(req, res, next);
});

/**
 * Ruta para subir una imagen
 * Sube una imagen en base64 al servidor.
 * @route POST /images/upload
 * @middleware auth - Requiere token JWT válido.
 */
router.post("/images/upload", auth, (req, res, next) => {
  imageController.uploadImage(req, res, next);
});

/**
 * Ruta para validar una URL de imagen
 * Valida que una URL sea una imagen válida.
 * @route POST /images/validate-url
 * @middleware auth - Requiere token JWT válido.
 */
router.post("/images/validate-url", auth, (req, res, next) => {
  imageController.validateImageUrl(req, res, next);
});

/**
 * Ruta para eliminar un diagrama
 * Elimina un diagrama específico del usuario autenticado.
 * @route DELETE /diagrams/:id
 * @middleware auth - Requiere token JWT válido.
 * @param {string} id - ID del diagrama a eliminar.
 */
router.delete("/diagrams/:id", auth, (req, res, next) => {
  diagramController.deleteDiagram(req, res, next);
});

/**
 * Ruta para eliminar una imagen
 * Elimina una imagen del servidor.
 * @route DELETE /images
 * @middleware auth - Requiere token JWT válido.
 */
router.delete("/images", auth, (req, res, next) => {
  imageController.deleteImage(req, res, next);
});

module.exports = router;
