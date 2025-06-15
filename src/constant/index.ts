
export const AccessToken = process.env.ACCESS_TOKEN_SECRET;
export const AccessTokenExpire = (process.env.ACCESS_TOKEN_EXPIRE || "1d");
export const RefreshToken =  process.env.REFRESH_TOKEN_SECRET;
export const RefreshTokenExpire = (process.env.REFRESH_TOKEN_EXPIRE || "7d");