const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    run();
});

function run() {
    inquirer
        .prompt([{
            name: "options",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }])
        .then(function (answer) {
            switch (answer.options) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        })
}
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log('\n ID | Price | Quantity | Product Name');
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id}   |  ${res[i].price}  | ${res[i].stock_quantity}  |  ${res[i].product_name} `);
        }
        inquirer
            .prompt([{
                name: "next",
                type: "list",
                message: "\nWhat would you like to do?",
                choices: ["Main Menu", "Exit"]
            }])
            .then(function (answer) {
                switch (answer.next) {
                    case "Main Menu":
                        run();
                        break;

                    case "Exit":
                        connection.end();
                        break;
                }
            })
    })
};
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
        console.log('\n ID | Price | Quantity | Product Name');
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id}   |  ${res[i].price}  | ${res[i].stock_quantity}  |  ${res[i].product_name} `);
        }
        inquirer
            .prompt([{
                name: "next",
                type: "list",
                message: "\nWhat would you like to do?",
                choices: ["Main Menu", "Exit"]
            }])
            .then(function (answer) {
                switch (answer.next) {
                    case "Main Menu":
                        run();
                        break;

                    case "Exit":
                        connection.end();
                        break;
                }
            })
    })
}
function addInventory() {
    inquirer
        .prompt([{
            name: "product",
            type: "input",
            message: "What product would you like to add to? (Product ID)",
        }, {
            name: "quantity",
            type: "input",
            message: "How much to add?",
        }])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.product }, function (err, res) {
                var nQuantity = parseFloat(res[0].stock_quantity) + parseFloat(answer.quantity);
                if (parseFloat(res[0].stock_quantity) > parseFloat(answer.quantity)) {
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: nQuantity }, { item_id: answer.product }],
                        function (err, res) {
                            console.log('Succesfully updated!')
                            inquirer
                                .prompt([{
                                    name: "next",
                                    type: "list",
                                    message: "\nWhat would you like to do?",
                                    choices: ["Main Menu", "Exit"]
                                }])
                                .then(function (answer) {
                                    switch (answer.next) {
                                        case "Main Menu":
                                            run();
                                            break;

                                        case "Exit":
                                            connection.end();
                                            break;
                                    }
                                })
                        })
                }
            })
        })
}
function addProduct() {
    console.log('Add New Product')
    inquirer
        .prompt([{
            name: "product",
            type: "input",
            message: "Name of the Product?",
        },
        {
            name: "department",
            type: "input",
            message: "Name of the department?",
        },
        {
            name: "price",
            type: "input",
            message: "What is the price?",
        },
        {
            name: "quantity",
            type: "input",
            message: "Number in Stock?",
        }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.product,
                  department_name: answer.department,
                  price: answer.price,
                  stock_quantity: answer.quantity,
                },
                function(err, res) {
                  console.log("Product Added");
                  inquirer
                                .prompt([{
                                    name: "next",
                                    type: "list",
                                    message: "\nWhat would you like to do?",
                                    choices: ["Main Menu", "Exit"]
                                }])
                                .then(function (answer) {
                                    switch (answer.next) {
                                        case "Main Menu":
                                            run();
                                            break;

                                        case "Exit":
                                            connection.end();
                                            break;
                                    }
                                })
                }
        )})
}