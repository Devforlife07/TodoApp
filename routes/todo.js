const Router = require("express").Router();
const auth = require("./middleware/auth");
const Todo = require("../models/todo")

Router.post("/", auth, async (req, res) => {
    const {
        title,
        description
    } = req.body;
    if ((!title, !description))
        return res.status(400).send({
            msg: "Enter All Fields"
        });
    const todo = new Todo({
        title,
        description,
        user: req.user.id
    })
    try {
        await todo.save();
        res.status(200).send({
            msg: "Successfully Saved"
        })
    } catch (error) {
        console.log(error)
        res.status(500).sendStatus({
            msg: "Internal Server Error"
        })
    }


});
Router.put("/:id", auth, async (req, res) => {

    try {
        const todo = await Todo.findOne({
            _id: req.params.id
        })
        if (!todo)
            return res.status(404).send({
                msg: "No Such Todo Exists"
            })
        if (todo.user != req.user.id)
            return res.status(401).send({
                msg: "Unauthorized Action"
            })

        const {
            title,
            description
        } = req.body;
        if (!title || !description)
            return res.send(400).send({
                msg: "Please Include All Fields"
            })
        await Todo.findByIdAndUpdate(req.params.id, {
            title,
            description
        }, )

        return res.status(200).send({
            msg: "Todo Updated Successfully"
        })

    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})
Router.get("/", auth, async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).select("-user").select("-createdAt")
        res.send(todos)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)

    }
})
Router.delete("/:id", auth, async (req, res) => {

    try {
        const todo = await Todo.findOne({
            _id: req.params.id
        })
        if (!todo)
            return res.status(404).send({
                msg: "No Such Todo Exists"
            })
        if (todo.user != req.user.id)
            return res.status(401).send({
                msg: "Unauthorized Action"
            })
        const bool = await Todo.deleteOne({
            id: req.params.id
        })

        return res.status(200).send({
            msg: "Todo Deleted Successfully"
        })

    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = Router;