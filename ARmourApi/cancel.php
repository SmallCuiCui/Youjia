<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	$operation = $_GET["operation"];
	$type = $operation["type"];
	$id = $operation["id"];
	switch ($type)
	{
		case "order":
		 $sql = "delete from orders where orderid=".$id;
		  break;  
		 
	}
	$res = mysql_query($sql);

	if($res){
		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"订单取消成功！"
		));
	}else{
		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"网络错误，订单取消失败！"
		));
	}
?>