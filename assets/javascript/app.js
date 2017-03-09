//configure Firebase
var config = {
    apiKey: "AIzaSyAauOhE7lMjaGCYGjXaQacFxcm6KPEpDdQ",
    authDomain: "trainschedule-80063.firebaseapp.com",
    databaseURL: "https://trainschedule-80063.firebaseio.com",
    storageBucket: "trainschedule-80063.appspot.com",
    messagingSenderId: "840875863240"
  };

    firebase.initializeApp(config);

    var dataRef = firebase.database();

// Initial Values

    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = 0;
    var user;
//authentication
    var provider = new firebase.auth.GoogleAuthProvider();
  
    $(document).ready(function() {
        $("#addTrain").hide();
    })

    function signIn() {
      console.log("clicked button")
      firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        showAddTrain();
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }

    function showAddTrain() {
      $("#logIn").hide();
      $("#addTrain").show();
    }


    function signOut() {
      firebase.auth().signOut().then(function() {
  // Sign-out successful.
      }, function(error) {
  // An error happened.
    });
    }


//Capture Button Click

    $("#submit").on("click", function(event) {
    	event.preventDefault();

    	trainName = $("#trainName").val().trim();
    	destination = $("#destination").val().trim();
    	trainTime = $("#trainTime").val().trim();
    	frequency = $("#frequency").val().trim();
    	
//calculate first Time pushed back 1 year
    	convertedTime = moment(trainTime, "HH:mm a").subtract(1, "years");
    	console.log(convertedTime);

    	var currentTime = moment();
    	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
    	var diffTime = moment().diff(moment(convertedTime), "minutes");
    	console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
    	var tRemainder = diffTime % frequency;
    	console.log(tRemainder);

// Minute Until Train
    	var tMinutesTillTrain = frequency - tRemainder;
    	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
    	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
    	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));


//Code for the push

   		dataRef.ref().push({

   			trainName: trainName,
   			destination: destination,
   			trainTime: trainTime,
   			frequency: frequency,
   			nextTrain: nextTrain,
   			minTillNextTrain: tMinutesTillTrain
   		});
    });

//Listen for when a new record is added

    dataRef.ref().on("child_added", function(snapshot) {

    	console.log(snapshot.val());
    	console.log(snapshot.val().trainName);
    	console.log(snapshot.val().destination);
    	console.log(snapshot.val().trainTime);
    	console.log(snapshot.val().frequency);
    	console.log(snapshot.val().nextTrain);
    	console.log(snapshot.val().minTillNextTrain);

//Pull values from firebase

	var listName = snapshot.val().trainName;
    var listDest = snapshot.val().destination;
    var listTime = snapshot.val().trainTime;
    var listFreq = snapshot.val().frequency;
    var listNext = snapshot.val().nextTrain;
    var listMin = snapshot.val().minTillNextTrain;


//write records to webpage

    $("#full-member-list").append(
      "<tbody><tr><td>" + listName + "</td>" + 
      "<td>" + listDest + "</td>" + 
      "<td>" + listFreq + "</td>" + 
      "<td>" + listNext + "</td>" + 
      "<td>" + listMin + "</td></tr></tbody>");

//Handle errors

    }, function(errorObject) {

      console.log("Errors handled: " + errorObject.code);

    });
