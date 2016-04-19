<?php
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
	$sql = "SELECT * FROM calendar";
	$sth = $db->prepare($sql);
	$sth->execute();
	$result = $sth->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($result);		
?>