<?php
session_start();
//If persona called logout because there is no logged-in user
if (!isset($_SESSION['user'])){
	exit("none");
}
session_destroy();
setcookie('email',"", time()-3600, "/");
exit("okay");
?>