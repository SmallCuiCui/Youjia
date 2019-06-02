require(['config'],()=>{
	require(['header','template','url',"cookie"],(header,template,url)=>{
		class Self{
			constructor(){
				
				this.data = {
					"userInfo":"",//个人信息
					"orders":[],//订单数据
					"story":[],//故事数据
					"comment":[],//点评数据
					"house":[],//拥有房源数据
					"news":[],//消息
					"collection":[]//收藏房源
				};
				this.getData();

				
			}
			getData(){
				// 用户信息从本地存储获得
				this.data.userInfo = JSON.parse(localStorage.getItem("userInfo"));
				// 订单，故事，房源，评论，收藏 从数据库获取
				let userid = this.data.userInfo.userid;
				let collections = this.data.userInfo.collection;

				$.ajax({
					url: url.phpBaseUrl+'getUserData.php',
					type: 'get',
					dataType: 'json',
					data: {userid,collections},
					success:data=>{
						let alldata = data.res_data;
						for(var key in alldata){
							let list = JSON.parse(alldata[key]);
							if(key!=="user"){
								list.forEach(item=>{
									this.data[key].push(JSON.parse(item));
								})
							}else{
								// 从数据库获取到用户数据后，更新本地存储，避免本地数据与数据库不一致
								let userInfo = JSON.parse(list[0]);
								localStorage.setItem('userInfo',JSON.stringify(userInfo));
							}
							
						}
						console.log(this.data);
						this.render();
						this.bindEvents();
					}
				});
				
			}
			render(){

				// 渲染个人信息
				let data = this.data.userInfo;
				$("#selfWrap").html(template("selfModle",{data}));
				$('.user-info-li').show();
				$('.user-info-li').siblings().hide();
				//初始下表单不可编辑
				$('.cont-bot-rigth input').attr('disabled',true);


				data = this.data;
				// 渲染个人订单
				$("#orderWrap").html(template("orderModule",{data}))
				// 渲染收藏房源
				$("#collectionWrap").html(template("collectionModule",{data}))


				// 渲染个人评价
				$("#commentWrap").html(template("commentModule",{data}))

				// 渲染个人故事
				$("#storyWrap").html(template("storyModule",{data}));

				// 渲染个人房源
				$("#houseWrap").html(template("houseModule",{data}))

			}
			bindEvents(){ 
				let _this = this;
				//点击发表故事
				$('.fabiaoBtn').click(function(){
					window.location.href = '/htmls/story.html';
				})
				// 点击退出登录
				$("#outLogin").on("click",function(){
					if(confirm("确定退出登录吗?")){
						localStorage.setItem('userInfo',"");
						$.removeCookie('user',{ path: '/'});
						location.href="/";
					}
					
				})

				//点击右边导航，实现模块切换
				$('.cont-bot-left ul li').click(function(){
					$(this).addClass('ccc').siblings().removeClass('ccc');
					this.index = $(this).index();
					$('.cont-bot-rigth ul').children('li').eq(this.index).show().siblings().hide();
				});

				//点击编辑
				$('.edit').click(function(){

					//设置当前为可编辑
					$(this).parent().parent().children('div').children('p').children('input').attr('disabled',false).addClass('ed');
					$(this).hide();//隐藏编辑
					$(this).siblings('.save').show();//显示保存
				})
				//点击保存
				$('.save').click(function(){

					// 获取所有表单数据，修改this.data
					$(this).parents(".cont-bot-rigth").find("input").each(function(){
						let prop = $(this).prop("id");
						_this.data.userInfo[prop] = $(this).val();
					})
					
					// 修改本地
					let userInfo = _this.data.userInfo;
					
					// let expires = {expires:10,path:'/'};
					// $.cookie("user",userInfo.phone,expires);

					// 存数据库
					$.ajax({
						url: url.phpBaseUrl + 'userInfoUd.php',
						type: 'get',
						dataType: 'json',
						data: {userInfo},
						success:data=>{
							if(data.res_code===1){
								alert(data.res_message);
							}
						}
					});
					localStorage.setItem('userInfo',JSON.stringify(userInfo));

					//设置当前为不可编辑
					$(this).parent().parent().children('div').children('p').children('input').attr('disabled',true).removeClass('ed');
					$(this).hide();//隐藏保存
					$(this).siblings('.edit').show();//显示编辑
				});

				// 点击立即支付定金
				$(".payOrder").on("click",function(){
					alert("支付成功！");
					$(this).parents("ol").html("<li style='coor:red;'>欢迎入住！</li>");
				})

				// 点击取消订单
				$(".cancelOrder").on("click",function(){
					let index = $(this).parents('.orderlist').attr("data-index");
					let operation = {
						"type":"order",
						"id":index
					}

					$.ajax({
						url: url.phpBaseUrl + 'cancel.php',
						type: 'get',
						dataType: 'json',
						data: {operation},
						success:data=>{
							if(data.res_code === 1){
								alert(data.res_message);
								$(this).parents('.orderlist').remove();
							}
						}
					});
					
				});

				// 取消收藏房源
				$(".cancelcolection").on("click",function(){
					let index = $(this).parents('dl').attr("data-index");

					// 修改收藏房源数据
					let userInfo = _this.data.userInfo;
					let collection = userInfo.collection.split(',');
					collection.splice(index,1);
					userInfo.collection = collection.join();

					$.ajax({
						url: url.phpBaseUrl + 'userInfoUd.php',
						type: 'get',
						dataType: 'json',
						data: {userInfo},
						success:data=>{
							if(data.res_code===1){
								alert("房源收藏取消成功！");
								$(this).parents("dl").remove();
							}
						}
					});

					localStorage.setItem('userInfo',JSON.stringify(userInfo));
				})

			}
		}
		new Self();
	})
})