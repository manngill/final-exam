document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("insert").addEventListener("click",  heroes inserted);
document.getElementById("show").addEventListener("click", show heroes);
document.getElementById("rescue").addEventListener("click", rescue me);

var db = null;


function connectToDatabase() {
  console.log("device is ready - connecting to database");

  if (window.cordova.platformId === 'browser') {
    console.log("browser detected...");

    db = window.openDatabase("superdb", "1.0", "Database for superdb app", 5*1024*1024);
  }
  else {
    alert("mobile device detected");
    console.log("mobile device detected!");

    var databaseDetails = {"name":"superdb.db", "location":"default"}
    db = window.sqlitePlugin.openDatabase(databaseDetails);
    console.log("done opening db");
  }

  if (!db) {
    alert("databse not opened!");
    return false;
  }

  db.transaction(
    function(tx){

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Columns (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, isAvailable INTEGER)",
        [],
        onSuccessExecuteSql,
        onError
      )
    },
    onError,
    onReadyTransaction
  );


}

function insertHeroes() {

  console.log("Heroes is inserted!");
  alert("insert button pressed!");

  var i = document.getElementById("idBox").value;
  var n = document.getElementById("nameBox").value;
    var a = document.getElementById("availableBox").value;

  console.log("id: " + i);
  console.log("name: " + n);
    console.log("isAvailable " + a);

  db.transaction(
        function(tx){
            tx.executeSql( "INSERT INTO Columns(id, name, isAvailable) VALUES(?,?,?)",
            [i,n,a],
            onSuccessExecuteSql,
            onError )
        },
        onError,
        onReadyTransaction
    )


}

function showHeroes() {

  console.log("show button pressed!");
  alert("show button pressed!");

  db.transaction(
        function(tx){
            tx.executeSql( "SELECT * FROM Columns",
            [],
            displayResults,
            onError )
        },
        onError,
        onReadyTransaction
    )
}

function displayResults( tx, results ){

    if(results.rows.length == 0) {
            alert("No records found");
            return false;
        }

        var row = "";
        for(var i=0; i<results.rows.length; i++) {
      document.getElementById("resultsSection").innerHTML +=
          "<p> ID: "
        +   results.rows.item(i).id
        + "<br>"
        + "Name: "
        +   results.rows.item(i).name
        +"<br>"
        + "isAvailable "
          +   results.rows.item(i).isAvailable
        + "</p>";

        }

    }

function onReadyTransaction( ){
  console.log( 'Transaction completed' )
}
function onSuccessExecuteSql( tx, results ){
  console.log( 'Execute SQL completed' )
}
function onError( err ){
  console.log( err )
}
