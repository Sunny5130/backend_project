const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
require('dotenv').config();

const app = express();
const port = 3002;

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

const mongoURI=process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB')).catch(err => console.error('Error connecting to MongoDB:',err));

//Define User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwrod: String
});

const User = mongoose.model('User',userSchema);

app.get('/users',(req,res) => {
    User.find({}).then(users =>res.json(users)).catch(err => res.status(500).json({
        message: err.message }));
});

app.post('/users',(req,res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwrod: req.body.passwrod
    });

    user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).json({message: err.message}));
});

app.put('/users/:id',(req,res) =>{
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        passwrod: req.body.password
    };

    User.findByIdAndUpdate(userId,updateData,{new: true})
        .then(updatedUser =>{
            if(!updatedUser){
                return res.status(404).json({ message: 'User not found'});
            }
            res.json(updatedUser);
        })
        .catch(err => res.status(400).json({message: err.message}));
});

app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;

    User.findByIdAndDelete(userId)
    .then(deletedUser=>{
        if(!deletedUser){
            return res.status(400).json({message:'User not found'});
        }
        res.json({message:'User deleted successfully'});
    })
    .catch(err=>res.status(400).json({message:err.message}));
});

app.listen(3002,()=>{
    console.log("server running in 3002 port no.")
});