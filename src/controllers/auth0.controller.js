const auth0Service = require('../services/auth0.service');

class Auth0Controller {
  async getToken(req, res) {
    try {
      const token = await auth0Service.getToken();
      res.json({ 
        access_token: token,
        message: 'Token retrieved successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get token', 
        details: error.message 
      });
    }
  }

  async getAllApplications(req, res) {
    try {
      const applications = await auth0Service.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch applications', 
        details: error.message 
      });
    }
  }

  async getApplicationById(req, res) {
    try {
      const { clientId } = req.params;
      const application = await auth0Service.getApplicationById(clientId);
      res.json(application);
    } catch (error) {
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch application', 
        details: error.message 
      });
    }
  }

  async createApplication(req, res) {
    try {
      const applicationData = req.body;
      const newApplication = await auth0Service.createApplication(applicationData);
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to create application', 
        details: error.response?.data || error.message 
      });
    }
  }

  async updateApplication(req, res) {
    try {
      const { clientId } = req.params;
      const updates = req.body;
      const updatedApplication = await auth0Service.updateApplication(clientId, updates);
      res.json(updatedApplication);
    } catch (error) {
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to update application', 
        details: error.message 
      });
    }
  }

  async deleteApplication(req, res) {
    try {
      const { clientId } = req.params;
      await auth0Service.deleteApplication(clientId);
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to delete application', 
        details: error.message 
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await auth0Service.getAllUsers(req.query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch users', 
        details: error.message 
      });
    }
  }

  async getAllRoles(req, res) {
    try {
      const roles = await auth0Service.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch roles', 
        details: error.message 
      });
    }
  }

  async getAllConnections(req, res) {
    try {
      const connections = await auth0Service.getAllConnections();
      res.json(connections);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch connections', 
        details: error.message 
      });
    }
  }
}

module.exports = new Auth0Controller();