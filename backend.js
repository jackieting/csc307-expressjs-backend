const express = require('express');
const app = express();
const cors = require('cors');
const port = 5001;  // port 5000 not working
const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    if (name != undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id

    if (id == 'all-users' && users['users_list'].length != 0){ // step 7 - get all users
        res.send(users);
    } else {
        let result = findUserById(id);
        if (result === undefined || result.length == 0)
            res.status(404).send('Resource not found.');
        else {
            result = {users_list: result};
            res.send(result);
        }
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd); 
    // should it still be successful if the userToAdd is empty or missing a name or occupation??
    res.status(201).send(userToAdd).end();
});

function addUser(user){
    // make random ID
    user.id = idGenerator();
    users['users_list'].push(user);
}

function idGenerator(){
    var random_ID = "";
    var random_char = '';
    for (var i=0; i<6; i++){
        if (i < 3){ // first three chars in ID are letters (a-z)
            random_char = Math.floor(Math.random() * (26) + 97);
            random_ID += String.fromCharCode(random_char); 
        } else {    // last three chars n ID are digits (0-9)
            random_char = Math.floor(Math.random() * (10) + 48);
            random_ID += String.fromCharCode(random_char); 
        }
    }
    return random_ID;    // join arr of random chars to get ID
}

// DELETE

app.delete('/users/:id', (req, res) => {
    const id = req.params['id'];
    let result = findUserById(id);

    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        deleteUser(id);
        res.status(204).end();
        //res.send(users);
    }
});


function deleteUser(id) {
    for (var i=0; i<users['users_list'].length; i++){
        if (users['users_list'][i]['id'] == id){
            users['users_list'].splice(i, 1);
            break;
        }   
    }    // we know the user exists so we don't need to handle that
}


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      