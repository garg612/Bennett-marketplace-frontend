class ApiClientError extends Error {
  constructor(message, statusCode, details) {
    super(message || 'Request failed');
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : '';

const buildUrl = (path) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
};

const buildHeaders = (customHeaders, isFormData) => {
  const headers = { ...customHeaders };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildUrl(path), {
    method: options.method || 'GET',
    credentials: 'include',
    headers: buildHeaders(options.headers, isFormData),
    body: isFormData
      ? options.body
      : (options.body ? JSON.stringify(options.body) : undefined)
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

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