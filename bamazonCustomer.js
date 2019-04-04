//these are the required npm packages we will
//use throughout our program
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var chalk = require("chalk");

//make a connection to the database
var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

//when we connect
connection.connect(function(err) {
    if (err) throw err;

    //run the show items function
    showItems();
})

//show items function to render items in the database
function showItems() {
    console.log(chalk.cyan("\nDisplaying all products...\n"));
    //connect to the databse with a query to select all items
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //render the results in a formatted table
        console.table(res);
        //callback to our menu function
        menu();
    })

}


//menu function allows for choices and what the use would like to do
function menu() {
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;

        //inquirer asks for specific information
        inquirer
        .prompt([
            {
                // The first question should ask them the ID of the product they would like to buy
                name: "id",
                message: "Enter the ID number of the item you wish to buy.",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                // The second message should ask how many units of the product they would like to buy
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
        //then we want to use this information
        .then(function(answer){
            console.log("\n");
            //this is where we assign a variable to the item the user has chosen 
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.id)) {
                    chosenItem = results[i];
                }
            }

            //if the amoun the user wants is less than 
            //how much we have in stock, we can update our 
            //data in the database
            if (parseInt(answer.quantity) <= chosenItem.stock_quantity) {
                //the new quantity will be calculated
                var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
                //connect back to the database
                connection.query(
                    //what we want to update
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

                        //tell them it was a success and show how much spent
                        console.log("Purchase was " + chalk.green("successful!"));
                        var totalSpent = parseInt(answer.quantity) * parseInt(chosenItem.price)
                        console.log("You spent " + chalk.yellow("$" + totalSpent + "\n"));

                        //then we ask the user if they would like to make
                        //another purchsae or if they wish to exit
                        inquirer.prompt({
                            name: "continue",
                            type: "list",
                            message: "Would you like to [purchase] again or [exit]?",
                            choices: ["PURCHASE", "EXIT"]
                        }).then(function(answer){
                            //if they want to make another purchase, 
                            //take them  back to the show items 
                            if (answer.continue === "PURCHASE") {
                                showItems();
                            }
                            //otherwise end the connection 
                            else if(answer.continue === "EXIT") {
                                connection.end();
                            }
                        })
                        
                    }
                );
            }
            //otherwise we don't have enough so 
            //ask them to try again or they can leave if they'd like
            else {
                console.log(chalk.red("Insufficient Quantity!\n"));
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

