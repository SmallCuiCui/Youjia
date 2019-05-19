<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	//登录注册采用post方式。安全
	$user = $_POST["user"];
	$psw = $_POST["psw"];
	//$reg = /^1(3|4|5|7|8)\d{9}$/g;
	if(preg_match('/^1(3|4|5|7|8)\d{9}$/',$user)){
	//if($reg.test($user)){//电话号码登录
		$sql = "select * from user where userphone = '$user' and psw = '$psw'";
	}else{//邮箱登录
		$sql = "select * from user where userEmail = '$user' and psw = '$psw'";
	}
	

	$res = mysql_query($sql);

	if(mysql_num_rows($res) > 0){//登录成功
		echo json_encode(array(
			"res_code"=>1,
			"res_massage"=>"登录成功"
		));
	}else{
		echo json_encode(array(
			"res_code"=>0,
			"res_massage"=>"登录失败"
		));
	}
	
	
 ?>