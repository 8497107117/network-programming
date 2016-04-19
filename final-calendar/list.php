<?php
	$user_list = $_COOKIE['user'];
	if($_GET['timeMin'] != null)
		$s_t = $_GET['timeMin']."T00:00:00%2B08:00";
	if($_GET['timeMax'] != null)
		$e_t = $_GET['timeMax']."T00:00:00%2B08:00";
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
	$sth->execute(array($user_list));
	$result = $sth->fetch();	
	$access_token = $result['token'];	
	
	$requestt = curl_init();
	if($s_t != null && $e_t != null)
		curl_setopt($requestt, CURLOPT_URL, "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=".$s_t."&timeMax=".$e_t);
	else if($s_t == null && $e_t != null)
		curl_setopt($requestt, CURLOPT_URL, "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=".$e_t);
	else if($s_t != null && $e_t == null)
		curl_setopt($requestt, CURLOPT_URL, "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=".$s_t);
	else		
		curl_setopt($requestt, CURLOPT_URL, "https://www.googleapis.com/calendar/v3/calendars/primary/events");
	curl_setopt($requestt, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($requestt, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".$access_token));
	
	$responsee = curl_exec($requestt);
	curl_close($requestt);
	
	echo $responsee;	
?>