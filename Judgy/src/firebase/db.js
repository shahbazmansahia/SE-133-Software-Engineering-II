import { db } from './firebase';
import { auth } from './firebase';

// User API

// Creates a user in the database
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

// Grabs all users in the database?
export const onceGetUsers = () =>
  db.ref('users').once('value');

// Gets all the information on a single user
export const onceGetUser = (userId) =>
  db.ref('/users/' + userId).once('value');

// Gets all the information on a single user
  export const onceGetData = (data) =>
  db.ref('/users/' + data).once('value');

  // Takes competitionName, creator, competitorApplication array, and judgeApplication array
  // Stores the information in the database under competitions/compKey
  // Generates a judgekey and stores it in the competition as well
  // Stores creator and the 2 arrays
  //
  // Returns an array of 3 messages:
  // 1. Competition created successfully message
  // 2. Competitor invite link
  // 3. Judge invite link
  export function doCreateCompetition(competitionName, creator, competitorApplication, judgeApplication){
    var compKey = db.ref('/competitions/').push().key;
    db.ref('/users/' + creator + '/competitions/').push({
      compKey
    });
    var judgeKey = db.ref('/competitions/').push().key;
    db.ref('/competitions/' + compKey).set({
      competitionName,
      creator,
      competitorApplication,
      judgeApplication,
      judgeKey,
    });
    var ContInv = "https://alexmlen.github.io/Judgy/join?compKey=" + compKey + "#/join";
    var judgeInv = "https://alexmlen.github.io/Judgy/join?compKey=" + compKey + "&id=" + judgeKey + "#/join";
    var successMessage = 'You have successfully created ' + competitionName;
    var contInvite = 'To invite a contestant share this link: \n' + ContInv;
    var judgeInvite = 'To invite a judge share this link: \n' + judgeInv;
    var returnMsg = 'You have successfully created ' + competitionName + "\n\n" + contInvite + "\n\n" + judgeInvite;
    var returnArray = [];
    returnArray.push(successMessage);
    returnArray.push(contInvite);
    returnArray.push(judgeInvite);
    //alert('You have successfully created ' + competitionName + "\n\n" + contInvite + "\n\n" + judgeInvite);
    return returnArray;
  }

  // Does nothing as you should check a competitionkey by checking whether or
  // not a directory contains a judge key to be more efficient
  export function checkCompetitionKey(compKey){
    var rootRef = db.ref();
    var keyRef = rootRef.child("competitions/" + compKey);

  }

  // Inputs data into the database assuming the contestant's userID
  // is trying to join as a contestant
  export function joinCompetitionContestant(compKey, contestant){
    db.ref('/competitions/' + compKey + '/constestant/').push({
      contestant
    });
    db.ref('/users/' + contestant + '/competitions/').push({
      compKey
    });
  }

  // Grabs the arrays that contain the competitor application that they
  // should be filling out to join the competition
  //
  // Returns a promise object that must be fulfilled in the function being used
  // Promise object contains an array of the fields to be used
  export function getCompetitorApplication(compKey){
    var rootRef = db.ref();
    var keyRef = rootRef.child("competitions/" + compKey + "/competitorApplication")
    return keyRef.once("value", function(snapshot){});
  }

  // Joins a competition with the user being added as a judge
  export function joinCompetitionJudge(compKey, judge){
    db.ref('/competitions/' + compKey + '/judge/').push({
      judge
    });
    db.ref('/users/' + judge + '/competitions/').push({
      compKey
    });
  }

  // Grabs the competitionName located in the database under the compKey
  //
  // Returns a promise object that must be fulfilled in the function it is being used in
  // Promise object result contains the name of the competition
  export function getCompetitionName(compKey){
    var rootRef = db.ref();
    var keyRef = rootRef.child("competitions/" + compKey + "/competitionName");
    return keyRef.once("value", function(snapshot){});
  }

  // Checks the judge key with the one stored in the database
  //
  // Returns a promise object that must be fulfilled in the function it is being used in
  // Promise object result contains that competitions judgeKey
  export function checkJudgeKey(compKey, judgeKey){
    var rootRef = db.ref();
    var keyRef = rootRef.child("competitions/" + compKey + "/judgeKey");

    return keyRef.once("value", function(snapshot){});
  }

  // Gets the competitions that the user is partaking in
  //
  // Returns a promise object that must be fulfilled in the function it is being used in
  // Promise object result contains an array of competitionKeys
  export function getCompetitions(authID){
    var rootRef = db.ref();
    var keyRef = rootRef.child("users/" + authID + "/competitions");
    return keyRef.once("value", function(snapshot){});
  }
