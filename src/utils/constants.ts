// @ts-ignore
export const [userId,userToken] = localStorage.getItem("Authorization")?.split(":")
export const link = process.env.REACT_APP_YMAPI_LINK
