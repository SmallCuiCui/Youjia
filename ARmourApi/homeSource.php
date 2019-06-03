<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");
	$condition = $_GET["condition"];

	// 获取所有房源的个数，限制前端显示更多
	$sql = "select * from house";
	$res = mysql_query($sql);
	$length = mysql_num_rows($res);

	if(is_numeric($condition)){//首页特惠房源渲染6个，其他位置获取全部数据再按条件进行筛选
		$sql = "select * from house limit 1,".$condition;
	}else{
		$sql = "select * from house";
	}
	$res = mysql_query($sql);

	$json = array();
	if(mysql_num_rows($res) > 0){//数据获取成功

		while ($row = mysql_fetch_array($res,MYSQL_ASSOC))
		{
			// 条件为非数字，及进行筛选
			if(!is_numeric($condition)){
				// 数据过滤
				// 根据condition进行房源筛选,按照地点筛选
				$data = $row["houseadress"];
				if(strstr($data,$condition)){
					array_push($json,json_encode($row));//把数据转换为JSON数据.
				}
			}else{
				array_push($json,json_encode($row));//把数据转换为JSON数据.
			}
		}
		echo json_encode(array(
			"res_code"=>1,
			"res_message"=>"数据查询成功",
			"res_maxLength"=>$length,
			"res_data"=>$json
		));
	}else{
		echo json_encode(array(
			"res_code"=>0,
			"res_message"=>"网络错误，请重试"
		));
	}
	
	
 ?>