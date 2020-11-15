const mongoose = require('mongoose');
const uri = "mongodb+srv://Oleg:qwerty1234@cluster0.t6xiq.mongodb.net/db?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})

// async function start() {
//     try {
//         await mongoose.connect('mongodb+srv://Oleg:qwerty1234@cluster0.t6xiq.mongodb.net/db?retryWrites=true&w=majority')
//     }
// }