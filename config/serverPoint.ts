import serverCredential from './serverCredential.json'

export const server = pointServer()

function pointServer() {
  // return serverCredential.server.SERVER_HOST
  // return serverCredential.staging.SERVER_HOST_BK;
  return serverCredential.staging.LOCAL_HOST
  //return serverCredential.server.SERVER_HOST
  //Task Dev003 | Deployment 002
  //Task Dev004 | Deployment 003
  //Task Dev004 | Deployment 004
  //Task Dev005 | Deployment 005
  //Task Dev008,011,015,014,009,012,013,007,016,010 | Deployment 006
}
