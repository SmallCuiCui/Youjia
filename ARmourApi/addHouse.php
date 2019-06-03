<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	$data = $_GET["data"];

	$arr = (array)$data;

	foreach($arr as $key => $value){
		$str1 = $str1.$key.",";
		$str2 = $str2."'$value',";
	}
	$str1 = substr($str1,0,-1);
	$str2 = substr($str2,0,-1);

	$sql = "insert into house ($str1) values ($str2)";

	$res = mysql_query($sql);

	if($res){
		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"房源提交成功，请耐心等待审核发布"
		));
	}else{

		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"网络错误，房源提交失败"
		));
	}
	
	
?>