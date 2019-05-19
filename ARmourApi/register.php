<?php 
header("Access-Control-Allow-Origin:*");
include("config.php");

	//登录注册采用post方式。安全
$userphone = $_POST["phone"];
$userEmail = $_POST["email"];
$psw = $_POST["psw"];
	//$reg = /^1(3|4|5|7|8)\d{9}$/g;
$sqlP = "select * from user where userphone = '$userphone' and psw = '$psw'";
$sqlE = "select * from user where userEmail = '$userEmail' and psw = '$psw'";

$resP = mysql_query($sqlP);
$resE = mysql_query($sqlE);

	if(mysql_num_rows($resP) > 0 || mysql_num_rows($resE) > 0){//该注册用户已经存在
		echo json_encode(array(
			"res_code"=>0,
			"res_massage"=>"注册失败，该用户已存在"
		));
	}else{
		$sql = "insert into user (userphone,userEmail,psw) values ('$userphone','$userEmail','$psw')";
		$res = mysql_query($sql);

		if($res){
			echo json_encode(array(
				"res_code"=>1,
				"res_massage"=>"注册成功，即将跳转登录页面"
			));
		}else{
			echo json_encode(array(
				"res_code"=>2,
				"res_massage"=>"网络错误，注册失败"
			));
		}
	}
	
	
	?>