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

connection.connect(function (err) {
    if (err) throw err;

    menu();

})

function menu() {
    console.log("\n");
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "Hello, what would you like to do?",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (answer) {
        if (answer.choice === "View Products") {
            viewProducts();
        }
        else if (answer.choice === "View Low Inventory") {
            viewLowInventory();
        }
        else if (answer.choice === "Add to Inventory") {
            addToInventory();
        }
        else if (answer.choice === "Add New Product") {
            addNewProduct();
        }
        else if (answer.choice === "Exit") {
            connection.end();
        }
    })

}

function viewProducts() {
    console.log("\nDisplaying all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.table(res);
        menu();
    })
}

function viewLowInventory() {
    console.log("\nDisplaying low inventory...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        console.table(res);
        menu();
    })

}

function addToInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "id",
                message: "Enter the ID number of the item you wish to add to.",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                message: "How many units would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (answer) {
                console.log("\n");
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === parseInt(answer.id)) {
                        chosenItem = results[i];
                    }
                }

                var newQuantity = chosenItem.stock_quantity + parseInt(answer.quantity);
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
                    function (error) {
                        if (error) throw error;
                        console.log("Successfully updated the inventory!");
                        console.log("You added " + parseInt(answer.quantity) + " units to " +
                            chosenItem.product_name + "\n");

                        menu();
                    }
                )
            })
    })

}

function addNewProduct() {
    console.log("\nInserting a new product...\n")

    inquirer.prompt([
        {
            name: "product_name",
            message: "What is the products name?",
        },
        {
            name: "department_name",
            message: "What department will it be in?"
        },
        {
            name: "price",
            message: "How much does it cost?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "stock_quantity",
            message: "How many units do you have of this item?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        console.log("\n");

        console.log("Adding " + answer.product_name + " to the database\n");

        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            },
            function(err, res){
                if (err) throw err;

                console.log(res.affectedRows + " product inserted!\n");
                menu();

            }
        )
    })

}