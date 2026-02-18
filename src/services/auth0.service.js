const { ManagementClient } = require('auth0');
const axios = require('axios');
const config = require('../config/auth0.config');

class Auth0Service {
  constructor() {
    this.managementClient = null;
    this.tokenCache = {
      token: null,
      expiresAt: null
    };
  }

  /**
   * Initialize Management Client
   */
  async initializeManagementClient() {
    if (!this.managementClient) {
      this.managementClient = new ManagementClient({
        domain: config.managementAPI.domain,
        clientId: config.managementAPI.clientId,
        clientSecret: config.managementAPI.clientSecret,
        scope: config.managementAPI.scope
      });
    }
    return this.managementClient;
  }

  /**
   * Get Bearer Token (Management API Token)
   */
  async getBearerToken() {
    try {
      // Check if token is cached and valid
      if (this.tokenCache.token && this.tokenCache.expiresAt > Date.now()) {
        console.log('✅ Using cached token');
        return this.tokenCache.token;
      }

      console.log('🔄 Fetching new token...');
      
      const response = await axios.post(
        `https://${config.domain}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: config.clientId,
          client_secret: config.clientSecret,
          audience: config.audience
        },
        {
          headers: { 'content-type': 'application/json' }
        }
      );

      const { access_token, expires_in } = response.data;

      // Cache the token
      this.tokenCache.token = access_token;
      this.tokenCache.expiresAt = Date.now() + (expires_in * 1000) - 60000; // Subtract 1 min for safety

      console.log('✅ Token fetched successfully');
      return access_token;
    } catch (error) {
      console.error('❌ Error fetching bearer token:', error.response?.data || error.message);
      throw new Error(`Failed to get bearer token: ${error.message}`);
    }
  }

  /**
   * Create Application (Client)
   */
  async createApplication(applicationData) {
    try {
      const client = await this.initializeManagementClient();
      
      const appConfig = {
        name: applicationData.name,
        description: applicationData.description || '',
        app_type: applicationData.app_type || 'regular_web',
        callbacks: applicationData.callbacks || [],
        allowed_origins: applicationData.allowed_origins || [],
        web_origins: applicationData.web_origins || [],
        allowed_logout_urls: applicationData.allowed_logout_urls || [],
        grant_types: applicationData.grant_types || ['authorization_code', 'refresh_token'],
        jwt_configuration: applicationData.jwt_configuration || {
          alg: 'RS256',
          lifetime_in_seconds: 36000
        }
      };

      const newApp = await client.clients.create(appConfig);
      console.log('✅ Application created:', newApp.client_id);
      
      return {
        success: true,
        data: {
          client_id: newApp.client_id,
          client_secret: newApp.client_secret,
          name: newApp.name,
          app_type: newApp.app_type,
          callbacks: newApp.callbacks,
          created_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Error creating application:', error.message);
      throw new Error(`Failed to create application: ${error.message}`);
    }
  }

  /**
   * Get Application by ID
   */
  async getApplication(clientId) {
    try {
      const client = await this.initializeManagementClient();
      const app = await client.clients.get({ client_id: clientId });
      
      return {
        success: true,
        data: app
      };
    } catch (error) {
      console.error('❌ Error getting application:', error.message);
      throw new Error(`Failed to get application: ${error.message}`);
    }
  }

  /**
   * List All Applications
   */
  async listApplications(options = {}) {
    try {
      const client = await this.initializeManagementClient();
      const apps = await client.clients.getAll({
        page: options.page || 0,
        per_page: options.per_page || 50
      });
      
      return {
        success: true,
        data: apps,
        total: apps.length
      };
    } catch (error) {
      console.error('❌ Error listing applications:', error.message);
      throw new Error(`Failed to list applications: ${error.message}`);
    }
  }

  /**
   * Delete Application
   */
  async deleteApplication(clientId) {
    try {
      const client = await this.initializeManagementClient();
      await client.clients.delete({ client_id: clientId });
      
      console.log('✅ Application deleted:', clientId);
      
      return {
        success: true,
        message: `Application ${clientId} deleted successfully`,
        deleted_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error deleting application:', error.message);
      throw new Error(`Failed to delete application: ${error.message}`);
    }
  }

  /**
   * Update Application
   */
  async updateApplication(clientId, updateData) {
    try {
      const client = await this.initializeManagementClient();
      const updatedApp = await client.clients.update(
        { client_id: clientId },
        updateData
      );
      
      console.log('✅ Application updated:', clientId);
      
      return {
        success: true,
        data: updatedApp
      };
    } catch (error) {
      console.error('❌ Error updating application:', error.message);
      throw new Error(`Failed to update application: ${error.message}`);
    }
  }
}

module.exports = new Auth0Service();