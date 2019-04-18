
// // set up the firestore
// const admin = require('firebase-admin');

// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });

// const db = admin.firestore();
// // ...
const admin = require('firebase-admin');
const fs = require('fs');
const {Storage} = require('@google-cloud/storage');

const private_key = `./swolegoalsfirestore-4ad9a0ac617c.json`;
if(!fs.existsSync(private_key)){
  const projectId = 'swolegoalsFirestore';
  const storage = new Storage({
    projectId: projectId,
  });
  const bucketName = 'sg-storage';
  storage
    .bucket(bucketName)
    .file(private_key)
    .download({ destination: private_key })
    .then(() => {
      console.info('Private key downloaded successfully')
    })
    .catch(e => {
      console.error(`serve.js: There was an error: ${JSON.stringify(e, undefined, 2)}`)
    })
}

var serviceAccount = require(private_key);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

var docRef = db.collection('users').doc('Kaibo');

var setAda = docRef.set({
  name: 'Kaibo',
  age: '25',
  height: 175,
  weight: 120,
  friends: ['user1', 'user2', 'user3']
});

//console.log(setAda);


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

app.post('/getChallengeExerciseList', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const userRef = db.collection('Challenges').doc(req.body.challengeName);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      console.log('Returned Challenge Exercise List');
      res.json(docSnapshot.data());
    } 
  });
});

app.post('/getGroupUsers', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const userRef = db.collection('groups').doc(req.body.groupName);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      console.log('Returned Group Users');
      res.json(docSnapshot.data());
    } 
  });
});

app.post('/updateChallengeResults', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const resRef = db.collection('Results').doc(req.body.groupName);
  resRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      console.log('document already exists');
      res.json(docSnapshot.data());
      var arrOfResultObj = [];
      var arrOfUserObj = [];

      var idx = 0;
      var numUsers = req.body.groupUsers.length;
      for (let i=0; i<req.body.exerciseList.length;i++) {
        var arrOfUserObj = [];
        for (let k=0; k<numUsers;k++) {
          var userObj = {
            userEmail: req.body.userResultArr[k + idx],
          }
          arrOfUserObj.push(userObj);
        }
        idx=idx+3;

        var resultObj = {
          exerciseName: req.body.exerciseList[i],
          userObj: arrOfUserObj
        };
        arrOfResultObj.push(resultObj);
      }

      var docData = {
        groupID: req.body.groupName,
        challengeName: req.body.challengeName,
        resultList: arrOfResultObj,
      };

      resRef.set({
        docData
      }).then(() => {
        console.log('Created challengeResult successfully!');
      }).then(() => resRef.get().then((docSnapshot) => {
        res.json(docSnapshot.data())
      })).catch((err) => {
        console.log('get an error:', err);
      });
    } else {
      var arrOfResultObj = [];
      var arrOfUserObj = [];

      var resultObj = {
        exerciseName: 'exerciseName',
        userObj: []
      };
      var userObj = {
        userEmail: 'fakeemail@gmail.com',
        result: -1
      }
      for (let k=0; k<req.body.groupUsers.length;k++) {
        var userObj = {
          userEmail: req.body.groupUsers[k],
        }
        arrOfUserObj.push(userObj);
      }
      for (let i=0; i<req.body.exerciseList.length;i++) {
        var exName = req.body.exerciseList[i];
        var resultObj = {
          exerciseName: req.body.exerciseList[i],
          userObj: arrOfUserObj
        };
        arrOfResultObj.push(resultObj);
      }
      var docData = {
        groupID: req.body.groupName,
        challengeName: req.body.challengeName,
        resultList: arrOfResultObj,
      };

      resRef.set({
        docData
      }).then(() => {
        console.log('Created challengeResult successfully!');
      }).then(() => resRef.get().then((docSnapshot) => {
        res.json(docSnapshot.data())
      })).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
});

app.post('/addUser', bodyparser.json(), (req, res) => {
  console.log(req.body);
  //res.json(req.body);
  const userRef = db.collection('users').doc(req.body.email);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      console.log('document already exists');
      res.json(docSnapshot.data());
    } else {
      userRef.set({
        name: req.body.name,
        email: req.body.email,
        age: 0,
        height: 0,
        weight: 0,
        friends: [],
        groupID: null
      }).then(() => {
        console.log('Added user successfully!');
      }).then(() => userRef.get().then((docSnapshot) => {
        res.json(docSnapshot.data())
      })).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
});

app.post('/addFriendToGroup', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const groupRef = db.collection('groups').doc(req.body.groupName);
  groupRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      groupRef.update({
        users: admin.firestore.FieldValue.arrayUnion(req.body.userEmail)
      }) 
      console.log('Group already exists');
    } else {
      groupRef.set({
        name: req.body.groupName,
        users: req.body.userEmail
      }).then(() => {
        console.log('Created Group!');
      }).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
  const userRef = db.collection('users').doc(req.body.userEmail);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      userRef.update({
        groupID: req.body.groupName
      }).then(() => {
        console.log('Added User to Group!');
      }).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
});

app.post('/removeFriendFromGroup', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const groupRef = db.collection('groups').doc(req.body.groupName);
  groupRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      groupRef.update({
        users: admin.firestore.FieldValue.arrayRemove(req.body.userEmail)
      })
      console.log('Group already exists');
    } else {
      console.log('Group does not exist to delete from.')
    }
  });
  const userRef = db.collection('users').doc(req.body.userEmail);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      userRef.update({
        groupID: admin.firestore.FieldPath.arrayRemove(req.body.groupName)
      }).then(() => {
        console.log('Added User to Group!');
      }).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
});

app.post('/updateInfo', bodyparser.json(), (req, res) => {
  console.log(req.body);
  const userRef = db.collection('users').doc(req.body.userEmail);
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      userRef.update({
        age: req.body.userAge,
        height: req.body.userHeight,
        weight: req.body.userWeight
      }).then(() => {
        console.log('Updated user info!');
      }).catch((err) => {
        console.log('get an error:', err);
      });
    }
  });
});

app.post('/addChallenge', bodyparser.json(), (req, res) => {
    console.log(req.body);
    const challengeRef = db.collection('Challenges').doc(String(req.body));
    challengeRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
            console.log('challenge already exists');
            res.json(docSnapshot.data());
        }else {
            challengeRef.set({
                exercises: "1",
                reps: "2"
            });
            for (let i = 0; i < req.body[0].length; i++) {
                challengeRef.update({
                    exercises: admin.firestore.FieldValue.arrayUnion(req.body[0][i]),
                    reps: admin.firestore.FieldValue.arrayUnion(req.body[1][i])
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
  const PORT = process.env.PORT || 4202;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
