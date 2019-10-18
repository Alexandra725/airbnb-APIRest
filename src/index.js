const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hosting', { useNewUrlParser: true });
const userModel = require('./models/user.js')
const allocModel = require('./models/allocation.js')
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//USER
app.post('/registre', async (req, res) => {
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const pic = req.body.pic;
        const hash = await bcrypt.hash(password, 2);

    userModel.create({
        email: email,
        password: hash,
        name: name,
        pic: pic
    }).then(result => {
        res.send(result)
    }).catch(err => {
        res.status(201).send(err)
    });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    userModel.findOne({
        "email": email,
    }, 'password').then( async (result) => {
         const canAccess = await bcrypt.compare(pwd, result.password);
         if (canAccess === true){
            res.send({ message: result, ok: true})
        }else {
            const err = new Error ("no access")
            res.status(401).send({ ok: false, message: err.message})
        }
    }).catch(err => {
        res.status(201).send(err)
    });
});

app.delete('/user/:id', (req, res) => {
    const userId = req.params.id

    userModel.findByIdAndDelete(userId)
        .then(result => {
            if (!result) {
                return res.status(404).send({
                    message: "Product not found with id " + userId
                });
            }
            res.send({ message: "Product deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Product not found with id " + userId
                });
            }
            return res.status(500).send({
                message: "Could not delete product with id " + userId
            });
        });
});

app.put('/user/:id', (req, res) => {
    const userId = req.params.id
    userModel.findByIdAndUpdate(userId, {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        pic: req.body.pic
    })
        .then(result => {
            if (result === null) {
                res.status(404).send({
                    message: "User not found with id " + userId
                });
            } else {
                res.send(result);
            }
        }).catch(err => {
            console.log('error', err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + userId
                });
            }
            return res.status(500).send({
                message: "Something wrong updating user with id " + userId
            });
        });
});

//error
app.get('/user/:id', (req, res)=>{
    const userId = req.params.id
    userModel.findById(userId)
    .then(result =>{
        if (result === null) {
           return res.status(404).send({
                message: "User not found"
            });
        }else{
            res.send(result)
        }
    })
    .catch(err=>{
        if(err.king === 'ObjectId'){
            return res.status(404).send({
                message: "User not found with id " + userId
            });
        }
        return res.status(500).send({
            message: "Something wrong getting user by id" + userId
        });
    });
});

//HOUSE

app.post('/allocation', (req, res) => {
    const allocation = new allocModel({
        adress: req.body.adress,
        type: req.body.type,
        price: req.body.pc,
        owner: {
            name: req.body.owner.name,
            pic: req.body.owner.pic
        }

    });
    allocation.save().then(result => {
        res.send(result)
    }).catch(err => {
        res.status(201).send(err)
    });
});


app.delete('/allocation/:id', (req, res) => {
    const allocId = req.params.id

    allocModel.findByIdAndDelete(allocId)
        .then(result => {
            if (!result) {
                return res.status(404).send({
                    message: "Allocation not found with id " + allocId
                });
            }
            res.send({ message: "Allocation deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Allocation not found with id " + allocId
                });
            }
            return res.status(500).send({
                message: "Could not delete allocation with id " + allocId
            });
        });
});

app.put('/allocation/:id', (req, res) => {
    const allocId = req.params.id
    userModel.findByIdAndUpdate(allocId, {
        adress: req.body.adress,
        type: req.body.type,
        pc: req.body.pc,
        owner: {
            name: req.body.owner.name,
            pic: req.body.owner.pic
        }
    }).then(result => {
            if (result === null) {
                res.status(404).send({
                    message: "Product not found with id " + allocId
                });
            } else {
                res.send(result);
            }
        }).catch(err => {
            console.log('error', err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Product not found with id " + allocId
                });
            }
            return res.status(500).send({
                message: "Something wrong updating note with id " + allocId
            });
        });
})

app.get('/allocation/:id', (req, res)=>{

})

//BOOKINGS

app.post('/allocation/:id/booking', (req, res) => {
    const allocationId = req.params.id;

    allocModel.findById(allocationId)
        .then(result => {
            const mybooking = {
                checkin: req.body.checkin,
                checkout: req.body.checkout,
                user: {
                    name: req.body.user.name,
                    pic: req.body.user.pic
                }
            }
            result.bookings.push(mybooking)
            return result.save();

        }).then((document) => {
            res.send(document)
        })
        .catch(err => {
            res.status(500).send(err)
        })

});

app.get("/allocation/booking/:id", function (req, res) {
    res.send(req.params.id)
});

app.post("/booking", function (req, res) {

});
//acabar
app.delete("/allocation/booking/:id", function (req, res) {
    const bookId = req.params.id

    allocModel.update(bookId)
        .then(result => {
            if (!result) {
                return res.status(404).send({
                    message: "Allocation not found with id " + bookId
                });
            }
            res.send({ message: "Allocation deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Allocation not found with id " + bookId
                });
            }
            return res.status(500).send({
                message: "Could not delete allocation with id " + bookId
            });
        });
});

app.delete("/booking/:id", function (req, res) {
    res.send(req.params.id)
});



app.listen(3000, () => {
    console.log("el servidor está inicializado en el puesto 3000")
});
