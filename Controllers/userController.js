import jwt from "jsonwebtoken";
import User from "../Models/userSchema.js";
import transporter from "../services/nodemailer.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { userName, password, email, role, gender, phone } = req.body;

    // validation

    //------------------------------ existing user--------------------------------------
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User exists, try changing email" });
    }

    // ----------------------------password validation------------------------------------
    console.log(`${password}`);
    const regexPass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    console.log(regexPass.test(password));
    if (!regexPass.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
      });
    }

    // --------------------Password hashing-------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // --------------------random String generation------------------------------------
    const randomString = `RS-${Date.now().toString(36).slice(0, 7)}`;
    const activation = false;
    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
      role,
      activation,
      randomString,
      gender,
      phone,
    });
    await newUser.save();

    // --------------------send Activation mail-------------------------------------
    const mailOptions = {
      from: "vatsan.designs@gmail.com",
      to: email,
      subject: "Please Activate your Account",
      html: `<a href='http://localhost:5173/${randomString}'>Click here to activate your account</a> `,
    };
    transporter.sendMail(mailOptions);
    res
      .status(201)
      .json({ message: "User Registerd and Activation mail Sent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in registering user", error });
  }
};

export const activation = async (req, res) => {
  const { randomString } = req.body;
  // validation

  // -----------------------validate user----------------------------
  const user = await User.findOne({ randomString: randomString });
  if (!user) {
    return res.status(404).json({ message: "Invalid Link" });
  }

  try {
    const activate = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { activation: true, randomString: "" } },
      { new: true }
    );
    console.log(activate);
    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in activating user", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // validation
  // ---------------------existing user----------------------
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(404).json({ message: "No user found in this email" });
  }
  // ----------------------activation Check--------------------------
  if (existingUser.activation === false) {
    return res
      .status(400)
      .json({ message: "User not activated please verify your email" });
  }
  // --------------------compare password--------------------------
  const comparedPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!comparedPassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  try {
    // --------------------token generation----------------------------
    const payload = {
      email: email,
      userName: existingUser.userName,
      role: existingUser.role,
      userID: existingUser._id
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    if (!token) {
      return res
        .status(500)
        .json({ message: "Internal server error in creating token" });
    }
    res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in logging user in", error });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // validate
  // ------------------------user Validation-------------------------
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(404).json({ message: "No user found" });
  }

  // ---------------------random string generation and updation-------------------
  const randomString = `PR-${Date.now().toString(36).slice(0, 7)}`;
  const updateRandomString = await User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        randomString: randomString,
        randomStringExpiration: Date.now() + 3600000,
      },
    }
  );

  try {
    const mailOptions = {
      from: "vatsan.designs@gmail.com",
      to: email,
      subject: "Password resetLink",
      html: `Expires in 1 Hr <br><a href='http://localhost:5173/${randomString}'>Link to reset Password</a>`,
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in resetting password" });
  }
};

export const validatePassword = async (req, res) => {
  const { randomString } = req.body;
  // validate
  // -------------------validate existing user-----------------
  const user = await User.findOne({
    randomString: randomString,
    randomStringExpiration: { $gt: Date.now() },
  });
  // console.log(user)
  if (!user) {
    return res.status(404).json({ message: "Invalid Link" });
  }
  try {

    // ---------------------update user randomString--------------------
    await User.findOneAndUpdate(
      {_id: user._id},
      {$set:{randomString: '', randomStringExpiration: null}},
      {new:true}
    )
    res.status(200).json({message:"Please reset Password", userID: user._id})
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error in validating password change link",
      });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword, userID } = req.body;
console.log(newPassword, userID)
  // validation



  // -----------------------------validate User and String---------------------
  const existingUser = await User.findOne({
    _id: userID,
    
  });
  if (!existingUser) {
    return res.status(404).json({ message: "userNot found" });
  }


   // ----------------------------password validation------------------------------------
   console.log(`${newPassword}`);
   const regexPass =
     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
   console.log(regexPass.test(newPassword));
   if (!regexPass.test(newPassword)) {
     return res.status(400).json({
       message:
         "Password must be at least 6 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
     });
   }

  try {
    //   ---------------------------hash password--------------------------------------
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // -----------------------update Password------------------------------
    const updatedPassword = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    res.status(201).json({ message: "Password reset Successfull" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Internal server error in updating new Password",
        error,
      });
  }
};
