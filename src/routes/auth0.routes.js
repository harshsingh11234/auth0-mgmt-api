const express = require('express');
const router = express.Router();
const auth0Controller = require('../controllers/auth0.controller');

// Token
router.get('/token', auth0Controller.getToken.bind(auth0Controller));

// Applications
router.get('/applications', auth0Controller.getAllApplications.bind(auth0Controller));
router.get('/applications/:clientId', auth0Controller.getApplicationById.bind(auth0Controller));
router.post('/applications', auth0Controller.createApplication.bind(auth0Controller));
router.patch('/applications/:clientId', auth0Controller.updateApplication.bind(auth0Controller));
router.delete('/applications/:clientId', auth0Controller.deleteApplication.bind(auth0Controller));

// Users
router.get('/users', auth0Controller.getAllUsers.bind(auth0Controller));

// Roles
router.get('/roles', auth0Controller.getAllRoles.bind(auth0Controller));

// Connections
router.get('/connections', auth0Controller.getAllConnections.bind(auth0Controller));

module.exports = router;