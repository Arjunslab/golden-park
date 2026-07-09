import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET;

export function createTempToken(sn) {
  return jwt.sign({ sn }, jwtsecret, {
    expiresIn: "10m",
  });
}

export function createLoginToken(sn) {
  return jwt.sign({ sn }, jwtsecret, {
    expiresIn: "7d",
  });
}

export function createVerificationToken(sn, email) {
  return jwt.sign(
    {
      sn,
      email,
    },
    jwtsecret,
    {
      expiresIn: "10m",
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, jwtsecret);
}
