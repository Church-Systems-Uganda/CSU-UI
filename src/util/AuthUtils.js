import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
  const header = new Headers({
    'Content-Type': 'application/json',
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
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
  return request({
    url: `${API_BASE_URL}/user/current-user`,
    method: 'GET',
  });
}

export function createAccount(signRequest) {
  return request({
    url: `${API_BASE_URL}/auth/create-account`,
    method: 'POST',
    body: JSON.stringify(signRequest),
  });
}

export function checkUserName(loginRequest) {
  return request({
    url: `${API_BASE_URL}/auth/check-username`,
    method: 'POST',
    body: JSON.stringify(loginRequest),
  });
}

export function login(signRequest) {
  return request({
    url: `${API_BASE_URL}/auth/login`,
    method: 'POST',
    body: JSON.stringify(signRequest),
  });
}
