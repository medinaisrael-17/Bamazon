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
        menu();
    })

}

function menu() {
    inquirer
    .prompt([
        {
            // * The first should ask them the ID of the product they would like to buy
            name: "id",
            message: "Enter the ID number of the item you wish to buy",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            // * The second message should ask how many units of the product they would like to buy
            name: "quantity",
            message: "How many units do you want of that item?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer){
        var chosenItem;
    })
}

