import request from '../request';

export function fileUpload(requestBody) {
  return request({
      url: `/api/file/upload`,
      method: 'POST',
      data: requestBody,
  });
}
export function fileList() {
  return request({
      url: `/api/user/filelist`,
      method: 'GET',
  });
}
export function srfileList() {
  return request({
      url: `/api/user/predict/filelist`,
      method: 'GET',
  });
}
export function fileDelete(requestBody) {
  return request({
      url: `/api/file/delete`,
      method: 'POST',
      data: requestBody,
  });
}
export function fileDownload(requestBody) {
  return request({
      url: `/api/file/download`,
      method: 'POST',
      data: requestBody,
  });
}
export function setChangeFileList(requestBody) {
  return request({
    url: `/api/user/predict/list`,
    method: 'POST',
    data: requestBody
  })
}
export function getChangeFileList() {
  return request({
    url: `/api/user/predict/list`,
    method: 'GET',
  })
}
export function getStatistics() {
  return request({
    url: `/api/user/statistics`,
    method: 'GET',
  })
}