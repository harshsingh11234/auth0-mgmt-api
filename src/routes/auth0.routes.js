const express = require('express');
const router = express.Router();
const auth0Controller = require('../controllers/auth0.controller');

/**
 * @route   GET /api/auth0/token
 * @desc    Get Bearer Token
 * @access  Public (should be protected in production)
 */
router.get('/token', auth0Controller.getToken.bind(auth0Controller));

/**
 * @route   POST /api/auth0/applications
 * @desc    Create new application
 * @access  Public (should be protected in production)
 */
router.post('/applications', auth0Controller.createApplication.bind(auth0Controller));

/**
 * @route   GET /api/auth0/applications
 * @desc    List all applications
 * @access  Public (should be protected in production)
 */
router.get('/applications', auth0Controller.listApplications.bind(auth0Controller));

/**
 * @route   GET /api/auth0/applications/:clientId
 * @desc    Get application by ID
 * @access  Public (should be protected in production)
 */
router.get('/applications/:clientId', auth0Controller.getApplication.bind(auth0Controller));

/**
 * @route   PATCH /api/auth0/applications/:clientId
 * @desc    Update application
 * @access  Public (should be protected in production)
 */
router.patch('/applications/:clientId', auth0Controller.updateApplication.bind(auth0Controller));

/**
 * @route   DELETE /api/auth0/applications/:clientId
 * @desc    Delete application
 * @access  Public (should be protected in production)
 */
router.delete('/applications/:clientId', auth0Controller.deleteApplication.bind(auth0Controller));

module.exports = router;