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
							list.forEach(item=>{
								this.data[key].push(JSON.parse(item));
							})
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

				// 渲染个人订单
				// 渲染个人房源
				// 渲染个人评价
				// 渲染个人故事
				let story = this.data.story;
				console.log(story);
				$("#storyWrap").html(template("storyModule",{story}))
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
							console.log(data);
						}
					});
					localStorage.setItem('userInfo',JSON.stringify(userInfo));

					//设置当前为不可编辑
					$(this).parent().parent().children('div').children('p').children('input').attr('disabled',true).removeClass('ed');
					$(this).hide();//隐藏保存
					$(this).siblings('.edit').show();//显示编辑
				});

				
			}
		}
		new Self();
	})
})