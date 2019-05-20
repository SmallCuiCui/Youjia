
// header模块，将登陆模块的引入放到header位置，因为所有页面都存在header，所有页面都存在登陆/注册模块
define(['jquery',"template","login","cookie"],($,templat,Login)=>{
	class Header{
		constructor(){
			this.container = $("header");
			this.render();
			this.login = Login;
		}
		render(){
			this.container.load('/htmls/module/header.html',()=>{
				//header的事件绑定
				this.bindEvents();
				// 判断是否登录
				this.isLogin();
				this.login.render();
			})
		}

		bindEvents(){
			//点击登录/注册
			$(".login-li").click(function() {
				$(".aside-wrap").show();
			});
		}

		isLogin(){
			//判断是否登录，显示登录/注册或个人中心
			this.islogin = $.cookie("user");
			if(!this.islogin){//未登录 显示登录注册
				$(".login-li").show();
				// $(".self-li").hide();
			}else{//登录时显示个人中心
				$(".self-li").show();
				$(".login-li").hide();
			}
		}
	}

	return new Header();
})