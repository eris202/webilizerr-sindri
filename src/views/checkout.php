<?php
if (!isset($_SESSION)) {
    session_start();
}

require 'include/config.php';

if (!isset($_SESSION['order'])) {
    header('location: appointment.php');
    exit;
}
$error = "";

try {

    $get_item = $conn->prepare("SELECT * FROM `items` WHERE `id` = 1");
    $get_item->execute();
    $result = $get_item->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $_SESSION['item']['id'] = $result['id'];
        $_SESSION['item']['name'] = $result['name'];
        $_SESSION['item']['price'] = $result['price'];
        $_SESSION['item']['currency'] = $result['currency'];
    } else {
        $error = "An Error Has Been Occured!";
    }

    if (isset($_SESSION['item'])) {
        $item_name = $_SESSION['item']['name'];
        $item_price = $_SESSION['item']['price'];
        $currency = $_SESSION['item']['currency'];

        $subtotal = $item_price;
        $discount = 0;
        $discount_error = "";

        if (isset($_POST['code'])) {
            $stmt = $conn->prepare('SELECT * FROM `discounts` WHERE `code`=?');
            $stmt->execute([$_POST['code']]);
            $exists = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($exists) {
                if ($exists['limit'] <= 0) {
                    $_SESSION['discount'] = $exists;
                } else {
                    $count_row = $conn->prepare('SELECT count(*) AS `num` FROM `orders` WHERE `discount_id` = ?');
                    $count_row->execute(array($exists['id']));
                    $row = $count_row->fetch(PDO::FETCH_ASSOC);
                    if ($row) {
                        if ($row['num'] >= $exists['limit']) {
                            $discount_error = '<p class="text-danger mt-1">Discount Code Has Been Expired!</p>';
                        } else {
                            $_SESSION['discount'] = $exists;
                        }
                    } else {
                        $_SESSION['discount'] = $exists;
                    }
                }
            } else {
                $discount_error = '<p class="text-danger mt-1">Discount code is invalid!</p>';
            }
            if (!empty($_SESSION['discount'])) {
                $discount = $_SESSION['discount']['amount'];
            }
        } elseif (isset($_POST['clear_discount'])) {
            unset($_SESSION['discount']);
        }
        if (isset($_SESSION['discount'])) {
            $discount = round($_SESSION['discount']['amount'], 2);
        }
    } else {
        $error = "An Error Has Been Occured!";
    }
} catch (PDOException $e) {
    $error = "An Error Has Been Occured!";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Webilizerr | Checkout</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta property="og:title" content="Template Monster Admin Template">
    <meta property="og:description" content="brevis, barbatus clabulares aliquando convertam de dexter, peritus capio. devatio clemens habitio est.">
    <meta property="og:image" content="http://digipunk.netii.net/images/radar.gif">
    <meta property="og:url" content="http://digipunk.netii.net">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="components/base/base.css">
    <link rel="stylesheet" href="components/main.css">
    <script src="components/base/core.js"></script>
    <script src="components/base/script.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <!-- <script type="text/javascript" src="https://www.websiteauditserver.com/js/embed/widget-2.2.js"></script> -->
    <script src="https://js.stripe.com/v2/"></script>
</head>

<body>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="row" style="height: 100vh;">
                    <div class="col-lg-6 col-md-12 mt-5 px-3 px-md-5">
                        <img src="images/logos/webilizerr_logo.png" width="150px" alt="Logo">
                        <h4 class="text-muted mt-4">Checkout</h4>
                        <p class="text-danger"><?= $error; ?></p>
                        <div class="row">
                            <div class="col-md-2 my-auto">
                                <button class="btn btn-circle btn-xl bg-white epic-shadow mb-3" onclick="window.history.go(-1);return false;"><img src="images/arrow-forward.svg" style="transform: rotate(180deg);" alt="Arrow"></button>
                            </div>
                            <div class="col-md-10 my-auto">
                                <p class="small"><?= $item_name; ?></p>
                            </div>
                        </div>
                        <div class="card card-body border-0 epic-shadow mt-4" style="border-radius: 10px;">
                            <div class="row p-4">
                                <div class="col-6 my-auto py-2">
                                    <p>Total</p>
                                </div>
                                <div class="col-6 my-auto py-2 text-right">
                                    <p><?= currency["usd"]["symbol"]; ?><?= $item_price; ?></p>
                                </div>
                                <div class="col-6 my-auto py-2">
                                    <p>Discount</p>
                                </div>
                                <div class="col-6 my-auto py-2 text-right">
                                    <p><?= currency["usd"]["symbol"]; ?><?= $discount ?></p>
                                </div>
                                <div class="col-6 my-auto py-2">
                                    <p>SubTotal</p>
                                </div>
                                <div class="col-6 my-auto py-2 text-right">
                                    <p><?= currency["usd"]["symbol"]; ?><?= ($item_price - $discount); ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 shadow px-3 px-md-5">
                        <div class="card card-body border-0 mt-5">
                            <h5 class="text-muted">Checkout Details</h5>
                            <?php if (!isset($_SESSION['discount'])) { ?>
                                <form action="checkout.php" method="POST">
                                    <div class="form-group mt-3 px-2 px-md-4">
                                        <label for="code">Have a Coupon?</label>
                                        <input type="text" id="code" name="code" class="form-control border-0 epic-shadow" style="height:2.7rem;">
                                        <?= $discount_error; ?>
                                        <button class="btn btn-primary btn-sm mt-3" type="submit">Apply</button>
                                    </div>
                                </form>
                            <?php } else { ?>
                                <form method="POST" class="mt-3 px-2 px-md-4">
                                    <p class="text-success mt-1">Discount code has been applied!</p>
                                    <input type="hidden" name="clear_discount" />
                                    <button type="submit" class="btn btn-primary btn-sm mt-3">Clear</button>
                                </form>
                            <?php } ?>
                            <form onsubmit="return false;" method="POST" action="payment/stripe/charge.php" class="px-2 px-md-4" id="payment_form">
                                <div class="form-group">
                                    <label for="card_number">Card Number</label>
                                    <input type="number" name="card_number" id="card_number" class="form-control border-0 epic-shadow" style="height:2.7rem;">
                                    <input type="hidden" name="token" value="<?= csrf("checkout"); ?>" />
                                    <p class="small text-muted my-1">Type your credit card number</p>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-4">
                                        <label for="card_exp_month">Month</label>
                                        <select name="card_exp_month" id="card_exp_month" class="form-control border-0 epic-shadow p-0" style="height:2.7rem;text-indent:10px;">
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>
                                    <div class="form-group mt-0 col-4">
                                        <label for="card_exp_year">Year</label>
                                        <select name="card_exp_year" id="card_exp_year" class="form-control border-0 epic-shadow p-0" style="height:2.7rem;text-indent:10px;">
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                            <option value="2030">2030</option>
                                        </select>
                                    </div>
                                    <div class="form-group mt-0 col-4">
                                        <label for="card_cvc">CVC</label>
                                        <input type="number" name="card_cvc" id="card_cvc" class="form-control border-0 epic-shadow" style="height:2.9rem;">
                                    </div>
                                </div>
                                <div class="form-group text-right my-5">
                                    <button class="btn btn-primary" type="submit" id="pay">Checkout</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        Stripe.setPublishableKey('<?php echo STRIPE_PUBLISHABLE_KEY; ?>');
        // var stripe = Stripe('<?php echo STRIPE_PUBLISHABLE_KEY; ?>');

        // Callback to handle the response from stripe
        function stripeResponseHandler(status, response) {
            if (response.error) {
                // Enable the submit button
                $('#paybtn').removeAttr("disabled");
                // Display the errors on the form
                alert(response.error.message);
                // $("#error_message").html('<p>'+response.error.message+'</p>');
            } else {
                var form = $("#payment_form");
                // Get token id
                var token = response.id;
                // Insert the token into the form
                form.append("<input type='hidden' name='stripeToken' value='" + token + "' />");
                // Submit form to the server
                form.get(0).submit();
            }
        }

        $(document).ready(function() {
            // On form submit
            $("#payment_form").submit(function() {
                // Disable the submit button to prevent repeated clicks
                $('#paybtn').attr("disabled", "disabled");

                // Create single-use token to charge the user
                Stripe.card.createToken({
                    number: $('#card_number').val(),
                    cvc: $('#card_cvc').val(),
                    exp_month: $('#card_exp_month').val(),
                    exp_year: $('#card_exp_year').val()
                }, stripeResponseHandler);

                // Submit from callback
                return false;
            });
        });
    </script>
</body>

</html>