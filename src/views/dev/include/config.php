<?php

if (!isset($_SESSION)) {
    session_start();
}

// Database configuration  
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'webilizerr');
define('DB_PASSWORD', 'webilizerr123');
define('DB_NAME', 'webilizerr');

// Stripe API configuration  
define('STRIPE_SECRET_KEY', 'sk_test_sWRVevQKMacfSiBdfxcRXuy4');
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_lhOKm1wn446p6upD0O9WfQqD');
define("default_currency", "usd");
define("currency", [
    "usd" => [
        "symbol" => "$",
    ],
]);

try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL Queries to create table
    $sql = "CREATE TABLE IF NOT EXISTS `users`(
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    $sql .= "CREATE TABLE IF NOT EXISTS `items`(
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,   
    `name` VARCHAR(255) NOT NULL,
    `price` FLOAT(10,2) NOT NULL,
    `currency` VARCHAR(100) NOT NULL,
    `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    $sql .= "CREATE TABLE IF NOT EXISTS `discounts`(
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,   
    `code` VARCHAR(255) NOT NULL,
    `amount` FLOAT(10,2) NOT NULL,
    `limit` INT(11) NOT NULL DEFAULT 0,
    `currency` VARCHAR(100) NOT NULL,
    `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    $sql .= "CREATE TABLE IF NOT EXISTS `cards` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` bigint(20) NOT NULL,
    `exp_month` VARCHAR(2) NOT NULL,
    `exp_year` VARCHAR(5) NOT NULL,
    `cvc` VARCHAR(4) NOT NULL,
    `status` ENUM('Verified', 'Unverified') NOT NULL DEFAULT 'Unverified',
    `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    $sql .= "CREATE TABLE IF NOT EXISTS `transactions`(
      `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      `user_id` INT(11) NOT NULL DEFAULT 0,
      `card_id` INT(11) NULL,
      `txn_id` VARCHAR(300) NOT NULL,
      `method` VARCHAR(50) NOT NULL,
      `amount` FLOAT(10,2) NOT NULL,
      `currency` VARCHAR(10) NOT NULL,
      `status` ENUM('Pending', 'Paid', 'Cancelled') NOT NULL DEFAULT 'Pending',
      `reference` LONGTEXT,
      `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    $sql .= "CREATE TABLE IF NOT EXISTS `orders`(
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,    
    `user_id` INT(11) NOT NULL DEFAULT 0,
    `item_id` INT(11) NOT NULL DEFAULT 0,
    `txn_id` VARCHAR(300) NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `domain_url` VARCHAR(100) NOT NULL,
    `backend_url` VARCHAR(100) NOT NULL,
    `backend_username` VARCHAR(100) NOT NULL,
    `backend_password` VARCHAR(100) NOT NULL,
    `notes` VARCHAR(100) NOT NULL,
    `item_price` FLOAT(10,2) NOT NULL,
    `quantity` INT(11) NOT NULL DEFAULT 0,
    `discount_id` INT(11) NOT NULL DEFAULT 0,
    `discount` VARCHAR(100) NOT NULL,
    `total` FLOAT(10,2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,
    `status` ENUM('Pending','Completed', 'Cancelled', 'Refunded') NOT NULL DEFAULT 'Pending',
    `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";

    // use exec() because no results are returned
    $conn->exec($sql);
} catch (PDOException $e) {
    exit(json_encode([
        "status" => false,
        "error" => $e->getMessage(),
        "query" => $sql,
    ]));
}

function csrf(string $name)
{
    $token = password_hash(time(), PASSWORD_DEFAULT);
    $_SESSION[$name] = $token;
    return $token;
}

function validate_csrf(string $name, string $token)
{
    if (isset($_SESSION[$name])) {
        if ($_SESSION[$name] == $token) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
