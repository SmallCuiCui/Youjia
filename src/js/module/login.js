
//登录注册模块
define(['jquery',"template","cookie"],($,templat)=>{
	class Login{
		constructor(){
			this.container = $("#aside");
			this.render();
		}
		render(){
			this.container.load('/htmls/module/login.html',()=>{
				this.bindEvents();
			});
		}

		bindEvents(){
			
			//阻止冒泡
			$("aside").click(function(e){
				e.stopPropagation();
			})

			//选择登录还是注册
			$("#lg-top p").click(function(){
				var index = $(this).index();
				if(index == 1){//注册
					$(".no-p").hide().siblings().show();//隐藏没有账户，显示有账户
					$('aside').css({'height':'540px'});
				}else{//登录
					$(".have-p").hide().siblings().show();//隐藏有账户，显示没有账户
					$('aside').css({'height':'400px'});
				}
				$(".lg-bottom form").eq(index).show().siblings().hide();
				$(this).addClass('border-bot').siblings().removeClass('border-bot');
			});

			//点击已有账户，显示登录
			$(".have-p .have-login").click(function(){
				$(".have-p").hide().siblings().show();//隐藏有账户，显示没有账户
				$(".lg_form").show().siblings().hide();
				$("#user-reg").removeClass('border-bot');
				$("#user-login").addClass('border-bot');
				$('aside').css({'height':'400px'});
			});
			//点击没有账户，显示注册
			$(".no-p .have-login").click(function(){
				$(".no-p").hide().siblings().show();//隐藏没有账户，显示有账户
				$(".rgs_form").show().siblings().hide();
				$("#user-login").removeClass('border-bot');
				$("#user-reg").addClass('border-bot');
				$('aside').css({'height':'540px'});
			});

			// 点击空白处，登录注册隐藏
			$(".aside-wrap").click(function(){
				$(this).hide();
			});
			//点击x隐藏登录注册
			$(".cancel-btn").click(function(){
				$(".aside-wrap").hide();
			});

			//点击登录
			$(".login-btn").click(function(){
				$(".aside-wrap").hide();
				$(".self-li").show();
				$(".login-li").hide();
			});

			//点击注册
			$(".reg-btn").click(function(){
				$(".lg_form").show().siblings().hide();
				$("#user-reg").removeClass('border-bot');
				$("#user-login").addClass('border-bot');
				$('aside').css({'height':'400px'});
			});

		}
}

new Login();
})