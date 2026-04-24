class ApiClientError extends Error {
  constructor(message, statusCode, details) {
    super(message || 'Request failed');
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const AUTH_ACCESS_TOKEN_KEY = 'auth-access-token';
const AUTH_REFRESH_TOKEN_KEY = 'auth-refresh-token';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : '';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStoredValue = (key) => {
  if (!canUseStorage()) {
    return '';
  }

  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

const setStoredValue = (key, value) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage failures and fall back to cookie-based auth where possible.
  }
};

export const getStoredAuthTokens = () => ({
  accessToken: getStoredValue(AUTH_ACCESS_TOKEN_KEY),
  refreshToken: getStoredValue(AUTH_REFRESH_TOKEN_KEY)
});

export const setStoredAuthTokens = ({ accessToken = '', refreshToken = '' } = {}) => {
  setStoredValue(AUTH_ACCESS_TOKEN_KEY, accessToken);
  setStoredValue(AUTH_REFRESH_TOKEN_KEY, refreshToken);
};

export const clearStoredAuthTokens = () => {
  setStoredValue(AUTH_ACCESS_TOKEN_KEY, '');
  setStoredValue(AUTH_REFRESH_TOKEN_KEY, '');
};

const getAuthHeaders = () => {
  const { accessToken } = getStoredAuthTokens();

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const buildUrl = (path) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
};

const buildHeaders = (customHeaders, isFormData) => {
  const headers = { ...getAuthHeaders(), ...customHeaders };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const parseResponsePayload = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : null;
};

const tryRefreshAccessToken = async () => {
  const { refreshToken } = getStoredAuthTokens();

  if (!refreshToken) {
    return false;
  }

  const response = await fetch(buildUrl('/api/users/refresh_token'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    return false;
  }

  const payload = await parseResponsePayload(response);
  const refreshedTokens = payload?.data || {};

  if (!refreshedTokens.accessToken) {
    return false;
  }

  setStoredAuthTokens({
    accessToken: refreshedTokens.accessToken,
    refreshToken: refreshedTokens.refreshToken || refreshToken
  });

  return true;
};

const request = async (path, options = {}, shouldRetry = true) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildUrl(path), {
    method: options.method || 'GET',
    credentials: 'include',
    headers: buildHeaders(options.headers, isFormData),
    body: isFormData
      ? options.body
      : (options.body ? JSON.stringify(options.body) : undefined)
  });

  const payload = await parseResponsePayload(response);

  if (response.status === 401 && shouldRetry && path !== '/api/users/refresh_token') {
    const refreshed = await tryRefreshAccessToken();

    if (refreshed) {
      return request(path, options, false);
    }
  }

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message || response.statusText,
      response.status,
      payload?.errors || payload
    );
  }

  return payload;
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' })
};

export { ApiClientError };