<?php
	$code = $_GET['code'];
	$user_name = $_GET['state'];
	setcookie("user", $user_name, time() + 3600, "/~ycchen0216023/calendar/");
	$CLIENT_ID = "1025872202219-283r7seif9b97fcs68gen8s998c1te0u.apps.googleusercontent.com";
	$CLIENT_SECRET = "gcvmwYN3hqIerIs1p0jEhCSx";
	$REDIRECT = "https://people.cs.nctu.edu.tw/~ycchen0216023/calendar/auth.php";
	$GRANT_TYPE = "authorization_code";
	
	
	
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
	
	$check_sql = "SELECT username FROM calendar WHERE username = :user";
	$check_sth = $db->prepare($check_sql);
	$check_sth->bindValue(':user', $user_name);
	$check_sth->execute();
	$check_result = $check_sth->fetch();
	
	if(isset($check_result['username']))
		echo "User name has been registered !!!";
	else{
		$requestt = curl_init();
		curl_setopt($requestt, CURLOPT_URL, "https://accounts.google.com/o/oauth2/token");
		curl_setopt($requestt, CURLOPT_POST, TRUE);
		curl_setopt($requestt, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($requestt, CURLOPT_POSTFIELDS, http_build_query(array("code" => $code, "client_id" => $CLIENT_ID, "client_secret" => $CLIENT_SECRET, "redirect_uri" => $REDIRECT, "grant_type" => $GRANT_TYPE)));
	
		$responsee = curl_exec($requestt);
		curl_close($requestt);
	
		$result = json_decode($responsee);
		
		$data = array($user_name, $result->access_token, $result->refresh_token);
		$sql = "INSERT INTO calendar (username, token, refreshtoken) VALUES (?, ?, ?)";
		$sth = $db->prepare($sql);
		$test = $sth->execute($data);
		exit;
	}
?>