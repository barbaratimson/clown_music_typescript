export const userId = localStorage.getItem("Authorization")?.split(":")[0] ?? ""
export const userToken = localStorage.getItem("Authorization")?.split(":")[1] ?? ""
export const link = process.env.REACT_APP_YMAPI_LINK
