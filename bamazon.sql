DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price INT DEFAULT 0,
	stock_quantity INT DEFAULT 0,
	PRIMARY KEY (id)
	
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("SUPREME SWEATER", "Fashion", 100, 7),("OFF WHITE x NIKE Jordan 1", "Fashion", 1000, 5),
("Adidas Originals Joggers", "Fashion", 80, 20),("Yamaha Xeno Bb Trumpet", "Instruments", 1000, 9),
("Palace Sweater", "Fashion", 100, 11),("SUPREME x Nalgene Water Bottle", "Utilities", 70, 4),
("2018 MacBook Pro", "Utilities", 1500, 6),("Apple Watch 4th Gen", "Utilities", 500, 13),
("Airpods", "Utilities", 250, 200),("Quip Toothbrush", "Utilities", 10, 200);