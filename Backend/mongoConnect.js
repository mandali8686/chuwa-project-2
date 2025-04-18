const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://training:shangan@fullstack-training.gw3nkbl.mongodb.net/demoDec?retryWrites=true&w=majority',{
    useNewUrlParse: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('Connected to MongoDB')})
.catch((e)=>{console.log('Error connecting to MongoDB', e)});

module.exports = mongoose;