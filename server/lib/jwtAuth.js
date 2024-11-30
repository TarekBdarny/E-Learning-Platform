import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (userId, res) => {
  console.log("userId", userId);
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });
};

export const authJWT = (req, res, next) => {
  const token = req.cookies.jwt; // Extract the JWT token from the cookie
  console.log(req.cookies);
  console.log("JWT Token:", token); // Log the token to check if it's being retrieved correctly

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }

    req.user = user; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  });
};
