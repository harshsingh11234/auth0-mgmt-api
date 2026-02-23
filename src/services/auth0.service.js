const axios = require('axios');

class Auth0Service {
  constructor() {
    this.domain = process.env.AUTH0_DOMAIN;
    this.clientId = process.env.AUTH0_CLIENT_ID;
    this.clientSecret = process.env.AUTH0_CLIENT_SECRET;
    this.audience = process.env.AUTH0_AUDIENCE;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`https://${this.domain}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        grant_type: 'client_credentials'
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Auth0 token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Auth0');
    }
  }

  async makeRequest(method, endpoint, data = null) {
    const token = await this.getToken();
    const url = `https://${this.domain}/api/v2${endpoint}`;

    try {
      const config = {
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Auth0 API Error:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getAllApplications() {
    return this.makeRequest('GET', '/clients');
  }

  async getApplicationById(clientId) {
    return this.makeRequest('GET', `/clients/${clientId}`);
  }

  async createApplication(applicationData) {
    return this.makeRequest('POST', '/clients', applicationData);
  }

  async updateApplication(clientId, updates) {
    return this.makeRequest('PATCH', `/clients/${clientId}`, updates);
  }

  async deleteApplication(clientId) {
    return this.makeRequest('DELETE', `/clients/${clientId}`);
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest('GET', `/users?${queryString}`);
  }

  async getAllRoles() {
    return this.makeRequest('GET', '/roles');
  }

  async getAllConnections() {
    return this.makeRequest('GET', '/connections');
  }
}

module.exports = new Auth0Service();