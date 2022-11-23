import request from '../request';

export function login(requestBody) {
  return request({
      url: `/api/user/login`,
      method: 'POST',
      data: requestBody,
  });
}
export function refreshToken(requestBody) {
  return request({
      url: `/api/auth/token`,
      method: 'POST',
      data: requestBody,
  });
}