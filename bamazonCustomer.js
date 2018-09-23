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
    connection.query("SELECT * FROM products", function (err, res) {
        console.log(`ID  | Price | Product Name`)
        console.log('--------------------------')
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id}   |  ${parseInt(res[i].price)}  |  ${res[i].product_name}`);
        }
        inquirer
            .prompt([{
                name: "product",
                type: "input",
                message: "\nWhat product would you like to order? (Input product ID.)",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to order?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
            .then(function (answer) {
                connection.query("SELECT * FROM products WHERE ?", { item_id: answer.product }, function (err, res) {
                    var cost = parseFloat(answer.quantity) * parseFloat(res[0].price)
                    var nQuantity = parseFloat(res[0].stock_quantity) - parseFloat(answer.quantity);
                    if (parseFloat(res[0].stock_quantity) > parseFloat(answer.quantity)) {
                        connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: nQuantity }, { item_id: answer.product }],
                            function (err, res) {
                            });
                        console.log(`
Order Placed 
Your total is: ${cost}
`)
                        connection.end()
                    } else {
                        console.log('Insufficient quantity!')
                        connection.end();
                    }
                })
            });
    })
}