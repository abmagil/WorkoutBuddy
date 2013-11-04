<?php
    session_start();
    $assertion = $_POST['assertion'];
    //echo $assertion."<br/>";//REMOVE
    //echo $_SERVER['QUERY_STRING']."<br/>";//REMOVE
	
    $audience = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
	//echo $audience."<br/>";//REMOVE
	$postdata = 'assertion=' . urlencode($assertion) . '&audience=' . urlencode($audience);
	//echo $assertion."<br/>";
	$_SESSION['audience'] = $audience;
	$_SESSION['assertion'] = $assertion;
	$_SESSION['postdata'] = $postdata;//remove
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://verifier.login.persona.org/verify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
    if (substr(PHP_OS, 0, 3) == 'WIN') {
        if (!isset($cabundle)) {
            $cabundle = dirname(__FILE__).DIRECTORY_SEPARATOR.'cabundle.crt';
        }
        curl_setopt($ch, CURLOPT_CAINFO, $cabundle);
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    $response = curl_exec($ch);
    curl_close($ch);
    
	echo $response;
?>