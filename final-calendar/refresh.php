<?php
	$user_refresh = $_GET['user_name'];
	setcookie("user", $user_refresh, time() + 3600, "/~ycchen0216023/calendar/");
	$CLIENT_ID = "1025872202219-283r7seif9b97fcs68gen8s998c1te0u.apps.googleusercontent.com";
	$CLIENT_SECRET = "gcvmwYN3hqIerIs1p0jEhCSx";
	$GRANT_TYPE = "refresh_token";
	
	$db_host = "dbhome.cs.nctu.edu.tw";
	$db_name = "ycchen0216023_cs";
	$db_user = "ycchen0216023_cs";
	$db_password = "heck336cord596";
	$dsn = "mysql:host=$db_host;dbname=$db_name";
	try{
		$db = new PDO($dsn, $db_user, $db_password);
	}catch(PDOException $e){
		printf("Error : %s", $e->getMessage());
	}
	$sql = "SELECT refreshtoken FROM calendar WHERE username = ?";
	$sth = $db->prepare($sql);
	$sth->execute(array($user_refresh));
	$result = $sth->fetch();
	$REFRESH_TOKEN = $result['refreshtoken'];
	
	$requestt = curl_init();
	curl_setopt($requestt, CURLOPT_URL, "https://accounts.google.com/o/oauth2/token");
	curl_setopt($requestt, CURLOPT_POST, TRUE);
	curl_setopt($requestt, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($requestt, CURLOPT_POSTFIELDS, http_build_query(array("client_id" => $CLIENT_ID, "client_secret" => $CLIENT_SECRET, "refresh_token" => $REFRESH_TOKEN, "grant_type" => $GRANT_TYPE)));
	
	$responsee = curl_exec($requestt);
	curl_close($requestt);
		
	$result = json_decode($responsee);
	$sql = "UPDATE calendar SET token = ? WHERE username = ?";
	$sth = $db->prepare($sql);
	$test = $sth->execute(array($result->access_token, $user_refresh));
	
	echo $result->access_token;
?>