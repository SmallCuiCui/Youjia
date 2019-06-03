<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	$userInfo = $_GET["userInfo"];

	$arr = (array)$userInfo;

	foreach($arr as $key => $value){
		$str = $str."$key='$value',";
	}
	$str = substr($str,0,-1);
	//update user set password=666,name='xiao' where id=4
	$sql = "update user set ".$str." where userid=".$arr['userid'];
	$res = mysql_query($sql);

	if($res){
		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"信息更改成功成功！"
		));
	}else{

		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"网络错误，信息更改失败！"
		));
	}
?>