import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options, noToken) => {
  const header = new Headers({
    'Content-Type': 'application/json',
  });

  if (localStorage.getItem(ACCESS_TOKEN) && !noToken) {
    header.append(
      'Authorization',
      `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    );
  }

  const defaults = { headers: header, ...options };

  return fetch(defaults.url, defaults).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function hasTokenSet() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getCurrentUser() {
  return request(
    {
      url: `${API_BASE_URL}/user/current-user`,
      method: 'GET',
    },
    false
  );
}

export function createAccount(signRequest) {
  return request(
    {
      url: `${API_BASE_URL}/auth/create-account`,
      method: 'POST',
      body: JSON.stringify(signRequest),
    },
    true
  );
}

export function login(signRequest) {
  return request(
    {
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      body: JSON.stringify(signRequest),
    },
    true
  );
}
