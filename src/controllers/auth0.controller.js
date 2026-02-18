const auth0Service = require('../services/auth0.service');

class Auth0Controller {
  /**
   * GET /api/auth0/token
   */
  async getToken(req, res, next) {
    try {
      const token = await auth0Service.getBearerToken();
      res.status(200).json({
        success: true,
        access_token: token,
        token_type: 'Bearer'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth0/applications
   */
  async createApplication(req, res, next) {
    try {
      const result = await auth0Service.createApplication(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth0/applications/:clientId
   */
  async getApplication(req, res, next) {
    try {
      const { clientId } = req.params;
      const result = await auth0Service.getApplication(clientId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth0/applications
   */
  async listApplications(req, res, next) {
    try {
      const { page, per_page } = req.query;
      const result = await auth0Service.listApplications({ page, per_page });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/auth0/applications/:clientId
   */
  async deleteApplication(req, res, next) {
    try {
      const { clientId } = req.params;
      const result = await auth0Service.deleteApplication(clientId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/auth0/applications/:clientId
   */
  async updateApplication(req, res, next) {
    try {
      const { clientId } = req.params;
      const result = await auth0Service.updateApplication(clientId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth0Controller();