<?php 
	header("Access-Control-Allow-Origin:*");
	include("config.php");

	$operation = $_GET["operation"];

	if($operation !== "selectAll"){//发表故事

		$arr = (array)$operation;

		foreach($arr as $key => $value){
			$str1 = $str1.$key.",";
			$str2 = $str2."'$value',";
		}
		$str1 = substr($str1,0,-1);
		$str2 = substr($str2,0,-1);

		$sql = "insert into story ($str1) values ($str2)";
		$res = mysql_query($sql);

		if($res){
			echo json_encode(array(
				"res_code"=>1,
				"res_message"=>"故事发表成功！",
			));
		}else{
			echo json_encode(array(
				"res_code"=>1,
				"res_message"=>"网络错误，故事发表失败",
			));
		}
	}else{//获取故事数据，渲染故事

		// 拼接sql语句
		$sql = "select * from story";
		$res = mysql_query($sql);

		$json = array();

		if(mysql_num_rows($res) > 0){//数据获取成功

			while ($row = mysql_fetch_array($res,MYSQL_ASSOC))
			{
				// 查询数据库，获取到每个故事的评论，以对象的方式添加到每条故事的数据上
				/*$list = explode(",",$row["comments"]);
				// 拼接查询该故事评论的sql语句
				$sql = "select * from comment where";
				foreach($list as $value){
					$sql = $sql." commentid=".(int)$value." or";
				}
				$sql = substr($sql,0,strlen($sql)-3);*/

				// 上面那种方法复杂了，直接通过评论目标与评论类型即可过去到该故事的所有评论
				$sql = "select * from comment where targetid=".(int)$row["storyid"]." and commentclass='story'";
				//echo $sql;
				$rescomment = mysql_query($sql);
				// comments即为获取到的该故事下的评论集合
				$comments = array();
				if(mysql_num_rows($rescomment) > 0){//成功获取到评论数据
					while ($cowC = mysql_fetch_array($rescomment,MYSQL_ASSOC))
					{
						array_push($comments,json_encode($cowC));//把数据转换为JSON数据.
					}
				}
				// echo json_encode($comments);
				$row["comments"] = json_encode($comments);
				
				array_push($json,json_encode($row));//把数据转换为JSON数据.

			}
			echo json_encode(array(
				"res_code"=>1,
				"res_message"=>"数据查询成功",
				"res_data"=>$json
			));
		}else{
			echo json_encode(array(
				"res_code"=>0,
				"res_message"=>"网络错误，无法加载"
			));
		}
	}
	
 ?>