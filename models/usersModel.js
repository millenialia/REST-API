const { model, Schema } = require("mongoose");
const { compare, genSalt, hash } = require("bcrypt");
const crypto = require('crypto')

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: String,
  },
  {
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {

  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex')

    this.avatarURL=`https://www.gravatar.com/avatar/${emailHash}.jpeg?d=retro`
  }

  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, passwordHash) =>
  compare(candidate, passwordHash);

const User = model("User", userSchema);

module.exports = User;
