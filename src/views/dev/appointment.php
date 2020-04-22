<?php
session_start();
require 'include/config.php';
$error = "";
if (
  !empty($_POST['name']) &&
  !empty($_POST['token']) &&
  !empty($_POST['email']) &&
  !empty($_POST['domain_url']) &&
  !empty($_POST['backend_url']) &&
  !empty($_POST['username']) &&
  !empty($_POST['password'])
) {
  if (!validate_csrf("appointment", $_POST['token'])) {
    $error = "Invalid Token! Please Try Again.";
  } else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $error = "Please Enter A Valid Email!";
  } else if (!filter_var($_POST['domain_url'], FILTER_VALIDATE_URL)) {
    $error = "Please Enter A Valid Domain URL Followed By Protocol (https:// | http://)!";
  } else if (!filter_var($_POST['backend_url'], FILTER_VALIDATE_URL)) {
    $error = "Please Enter A Valid Backend URL Followed By Protocol (https:// | http://)!";
  } else {
    if (empty($_POST['notes'])) {
      $_POST['notes'] = "";
    }
    try {
      $user = $conn->prepare("SELECT * FROM `users` WHERE `email`=?");
      $user->bindParam(1, $_POST['email'], PDO::PARAM_INT);
      $user->execute();
      $row = $user->fetch(PDO::FETCH_ASSOC);
      if (!$row) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $hash_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO `users` (`name`, `email`, `password`) VALUES ('" . $name . "', '" . $email . "', '" . $hash_password . "')";
        $insert = $conn->query($sql);
        $user_id = $conn->lastInsertId();
      } else {
        $user_id = $row['id'];
      }
      $_POST['user_id'] = $user_id;
      $_SESSION['order'] = $_POST;
      header('location: checkout.php');
    } catch (PDOException $e) {
      $error = "An Error Has Been Occured!";
    }
  }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>Website Repair</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta property="og:title" content="Template Monster Admin Template">
  <meta property="og:description" content="brevis, barbatus clabulares aliquando convertam de dexter, peritus capio. devatio clemens habitio est.">
  <meta property="og:image" content="http://digipunk.netii.net/images/radar.gif">
  <meta property="og:url" content="http://digipunk.netii.net">
  <link rel="icon" href="images/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="components/base/base.css">
  <script src="components/base/core.js"></script>
  <script src="components/base/script.js"></script>
</head>

