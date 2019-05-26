require(['config'],()=>{
	require(['header','template','url'],(header,template,url)=>{
		class Detail{
			constructor(){
				this.render();

				// 初始化新订单
				this.newOrder = {
					"userid":"",
					"houseid":"",
					"housename":"",
					"houseimg":"",
					"masterid":"",
					"price":"",//民宿每晚价格
					"status":"",
					"number":"",//入住人数
					"date":"",//订单用户选择入住日期
					"time":"",//订单生成日期
					"titleMoney":""//订单总价
				}
			}
			render(){
				let id = Number(location.search.slice(4));
				// 渲染房源详情
				$.ajax({
					url:url.phpBaseUrl + "detail.php",
					type:'get',
					dataType:'json',
					data:{id},
					success:data =>{
						let house = JSON.parse(data.res_data);
						house.houseclass = house.houseclass.split(',');
						house.tips = house.tips.split(',');
						house.modelclass = house.modelclass.split(',');
						house.equipment = house.equipment.split(',');
						house.remarks = house.remarks.split(',');
						this.data = house;
						console.log(this.data);
						// console.log(house)
						$("#houseInfoWrap").html(template("houseInfoModle",{house}))

						house.equipment.forEach((item,index)=>{
							if(item == 1){
								$("#equipmentWrap li").eq(index).addClass('have');
							}
						})
						this.bindEvents();
						// 房源预览图片切换效果
						this.imgsBindEvent();
						// 渲染该房源评论
						this.renderComment();
						// 渲染该房源
						this.renderMaster();

						// 引入日历表
						require(['calender'],function(){
							
						})
					}
				})
			}

			// 渲染评论
			renderComment(){
				let houseid = this.data.houseid;
				$.ajax({
					url:url.phpBaseUrl+"comment.php",
					data:{houseid},
					type:'get',
					dataType:'json',
					success:data =>{
						if(data.res_code === 1){
							let comment = [];
							data.res_data.forEach(item=>{
								comment.push(JSON.parse(item));
							})
							// console.log(comment);
							$("#commentWrap").html(template("commentModle",{comment}))
						}
						
					}
				})
			}
			// 渲染房主信息
			renderMaster(){
				let masterId = this.data.userid;
				$.ajax({
					url:url.phpBaseUrl+"master.php",
					data:{masterId},
					type:'post',
					dataType:'json',
					success:data =>{
						if(data.res_code === 1){
							let master = JSON.parse(data.res_data);
							$("#masterWrap").html(template("mastermodel",{master}))
						}
						
					}
				})
			}


			bindEvents(){
				let _this = this;
				//固定订单框
				document.onscroll = function(e){
					var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					if(Number(scrollTop)>300){
						document.querySelector('.orderBox').classList.add('ac');
					}else{
						document.querySelector('.orderBox').classList.remove('ac');
					}
				}

				// 订单框日期选择
				$(".selectDate").on("click",function(){
					// 阻止冒泡，实现点击其他位置隐藏日历选择
					event.stopPropagation();
					$('.data-wrapS').show();
				}).parents().click(function(){
					$('.data-wrapS').hide();
				});

				// 订单框选择入住人数
				// 点击减号
				$("#jianBtn").on("click",function(){
					let number = Number($("#numWrap").html());
					if(--number<1)number=1;
					$("#numWrap").html(number);
				})
				// 点击加号
				$("#jiaBtn").on("click",function(){
					let number = Number($("#numWrap").html());
					if(++number>10)number=10;
					$("#numWrap").html(number);
				})

				// 点击预定
				$("#orderBtn").on("click",function(){

					// 得到订单各项数据
					_this.newOrder.houseid = _this.data.houseid;
					_this.newOrder.houseimg = "/img/"+_this.data.imgs+".jpg";
					_this.newOrder.housename = _this.data.housename;
					_this.newOrder.price = _this.data.price;
					_this.newOrder.masterid = _this.data.userid;
					_this.newOrder.status = "初始";
					_this.newOrder.number = Number($("#numWrap").html());
					if($("#selectDate").val()){
						_this.newOrder.date = $("#selectDate").val();

						// 获取入住总天数
						// 2019/5/26~2019/5/27
						let start = Number(_this.newOrder.date.substr(7,2));
						let end = Number(_this.newOrder.date.substr(17,2));
						_this.newOrder.number = end - start;

						// 计算订单总结
						_this.newOrder.titleMoney = _this.newOrder.number * _this.newOrder.price;

					}else{
						alert("请选择入住日期!");
					}

					// 获取当前时间
					let date = new Date();
					var year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					h = date.getHours(),
					m = date.getMinutes();

					_this.newOrder.time = year+"/"+month+"/"+day+" "+h+":"+m;
					// 获取当前登录用户id
					_this.newOrder.userid = JSON.parse(localStorage.getItem("userInfo")).userid;

					console.log(_this.newOrder);
					let data = _this.newOrder;
					$.ajax({
						url: url.phpBaseUrl+'addOrder.php',
						type: 'get',
						dataType: 'json',
						data: {data},
						success:data=>{
							if(data.res_code === 1){
								alert(data.res_message);

								// 生成消息
							}else{
								location.reload();
							}
						}
					});
					

				})
			}

			imgsBindEvent(){
				var housecont = document.querySelector('.housecont');
				var orderBox = document.querySelector('.orderBox');
				
				var ul = housecont.querySelector('.orderImgs').querySelector('ul');
				var ul_lis = Array.from(ul.querySelectorAll('li'));
				
				var ol = housecont.querySelector('.orderImgs').querySelector('ol');
				var ol_lis = Array.from(ol.querySelectorAll('li'));
				
				var model = housecont.querySelector('.model');
				// console.log(model.parentNode);
				var divs = Array.from(model.querySelectorAll('div'));
				var model_lis = Array.from(housecont.querySelector('.model_nav').querySelectorAll('li'));
				
				//房源信息处交互
				housecont.onclick = function(e){
				
					var target = e.target;
					//点击图片浏览
					if(target.nodeName == 'IMG'){
						
						var parent = target.parentNode.parentNode;
						console.log(parent);
						if(parent.nodeName == 'OL'){
							//console.log(1);
							let idx = target.parentNode.getAttribute('index');

							 ol_lis.forEach(function(item,index){
							 	if(item.getAttribute('index') == idx){
							 		item.className = 'ac';
							 	}else{
							 		item.className = '';
							 	}
							 })

							  ul_lis.forEach(function(item,index){
							 	if(item.getAttribute('index') == idx){
							 		item.className = 'ac';
							 	}else{
							 		item.className = '';
							 	}
							 })
							
							
						}
						
						
					}

					//点击房源各类信息浏览
					if(target.nodeName == 'LI'){
						let index = target.getAttribute('index');
						//先去掉模块导航的选择样式
						model_lis.forEach(function(item,index){
							item.classList.remove('ac');
						})
						//为当前点击的模块导航标签添加选中样式
						target.classList.add('ac');

						divs.forEach(function(item){
							if(item.getAttribute('index') == index){
								item.classList.add('ac');
							}else{
								item.classList.remove('ac');
							}
						})
					}
				}
			}
		}
		new Detail();
	})
})