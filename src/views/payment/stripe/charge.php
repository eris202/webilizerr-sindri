<?php
require '../../include/config.php';
// Include PHP library 
require_once '../../include/vendor/autoload.php';

if (!isset($_SESSION)) {
    session_start();
}

if (!isset($_SESSION['item'])) {
    header("location: ../../appointment.php");
    exit;
}

if (
    !empty($_POST['stripeToken']) &&
    !empty($_POST['card_number']) &&
    !empty($_POST['token']) &&
    !empty($_POST['card_exp_month']) &&
    !empty($_POST['card_exp_year']) &&
    !empty($_POST['card_cvc'])
) {

    if (!validate_csrf("checkout", $_POST['token'])) {
        header("location: ../../checkout.php");
        exit;
    }

    $item_name = $_SESSION['item']['name'];
    $item_price = $_SESSION['item']['price'];
    $currency = $_SESSION['item']['currency'];

    $discount = 0;

    if (isset($_SESSION['discount']['amount'])) {
        $discount = $_SESSION['discount']['amount'];
    }

    // Retrieve stripe token, card and user info from the submitted form data 
    $token  = $_POST['stripeToken'];
    $email = $_SESSION['order']['email'];
    $card_number = $_POST['card_number'];
    $card_exp_month = $_POST['card_exp_month'];
    $card_exp_year = $_POST['card_exp_year'];
    $card_cvc = $_POST['card_cvc'];

    try {
        $cards = $conn->prepare("SELECT * FROM `cards` WHERE `number`=?");
        $cards->bindParam(1, $_POST['card_number'], PDO::PARAM_INT);
        $cards->execute();
        $row = $cards->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            $sql = "INSERT INTO `cards` (`number`, `exp_month`, `exp_year`, `cvc`) VALUES ('" . $card_number . "', '" . $card_exp_month . "', '" . $card_exp_year . "', '" . $card_cvc . "')";
            $insert = $conn->query($sql);
            $card_id = $conn->lastInsertId();
        } else {
            $card_id = $row['id'];
        }

        try {
            // Set API key 
            \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

            // Add customer to stripe 
            $customer = \Stripe\Customer::create(array(
                'email' => $email,
                'source'  => $token
            ));

            $item_price = $item_price - $discount;
            $item_price = ($item_price * 100);

            // Charge a credit or a debit card 
            $charge = \Stripe\Charge::create(array(
                'customer' => $customer->id,
                'amount'   => $item_price,
                'currency' => $currency,
                'description' => $item_name,
                'metadata' => $_SESSION['order'],
            ));
        } catch (\Stripe\Exception\CardException $e) {
            // Since it's a decline, \Stripe\Exception\CardException will be caught
            header("location: ../../checkout.php");
            exit;
        } catch (\Stripe\Exception\RateLimitException $e) {
            // Too many requests made to the API too quickly
            header("location: ../../checkout.php");
            exit;
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Invalid parameters were supplied to Stripe's API
            header("location: ../../checkout.php");
            exit;
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            header("location: ../../checkout.php");
            exit;
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network communication with Stripe failed
            header("location: ../../checkout.php");
            exit;
        } catch (\Stripe\Exception\ApiErrorException $e) {
            header("location: ../../checkout.php");
            exit;
        }
    } catch (PDOException $e) {
        header("location: ../../checkout.php");
        exit;
    }

    $method = "stripe";
    $user_id = $_SESSION['order']['user_id'];
    $item_id = $_SESSION['item']['id'];
    if (!empty($_SESSION['discount']['id'])) {
        $discount_id = $_SESSION['discount']['id'];
    } else {
        $discount_id = 0;
    }
    $domain_url = $_SESSION['order']['domain_url'];
    $backend_url = $_SESSION['order']['backend_url'];
    $backend_username = $_SESSION['order']['username'];
    $backend_password = $_SESSION['order']['password'];
    $notes = $_SESSION['order']['notes'];
    $quantity = 1;
    $total = $charge->amount / 100;
    $txn_id = $charge->id;
    $status = $charge->status;
    if ($status == 'succeeded') {
        $status = 'Completed';

        try {
            $sql = "INSERT INTO `transactions` (
                `user_id`, 
                `card_id`, 
                `txn_id`,
                `method`,
                `amount`,
                `currency`,
                `status`
                ) VALUES (
                '" . $user_id . "',
                '" . $card_id . "',
                '" . $txn_id . "',
                '" . $method . "',
                '" . $total . "',
                '" . $currency . "',
                'Paid'
                )";
            $insert = $conn->query($sql);
            $transaction_id = $conn->lastInsertId();

            $sql = "INSERT INTO `orders` (
                `user_id`, 
                `item_id` , 
                `txn_id`, 
                `item_name`,
                `domain_url`,
                `backend_url`,
                `backend_username`,
                `backend_password`,
                `notes`,
                `item_price`,
                `quantity`,
                `discount_id`,
                `discount`,
                `total`,
                `currency`,
                `status`) 
                VALUES (
                '" . $user_id . "',
                '" . $item_id . "',
                '" . $transaction_id . "',
                '" . $item_name . "',
                '" . $domain_url . "',
                '" . $backend_url . "',
                '" . $backend_username . "',
                '" . $backend_password . "',
                '" . $notes . "',
                '" . ($item_price / 100) . "',
                '" . $quantity . "',
                '" . $discount_id . "',
                '" . $discount . "',
                '" . $total . "',
                '" . $currency . "',
                '" . $status . "'
                )";
            $insert = $conn->query($sql);
            $order_id = $conn->lastInsertId();

            $sql = "UPDATE `transactions` SET `reference` = $order_id WHERE `id` = $transaction_id;";
            $update = $conn->query($sql);

            $sql = "UPDATE `cards` SET `status` = 'Verified' WHERE `id` = $card_id;";
            $update = $conn->query($sql);

            include("mail.php");

            unset($_SESSION['order']);
            unset($_SESSION['item']);
            unset($_SESSION['discount']);

            header("location: ../../thank-you.html");
            exit;
        } catch (PDOException $e) {
            exit("Error Occured While Storing Your Data! Please Report Us With Transaction ID: " . $txn_id . " As Soon As Possible!");
        }
    } else {
        header("location: ../../checkout.php");
        exit;
    }
} else {
    header("location: ../../checkout.php");
    exit;
}
