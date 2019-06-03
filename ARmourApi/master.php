<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	$userid = $_POST["masterId"];

	$sql = "select * from user where userid='$userid'";
	$res = mysql_query($sql);

	if(mysql_num_rows($res) > 0){//数据获取成功

		while ($row = mysql_fetch_array($res,MYSQL_ASSOC))
		{
			$json = json_encode($row);//把数据转换为JSON数据.
		}

		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"数据查询成功",
			"res_data"=>$json
		));
	}else{
		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"网络错误，请重试"
		));
	}
	
	
 ?>