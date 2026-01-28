const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");
const diagramController = require("../controllers/diagramController");
const profileController = require("../controllers/profileController");
const imageController = require("../controllers/imageController");

/**
 * Health check GET route
 * Verifies that the API is working correctly.
 * @route GET /
 * @returns {Object} Confirmation message.
 */
router.get("/", (req, res) => {
  res.json({ message: "✅ API is working correctly" });
});

/**
 * Health status route
 * Returns current status and server timestamp.
 * @route GET /health
 * @returns {Object} Server status and timestamp.
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
  });
});

/**
 * Simple profile route
 * Returns authenticated user data.
 * @route GET /perfil
 * @middleware auth - Requires valid JWT token.
 * @returns {Object} Authenticated user data.
 */
router.get("/perfil", auth, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Route to get full profile
 * Retrieves the authenticated user's full data.
 * @route GET /profile
 * @middleware auth - Requires valid JWT token.
 */
router.get("/profile", auth, (req, res, next) => {
  profileController.getProfile(req, res, next);
});

/**
 * Route to get user statistics
 * Retrieves the authenticated user's statistics and achievements.
 * @route GET /profile/stats
 * @middleware auth - Requires valid JWT token.
 */
router.get("/profile/stats", auth, (req, res, next) => {
  profileController.getStats(req, res, next);
});

/**
 * Route to get all user's diagrams
 * Returns the list of diagrams created by the authenticated user.
 * @route GET /diagrams
 * @middleware auth - Requires valid JWT token.
 */
router.get("/diagrams", auth, (req, res, next) => {
  diagramController.getDiagrams(req, res, next);
});

/**
 * Route to get a specific diagram
 * Retrieves the full data of a diagram by its ID.
 * @route GET /diagrams/:id
 * @middleware auth - Requires valid JWT token.
 * @param {string} id - Diagram ID.
 */
router.get("/diagrams/:id", auth, (req, res, next) => {
  diagramController.getDiagramById(req, res, next);
});

/**
 * Route to get user's templates
 * Returns the list of templates created by the authenticated user.
 * @route GET /templates
 * @middleware auth - Requires valid JWT token.
 */
router.get("/templates", auth, (req, res, next) => {
  diagramController.getTemplates(req, res, next);
});

/**
 * Route to update profile
 * Updates the authenticated user's profile data.
 * @route PUT /profile
 * @middleware auth - Requires valid JWT token.
 */
router.put("/profile", auth, (req, res, next) => {
  profileController.updateProfile(req, res, next);
});

/**
 * Route to export personal data.
 * Exports all the user's data in JSON format.
 * @route GET /profile/data-export
 * @middleware auth - Requires valid JWT token.
 */
router.get("/profile/data-export", auth, (req, res, next) => {
  profileController.exportUserData(req, res, next);
});

/**
 * Route to delete user account.
 * Permanently deletes the user's account and all their data.
 * @route DELETE /profile/account
 * @middleware auth - Requires valid JWT token.
 */
router.delete("/profile/account", auth, (req, res, next) => {
  profileController.deleteAccount(req, res, next);
});

/**
 * Route to update a diagram
 * Updates a specific diagram of the authenticated user.
 * @route PUT /diagrams/:id
 * @middleware auth - Requires valid JWT token.
 * @param {string} id - ID of the diagram to update.
 */
router.put("/diagrams/:id", auth, (req, res, next) => {
  diagramController.updateDiagram(req, res, next);
});

/**
 * Echo route for testing
 * Returns the request body sent (development mode only).
 * @route POST /eco
 * @param {Object} body - Request body.
 */
router.post("/eco", (req, res) => {
  if (process.env.NODE_ENV === "development") {
    console.log("📨 Echo received:", req.body);
  }
  res.json(req.body);
});

/**
 * Route to register a new user
 * Creates a new user account with email and password.
 * @route POST /auth/register
 */
router.post("/auth/register", (req, res, next) => {
  authController.register(req, res, next);
});

/**
 * Route to login
 * Authenticates a user and returns a JWT token.
 * @route POST /auth/login
 */
router.post("/auth/login", (req, res, next) => {
  authController.login(req, res, next);
});

/**
 * Route to logout
 * Marks the user's session as finished.
 * @route POST /auth/logout
 * @middleware auth - Requires valid JWT token.
 */
router.post("/auth/logout", auth, (req, res, next) => {
  authController.logout(req, res, next);
});

/**
 * Route to create a new diagram
 * Creates a new diagram for the authenticated user.
 * @route POST /diagrams
 * @middleware auth - Requires valid JWT token.
 */
router.post("/diagrams", auth, (req, res, next) => {
  diagramController.createDiagram(req, res, next);
});

/**
 * Route to upload an image
 * Uploads a base64 image to the server.
 * @route POST /images/upload
 * @middleware auth - Requires valid JWT token.
 */
router.post("/images/upload", auth, (req, res, next) => {
  imageController.uploadImage(req, res, next);
});

/**
 * Route to validate an image URL
 * Validates that a URL points to a valid image.
 * @route POST /images/validate-url
 * @middleware auth - Requires valid JWT token.
 */
router.post("/images/validate-url", auth, (req, res, next) => {
  imageController.validateImageUrl(req, res, next);
});

/**
 * Route to delete a diagram
 * Deletes a specific diagram of the authenticated user.
 * @route DELETE /diagrams/:id
 * @middleware auth - Requires valid JWT token.
 * @param {string} id - ID of the diagram to delete.
 */
router.delete("/diagrams/:id", auth, (req, res, next) => {
  diagramController.deleteDiagram(req, res, next);
});

/**
 * Route to delete an image
 * Deletes an image from the server.
 * @route DELETE /images
 * @middleware auth - Requires valid JWT token.
 */
router.delete("/images", auth, (req, res, next) => {
  imageController.deleteImage(req, res, next);
});

module.exports = router;
