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
    connection.query("SELECT * FROM products", function(err, results){
        co
        if (err) throw err;

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
                message: "How many would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer){
            console.log("\n");
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.id)) {
                    chosenItem = results[i];
                }
            }

            if (parseInt(answer.quantity) < chosenItem.stock_quantity) {
                newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function(error) {
                        if (error) throw error;
                        console.log("Purchase was successful!");
                        var totalSpent = parseInt(answer.quantity) * parseInt(chosenItem.price)
                        console.log("You spent $" + totalSpent + "\n");
                        inquirer.prompt({
                            name: "continue",
                            type: "list",
                            message: "Would you like to [purchase] again or [exit]?",
                            choices: ["PURCHASE", "EXIT"]
                        }).then(function(answer){
                            if (answer.continue === "PURCHASE") {
                                showItems();
                            }
                            else if(answer.continue === "EXIT") {
                                connection.end();
                            }
                        })
                        
                    }
                );
            }
            else {
                console.log("Insufficient Quantity!\n");
                inquirer.prompt({
                    name: "continue",
                    type: "list",
                    message: "Would you like to try to [purchase] again or [exit]?",
                    choices: ["PURCHASE", "EXIT"]
                }).then(function(answer){
                    if (answer.continue === "PURCHASE") {
                        showItems();
                    }
                    else if(answer.continue === "EXIT") {
                        connection.end();
                    }
                })
            }
        });
    });
}  

