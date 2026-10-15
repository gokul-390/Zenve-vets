/**
 * ZenveVet - Frontend API Service Client
 * Provides centralized HTTP request handling, authentication headers,
 * error handling, and endpoints for Posts, Short Videos, Doctors, and Stories.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8080/api';

/**
 * Custom API Error class with HTTP status code and details
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('zenve_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Configure timeout (default 8000ms)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

  const fetchConfig = {
    ...options,
    headers,
    signal: controller.signal,
  };

  if (fetchConfig.body && typeof fetchConfig.body === 'object' && !(fetchConfig.body instanceof FormData)) {
    fetchConfig.body = JSON.stringify(fetchConfig.body);
  }

  try {
    const response = await fetch(url, fetchConfig);
    clearTimeout(timeoutId);

    // Parse response
    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const errorMsg =
        (responseData && responseData.message) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMsg, response.status, responseData);
    }

    return responseData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.', 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    // Network errors (e.g. backend server offline)
    throw new ApiError(
      err.message || 'Network error occurred while contacting ZenveVet API.',
      0,
      err
    );
  }
}

/**
 * Standard HTTP Methods
 */
export const http = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Posts & Short Videos API Endpoints
 */
export const postsApi = {
  /**
   * Fetch all feed posts (with optional category or type filter)
   */
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/posts?${query}` : '/posts';
    return http.get(endpoint);
  },

  /**
   * Fetch only short video reels
   */
  async getShorts() {
    return http.get('/posts/shorts');
  },

  /**
   * Fetch a single post by ID
   */
  async getById(id) {
    return http.get(`/posts/${id}`);
  },

  /**
   * Create a new post or short video
   */
  async create(postData) {
    return http.post('/posts', postData);
  },

  /**
   * Like / unlike a post
   */
  async like(postId) {
    return http.post(`/posts/${postId}/like`);
  },

  /**
   * Add a comment to a post
   */
  async addComment(postId, commentData) {
    return http.post(`/posts/${postId}/comments`, commentData);
  },

  /**
   * Delete a post
   */
  async delete(postId) {
    return http.delete(`/posts/${postId}`);
  },
};

/**
 * Doctors & Professional Profiles API Endpoints
 */
export const doctorsApi = {
  /**
   * Fetch verified doctor profiles
   */
  async getAll() {
    return http.get('/doctors');
  },

  /**
   * Fetch doctor details by ID
   */
  async getById(doctorId) {
    return http.get(`/doctors/${doctorId}`);
  },

  /**
   * Create or register a doctor profile
   */
  async createProfile(profileData) {
    return http.post('/doctors/profile', profileData);
  },

  /**
   * Connect with / follow a doctor
   */
  async toggleFollow(doctorId) {
    return http.post(`/doctors/${doctorId}/follow`);
  },

  /**
   * Search doctors by specialty, name, or location
   */
  async search(searchTerm) {
    return http.get(`/doctors/search?q=${encodeURIComponent(searchTerm)}`);
  },
};

/**
 * Stories API Endpoints
 */
export const storiesApi = {
  /**
   * Fetch active community stories
   */
  async getAll() {
    return http.get('/stories');
  },

  /**
   * Mark a story as viewed by the current user
   */
  async markViewed(storyId) {
    return http.post(`/stories/${storyId}/view`);
  },

  /**
   * Post a new story moment
   */
  async create(storyData) {
    return http.post('/stories', storyData);
  },
};

/**
 * Unified API Client Export
 */
export const api = {
  request,
  http,
  posts: postsApi,
  doctors: doctorsApi,
  stories: storiesApi,
  getBaseUrl: () => API_BASE_URL,
};

export default api;
