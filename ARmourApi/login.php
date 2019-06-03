<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	//登录注册采用post方式。安全
	$phone = $_POST["phone"];
	$psw = $_POST["psw"];
	$sql = "select * from user where phone = '$phone' and psw = '$psw'";
	
	$res = mysql_query($sql);
	if(mysql_num_rows($res) > 0){//登录成功
		while ($row = mysql_fetch_array($res,MYSQL_ASSOC))
		{
			$json = json_encode($row);//把数据转换为JSON数据.
		}

		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"登录成功",
			"res_data"=>$json
		));
	}else{
		// 
		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"账户或密码错误"
		));
	}
	
	
 ?>