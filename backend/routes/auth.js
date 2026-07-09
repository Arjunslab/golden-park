import express from "express";
import { randomInt } from "crypto";

import User, { Response } from "../models/user.js";

import { sendWelcomeEmail, sendOtpConsentEmail } from "../services/email.js";

import {
  createTempToken,
  createLoginToken,
  createVerificationToken,
  verifyToken,
} from "../utils/jwt.js";

import { requireAuth } from "../middleware/auth.js";

const authRouter = express.Router();

function exactMatch(value) {
  return new RegExp(
    `^${String(value).replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`,
    "i",
  );
}

/* =====================================================
   LOGIN
===================================================== */

authRouter.get("/login", async (req, res) => {
  try {
    const sn = req.query.shopnumber;

    if (!sn) {
      return res.status(400).json({
        success: false,
        message: "Shop number is required",
      });
    }

    const user = await User.findOne({
      sn: exactMatch(sn),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await sendWelcomeEmail(user.name, user.email, user.sn);

    return res.status(200).json({
      success: true,
      otp_need: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* =====================================================
   SEARCH
===================================================== */

authRouter.post("/search", async (req, res) => {
  try {
    const { shopnumber } = req.body;

    if (!shopnumber) {
      return res.status(400).json({
        success: false,
        message: "Shop number is required",
      });
    }

    const record = await Response.findOne({
      shopnumber: exactMatch(shopnumber),
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* =====================================================
   ALL RECORDS
===================================================== */

authRouter.get("/all-records", async (req, res) => {
  try {
    const records = await Response.find({})
      .sort({
        shopnumber: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch records",
    });
  }
});

/* =====================================================
   VERIFY ADMIN
===================================================== */

authRouter.post("/verify-admin", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = verifyToken(token);

    const admin = await Response.findOne({
      shopnumber: exactMatch(decoded.sn),
      role: "Admin",
    });

    return res.status(200).json({
      success: true,
      message: !!admin,
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

/* =====================================================
   GET RECORDS
===================================================== */

authRouter.get("/records", requireAuth, async (req, res) => {
  try {
    const { sn } = req.user;
    console.log("req.user =", req.user);
    console.log("sn =", req.user.sn);
    console.log(req.headers.authorization);
    console.log(await Response.find().select("shopnumber"));
    console.log(await User.find().select("sn"));



    const record = await Response.findOne({
      shopnumber: exactMatch(sn),
    }).lean();

    const user = await User.findOne({
      sn: exactMatch(sn),
    })
      .select("-_id name email phone area maint role")
      .lean();

    if (!record || !user) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...record,
        ...user,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* =====================================================
   CREATE USER
===================================================== */

authRouter.post("/new", requireAuth, async (req, res) => {
  try {
    const {
      area,
      email,
      maintenance,
      name,
      phone,
      shopnumber,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [
        {
          sn: exactMatch(shopnumber),
        },
        {
          email: exactMatch(email),
        },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    await User.create({
      area,
      email,
      maint: maintenance,
      name,
      phone,
      sn: shopnumber,
      role,
    });

    await Response.create({
      shopnumber,
      role,
      totalAmount: maintenance,
      remainingAmount: maintenance,
      installments: [],
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate record",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


/* =====================================================
   SEND OTP
===================================================== */

authRouter.post("/send-otp", async (req, res) => {
  try {
    const { shopnumber } = req.body;

    if (!shopnumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shop number is required",
      });
    }

    const user = await User.findOne({
      sn: exactMatch(shopnumber),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = randomInt(100000, 1000000).toString();

    user.emailOtp = otp;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerified = false;

    await user.save();

    // Create verification link
    const verificationToken = createVerificationToken(
      user.sn,
      user.email
    );

    const verificationLink =
      `https://golden.bajpai.dev/verify-email?token=${verificationToken}`;

    // Send Email
    await sendOtpConsentEmail(
      user.name,
      user.email,
      otp,
      verificationLink
    );

    // Temporary login session
    const tempToken = createTempToken(user.sn);

    return res.status(200).json({
      success: true,
      token: tempToken,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Send OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* =====================================================
   VERIFY OTP
===================================================== */

authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { otp, token } = req.body;

  

    if (!otp || !token) {
      return res.status(400).json({
        success: false,
        message: "OTP and token are required",
      });
    }

    const decoded = verifyToken(token);

    const user = await User.findOne({
      sn: exactMatch(decoded.sn),
    });
console.log("Stored:", user.emailOtp);
console.log("Received:", otp);



    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.emailOtp || user.emailOtp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.emailOtpExpires ||
      user.emailOtpExpires < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    const loginToken = createLoginToken(user.sn);

    return res.status(200).json({
      success: true,
      token: loginToken,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});

/* =====================================================
   VERIFY EMAIL LINK
===================================================== */

authRouter.post("/verify-link", async (req, res) => {
  try {
    const { verificationToken } = req.body;

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const decoded = verifyToken(verificationToken);

    const user = await User.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    const loginToken = createLoginToken(user.sn);

    return res.status(200).json({
      success: true,
      token: loginToken,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("Verify Link Error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired verification link",
    });
  }
});

export default authRouter;