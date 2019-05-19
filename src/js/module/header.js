
// header模块
define(['jquery',"template","cookie"],($,templat)=>{
	class Header{
		constructor(){
			this.container = $("header");
			this.render();


		}
		render(){
			this.container.load('/htmls/module/header.html',()=>{

				//header的事件绑定
				this.bindEvents();

				// 判断是否登录
				this.isLogin();
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