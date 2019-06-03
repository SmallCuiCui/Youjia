<?php 
header("Access-Control-Allow-Origin:*");
include("config.php");

	//登录注册采用post方式。安全
$phone = $_POST["phone"];
$psw = $_POST["psw"];
$username = $_POST["username"];
// 默认头像
$img = "/img/t1.jpg";

$sqlP = "select * from user where phone = '$phone'";

$resP = mysql_query($sqlP);

if(mysql_num_rows($resP) > 0){//该注册用户已经存在
	echo json_encode(array(
		"res_code"=>0,
		"res_message"=>"该用户已存在"
	));
}else{
	$sql = "insert into user (phone,psw,username,img) values ('$phone','$psw','$username','$img')";
	$res = mysql_query($sql);

	if($res){
		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"注册成功，即将跳转至登录"
		));
	}else{
		echo json_encode(array(
			"res_code"=>2,
			"res_message"=>"网络错误，注册失败"
		));
	}
}
	
	
?>