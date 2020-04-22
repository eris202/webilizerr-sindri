<?php

$formConfigFile = file_get_contents("../../components/rd-mailform/rd-mailform.config.json");
$formConfig = json_decode($formConfigFile, true);

require '../../components/rd-mailform/phpmailer/PHPMailerAutoload.php';

date_default_timezone_set('Etc/UTC');

try {

    $recipients = $formConfig['recipientEmail'];

    preg_match_all("/([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)/", $recipients, $addresses, PREG_OFFSET_CAPTURE);

    if (!count($addresses[0])) {
        die('MF001');
    }

    $template = file_get_contents('../../components/rd-mailform/rd-mailform.tpl');

    $subject = 'Order request';
    $email = $_SESSION['order']['email'];

    $template = str_replace(
        array("<!-- #{FromState} -->", "<!-- #{FromEmail} -->"),
        array("Email:", $email),
        $template
    );

    $message = "An Order Request from " . $_SESSION['order']['name'] . " in Reference to Transaction ID: " . $txn_id . " Has Been Received. Please open Stripe Dashboard for more details.";

    $template = str_replace(
        array("<!-- #{MessageState} -->", "<!-- #{MessageDescription} -->"),
        array("Message:", $message),
        $template
    );

    $template = str_replace(
        array("<!-- #{Subject} -->", "<!-- #{SiteName} -->"),
        array($subject, $_SERVER['SERVER_NAME']),
        $template
    );

    $mail = new PHPMailer();

    if ($formConfig['useSmtp']) {
        //Tell PHPMailer to use SMTP
        $mail->isSMTP();

        //Enable SMTP debugging
        // 0 = off (for production use)
        // 1 = client messages
        // 2 = client and server messages
        $mail->SMTPDebug = 0;

        $mail->Debugoutput = 'html';

        // Set the hostname of the mail server
        $mail->Host = $formConfig['host'];

        // Set the SMTP port number - likely to be 25, 465 or 587
        $mail->Port = $formConfig['port'];

        // Whether to use SMTP authentication
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "ssl";

        // Username to use for SMTP authentication
        $mail->Username = $formConfig['username'];

        // Password to use for SMTP authentication
        $mail->Password = $formConfig['password'];
    }

    $mail->From = $_SESSION['order']['email'];

    $mail->FromName = $_SESSION['order']['name'];

    foreach ($addresses[0] as $key => $value) {
        $mail->addAddress($value[0]);
    }

    $mail->CharSet = 'utf-8';
    $mail->Subject = $subject;
    $mail->MsgHTML($template);
    $send = $mail->send();
} catch (phpmailerException $e) {
    die('MF254');
} catch (Exception $e) {
    die('MF255');
}
