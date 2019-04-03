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

    menu();

})

function menu(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "Hello, what would you like to do?",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(answer){
        if (answer.choice === "View Products") {
            // viewProducts();
        }
        else if (answer.choice === "View Low Inventory") {
            // viewLowInventory();
        }
        else if (answer.choice === "Add to Inventory") {
            // addToInventory();
        }
        else if (answer.choice === "Add New Product") {
            // addNewProduct();
        }
        else if (answer.choice === "Exit") {
            connection.end();
        }
    })

}