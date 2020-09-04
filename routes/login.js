const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken")
Router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) return res.status(401).send({
            msg: "Invalid Credentials"
        });
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err)
                return res.sendStatus(500)
            if (!res) {
                return res.status(401).send({
                    msg: "Invalid Credentials"
                })
            } else {
                const payload = {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email

                    },
                };
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET, {
                        expiresIn: 432000,
                    },
                    (err, token) => {
                        if (err) res.sendStatus(500);
                        res.send(token);
                    }
                );
            }
        })
    } catch (e) {
        res.status(500).json("Error");
    }
});
module.exports = Router;