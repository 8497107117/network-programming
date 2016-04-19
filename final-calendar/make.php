<?php
	$user_make = $_COOKIE['user'];
	$summary = $_GET['summary'];
	$s_t = $_GET['timeMin'];
	$e_t = $_GET['timeMax'];
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
	
	$sql = "SELECT token FROM calendar WHERE username = ?";
	$sth = $db->prepare($sql);
	$sth->execute(array($user_make));
	$result = $sth->fetch();	
	$access_token = $result['token'];
	
	$requestt = curl_init();
	$message = array("summary" => $summary, "start" => array("date" => $s_t, "timeZone" => "Asia/Taipei"), "end" => array("date" => $e_t, "timeZone" => "Asia/Taipei"));
	
	curl_setopt($requestt, CURLOPT_URL, "https://www.googleapis.com/calendar/v3/calendars/primary/events");
	curl_setopt($requestt, CURLOPT_POST, TRUE);
	curl_setopt($requestt, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($requestt, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".$access_token, "Content-Type:application/json"));
	curl_setopt($requestt, CURLOPT_POSTFIELDS, json_encode($message));
	
	$responsee = curl_exec($requestt);
	curl_close($requestt);
	$json_file = json_decode($responsee);

	echo $json_file->id;
?>