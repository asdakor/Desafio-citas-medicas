import axios from 'axios';
import chalk from 'chalk';
import _ from 'lodash';
import express from 'express';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { engine } from 'express-handlebars';
import path from 'path';

const __dirname = import.meta.dirname;
const app = express()
app.use(express.static(path.join(__dirname, '/public')));
const users = []


app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'./views'));


app.get('/', async(req, res) => {
    
    const response = await axios.get('https://randomuser.me/api/')
    
    const gender = response.data.results[0].gender
    const name = response.data.results[0].name.first
    const apellido = response.data.results[0].name.last

    const user = {
        id: nanoid(),
        gender,
        name,
        apellido,
        timestamp: moment().format('LLL')
    }
    users.push(user)

    const newUsers = _.partition(users, (item) => item.gender === 'male')
    console.log(chalk.blue.bgWhite(JSON.stringify(newUsers)))
    res.render('home', {
        male: newUsers[0],
        female: newUsers[1]
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor se inicio en http://localhost:${PORT}`)
})