var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;

    showItems();
})

function showItems() {
    console.log("\nDisplaying all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.table(res);
    })
}

