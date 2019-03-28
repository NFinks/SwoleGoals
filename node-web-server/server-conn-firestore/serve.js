//
// // set up the firestore
// const admin = require('firebase-admin');
//
// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });
//
// const db = admin.firestore();

 const admin = require('firebase-admin');

var serviceAccount = require('./swolegoalsFirestore-601575c95ed8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

// set up the router
const express = require('express');

var app = express();

var bodyparser = require('body-parser');
var cors = require('cors');//cors is used to allow cross platform services
app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send("Hello from Firestore!");
  });

app.post('/addUser', bodyparser.json(), (req, res) => {
    console.log(req.body);
    //res.json(req.body);
    const userRef = db.collection('users').doc(req.body.email);
    userRef.get().then((docSnapshot) => {
        if (docSnapshot.exists){
            console.log('document already exists');
            res.json(docSnapshot.data());
        }else{
            userRef.set({
                name: req.body.name,
                email: req.body.email,
                age: 0,
                height: 0,
                weight: 0,
                friends: [],
                groups: []
            }).then(() => {
                console.log('save successfully!');
            }).catch((err) => {
                console.log('get an error:', err);
            });
        }
    });
});

app.post('/addChallenge', bodyparser.json(), (req, res) => {
    console.log(req.body);
    const challengeRef = db.collection('Challenges').doc(req.body.exercises);
    challengeRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
            console.log('challenge already exists');
            res.json(docSnapshot.data());
        }else{
            challengeRef.set({
                exercises: req.body.exercises,
                reps: req.body.reps
            }).then(() => {
                console.log('save successfully!');
            }).then(() => {
                challengeRef.get().then((docSnapshot) => {
                    res.json(docSnapshot.data());
                });
            }).catch((err) => {
                console.log('get an error:', err);
            });
        }

    });

});


//findUser info

// app.post('/findUser', bodyparser.json(), (req, res) => {
//     console.log(req.body);
//     res.json(req.body);
//     const userRef = db.collection('users').doc(req.body.email);
//     userRef.get().then((docSnapshot) => {
//         if (docSnapshot.exists){
//             res.send('documents exists');
//         }else{
//             res.send('documents not exists');
//         }
//     });
// });

// set up the listening port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
