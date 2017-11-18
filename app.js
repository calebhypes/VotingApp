const   express         = require('express'),
        mongoose        = require('mongoose'),
        app             = express();

require('dotenv').config();
mongoose.connect('mongodb://localhost/voting', {useMongoClient: true});
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('This is a test');
});

app.listen(3000, () =>  {
    console.log('Voting server is running...');
});