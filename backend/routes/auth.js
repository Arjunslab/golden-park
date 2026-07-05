import express from "express";
import jwt from "jsonwebtoken";
import User, { Response } from "../models/user.js";

const authRouter = express.Router();
const jwtsecret = process.env.JWT_SECRET;

// console.log("JWT Secret in auth route:", jwtsecret);
authRouter.get("/login", (req, res) => {
  const { shopnumber } = req.query;

  jwt.sign({ shopnumber }, jwtsecret, { expiresIn: "2d" }, (err, token) => {
    if (err) {
      console.error("JWT signing error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    res.status(200).json({
      success: true,
      token,
    });
  });
});

authRouter.post("/search", async (req, res) => {
  try {
    const rawShopnumber = req.body.shopnumber;
    const shopnumber = String(rawShopnumber || "").trim();

    if (!shopnumber) {
      return res.status(400).json({
        success: false,
        message: "Shop number is required",
      });
    }

    const escapedShopnumber = shopnumber.replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      "\\$&",
    );

    const record = await Response.findOne({
      shopnumber: {
        $regex: new RegExp(`^${escapedShopnumber}$`, "i"),
      },
    });

    if (!record) {
      console.log(`No record found for shop number: ${shopnumber}`);
      return res.status(404).json({
        success: false,
        message: "No data found for this shop number",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching data",
    });
  }
});

authRouter.get("/all-records", async (req, res) => {
  try {
    const records = await Response.find({}).sort({ shopnumber: 1 });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("All records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch records",
    });
  }
});

authRouter.post("/verify-admin", async (req, res) => {
  try {
    const token= req.body.token

    const decoded = jwt.verify(token, jwtsecret);
    console.log(decoded)
    const rawShopnumber = decoded.shopnumber;
    const shopnumber = String(rawShopnumber || "").trim();

    if (!shopnumber) {
      return res.status(400).json({
        success: false,
        message: "Shop number is required",
      });
    }

    const escapedShopnumber = shopnumber.replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      "\\$&",
    );

    const adminRecord = await Response.findOne({
      shopnumber: {
        $regex: new RegExp(`^${escapedShopnumber}$`, "i"),
      },
      role: "Admin",
    });

    if (!adminRecord) {
      return res.status(200).json({
        success: true,
        message: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin access granted",
    });
  } catch (error) {
    console.error("Verify admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify admin access",
    });
  }
});
authRouter.get("/records", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, jwtsecret, async (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const shopnumber = decoded.shopnumber;

    const record = await Response.findOne({
      shopnumber: {
        $regex: new RegExp(`^${shopnumber}$`, "i"),
      },
    }).lean();

    const user = await User.findOne({
      sn: {
        $regex: new RegExp(`^${shopnumber}$`, "i"),
      },
    })
      .select("-_id name email phone area maint role")
      .lean();

    if (!record || !user) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    const data = {
      ...record,
      ...user,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  });
}); // <-- closes /records




authRouter.post("/new", async (req, res) => {
  try {
    const token = req.body.token;
    const area = req.body.area;
    const email = req.body.email;
    const maint = req.body.maintenance;
    const name = req.body.name;
    const phone = req.body.phone;
    const sn = req.body.shopnumber;
    const role = req.body.role;

    const decoded = jwt.verify(token, jwtsecret);

    console.log(decoded);
    console.log("Request body:", req.body);
    console.log("maintenance =", maint);

    await newStuff(area, email, maint, name, phone, sn, role);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Create user error:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});


async function newStuff(area, email, maint, name, phone, sn, role) {
  await User.create({
    area,
    email,
    maint,
    name,
    phone,
    sn,
    role,
  });

  await Response.create({
    shopnumber: sn,
    role,
    totalAmount: maint,
    remainingAmount: maint,
    installments: [],
  });
}




export default authRouter;
