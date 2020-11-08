const mongoose = require('mongoose');

const UserSchema = require.main.require('../models/user');

mongoose.connect('mongodb+srv://dbUser:Notagoodpass@cluster0.hihth.mongodb.net/twitter?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () =>{
    mongoose.model('User', UserSchema);
});