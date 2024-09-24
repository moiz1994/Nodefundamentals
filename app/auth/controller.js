import { compare } from "./crypt.js";
import { User } from "./model.js";

export const showLogin = (req, res) =>
  res.render("auth/login", { title: "Login", layout: "plain" });

export async function authenticate(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.redirect("/login");
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.redirect("/login");
    return;
  }

  if (await compare(password, user.password)) {
    req.session.user = {
      email,
      isAuthenticated: true,
    };

    res.redirect("/guitars");
  } else {
    res.redirect("/login");
  }
}

export function checkAuth(req, res, next) {
  let isAuthenticated = req.session.user && req.session.user.isAuthenticated;

  if (isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
}

export function logout(req, res) {
  req.session.destroy();

  res.redirect("/");
}
