export const authMiddleware = async ({ headers, set, jwt }: any) => {
  const authHeader = headers["authorization"];
  if (!authHeader) {
    set.status = 401;
    throw new Error("UnAuthorized: no token Provided");
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  const decoded = await jwt.verify(token as string);

  if (!decoded || !decoded.userId) {
    set.status = 401;
    throw new Error("UnAuthorized: Invalid Token");
  }

  return {
    userId: decoded.userId as string,
  };
};
