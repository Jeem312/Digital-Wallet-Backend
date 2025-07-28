import { Router } from "express";

const UserRoutes = Router();

UserRoutes.get("/", (req, res) => {
  res.send("All users list");
});

UserRoutes.post("/", (req, res) => {
  res.send("Create new user");
});

export default UserRoutes;
