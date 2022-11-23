import request from '../request';

export function startProgress(requestBody) {
  return request({
      url: `/api/worker/predict`,
      method: 'POST',
      data: requestBody,
  });
}
export function proceeding(param) {
  return request({
      url: `/api/worker/progress`,
      method: 'GET',
      params: param,
      headers: {
        'Accept' : 'application/json'
      }
  });
}
export function killProgress(requestBody) {
  return request({
      url: `/api/worker/kill`,
      method: 'POST',
      data: requestBody,
  });
}