<body>
  <div class="page">
    <!--RD Navbar-->
    <header class="section rd-navbar-wrap" data-preset='{"title":"Navbar Default","category":"header","reload":true,"id":"navbar-default"}'>
      <nav class="rd-navbar">
        <div class="navbar-container">
          <div class="navbar-cell">
            <div class="navbar-panel">
              <button class="navbar-switch int-hamburger novi-icon" data-multi-switch='{"targets":".rd-navbar","scope":".rd-navbar","isolate":"[data-multi-switch]"}'></button>
              <div class="navbar-logo"><a class="navbar-logo-link" href="index.html"><img class="navbar-logo-default" src="images/logos/webilizerr3.png" alt="Intense" width="170" height="27" /><img class="navbar-logo-inverse" src="images/logos/webilizerr3.png" alt="Intense" width="170" height="27" style="padding-top: 10px;" /></a></div>
            </div>
          </div>
          <div class="navbar-cell navbar-spacer"></div>
          <div class="navbar-cell navbar-sidebar">
            <ul class="navbar-navigation rd-navbar-nav">
              <li class="navbar-navigation-root-item active"><a class="navbar-navigation-root-link" href="index.html">Home</a>

              </li>
              <li class="navbar-navigation-root-item"><a class="navbar-navigation-root-link" href="features.html">Features</a>
              </li>
              <li class="navbar-navigation-root-item"><a class="navbar-navigation-root-link" href="about-us.html">About
                  Us</a>
              </li>
              <li class="navbar-navigation-root-item"><a class="navbar-navigation-root-link" href="get-in-touch.html">Contact Us</a>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </header>
    <!-- Appointment-->
    <section class="section section-lg section-layer pt-5" data-preset='{"title":"Appointment Form","category":"form","reload":true,"id":"appointment-form-2"}'>
      <div class="bg-layer bg-image  novi-background" style="bottom: 45%; background-image: url(images/image-26-1920x772.jpg);"></div>
      <div class="container">
        <!-- Breadcrumb-->
        <ul class="breadcrumb context-dark">
          <li class="breadcrumb-item"><a class="breadcrumb-link" href="index.html">Home</a></li>
          <li class="breadcrumb-item"><span class="breadcrumb-text breadcrumb-active">Repair Request</span></li>
        </ul>
        <div class="row row-40 row-xl-80 row-xxl-100  novi-disabled" style="margin-top: 7.5%">
          <div class="col-md-8 col-xxl-6 context-dark ">
            <h1>Website Repair</h1>
            <h5>Give us all the necessary details so we can start on your project and we try to finished as soon as
              possible. It can take up-to 72 hours, depends on the work load.</h5>
            <p>All data here is sent with 256-bit encryption - No data will be shared and everything is deleted after
              the work is done.</p>
          </div>
          <div class="col-md-10 col-xxl-8">
            <article class="accent-box">
              <h4 class="accent-box-title text-center">Make an Order</h4>
              <p class="text-danger my-2"><?= $error; ?></p>
              <form action="appointment.php" method="POST">
                <div class="form-row row-15 novi-disabled">
                  <div class="col-12">
                    <div class="form-group">
                      <label for="name">Name:</label>
                      <div class="position-relative">
                        <input class="form-control" id="name" type="text" name="name" placeholder="Your name" required>
                        <input type="hidden" name="token" value="<?= csrf("appointment"); ?>" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group">
                      <label for="email">E-mail:</label>
                      <div class="position-relative">
                        <input class="form-control" id="email" type="email" name="email" placeholder="Your e-mail address" required>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group">
                      <label for="domain-url">Domain URL:</label>
                      <div class="position-relative">
                        <input class="form-control" id="domain" type="text" name="domain_url" placeholder="https://example.com" required>
                        <p class="small mt-1">Please Enter A Valid Domain URL Followed By Protocol (https:// | http://)</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="backend-login">Back-end login URL:</label>
                      <div class="position-relative">
                        <input class="form-control" id="backend_login" type="text" name="backend_url" placeholder="C-panel url" required>
                        <p class="small mt-1">Please Enter A Valid Backend URL Followed By Protocol (https:// | http://)</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="username">Username:</label>
                      <div class="position-relative">
                        <input class="form-control" id="username" type="text" name="username" placeholder="Username" required>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="password">Password:</label>
                      <div class="position-relative">
                        <input class="form-control" id="password" type="password" name="password" placeholder="Password" required>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="notes">Any notes?:</label>
                      <div class="position-relative">
                        <textarea class="form-control" id="notes" name="notes" placeholder="Any notes?"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-lg btn-primary accent-box-btn" type="submit">Submit</button>
              </form>
            </article>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer default-->
    <footer class="section footer bg-800 text-400 context-dark novi-background" data-preset='{"title":"Footer Extended","category":"footer","reload":false,"id":"footer-extended"}'>
      <div class="container">

        <hr class="divider footer-divider">
        <div class="row row-30 justify-content-xxl-between novi-disabled">
          <div class="col-lg-5">
            <!-- Logo-->
            <div class="logo"><a class="logo-link" href="index.html"><img class="logo-image-default" src="images/logos/webilizerr_white.png" alt="Intense" width="170" height="27" /><img class="logo-image-inverse" src="images/logos/webilizerr_white.png" alt="Intense" width="170" height="27" /></a></div>
            <p class="small">Get the most for your website with Webilizerr.</p>
          </div>
          <div class="col-md-11 col-lg-7 col-xxl-6">
            <p class="small">C. Segovia 2-4, Finestrat, Alicante 03509, Spain</p>
            <div class="row row-20 novi-disabled">
              <div class="col-auto col-sm-4">
                <div class="media media-xxs text-white">
                  <div class="media-left"><span class="icon icon-xs int-phone novi-icon"></span></div>
                  <div class="media-body">
                    <ul class="list list-contact">
                      <li class="list-contact-item"><a class="list-contact-link" href="tel:#">+34 601980086</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-auto col-sm-4">
                <ul class="list list-xs small">
                  <li class="list-item">Mon-Fri: 8am - 6pm</li>
                  <li class="list-item">Sat-Sun: 8am - 4pm</li>
                  <li class="list-item">Holidays: closed</li>
                </ul>
              </div>
              <div class="col-auto col-sm-4">
                <ul class="list list-lg small text-white">
                  <li class="list-item"><a class="link link-contrast link-secondary" href="mailto:#">info @
                      webilizerr.com</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr class="divider footer-divider">
        <div class="row row-15 align-items-center justify-content-between footer-panel novi-disabled">
          <div class="col-auto">
            <!-- Copyright-->
            <p class="rights"><span>&copy; 2020&nbsp;</span><span>Webilizerr</span><span>. All rights
                reserved.&nbsp;</span><a class="rights-link" href="privacy-policy.html">Privacy Policy</a></p>
          </div>
          <div class="col-auto">
            <div class="group-30 d-flex align-items-center text-white"><a class="icon icon-xs icon-social int-facebook novi-icon" href="https://www.facebook.com/webilizerr"></a><a class="icon icon-xs icon-social int-instagram novi-icon" href="https://www.instagram.com/webilizerr/"></a><a class="icon icon-xs icon-social int-twitter novi-icon" href="https://twitter.com/Webilizerr"></a><a class="icon icon-xs icon-social int-linkedin novi-icon" href="https://www.linkedin.com/company/13004002"></a></div>
          </div>
        </div>
        <span id="siteseal">
          <script async type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=R1olB8HGqvj1MQajxuJaNwZZd3vaLlezScszr3Hda09ljTHeQOV680PsNTIv"></script>
        </span>
      </div>
    </footer>
  </div>
</body>

</html>