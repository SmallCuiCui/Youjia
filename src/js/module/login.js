
//登录注册模块，逻辑比较多，独立出来单独管理
define(['jquery',"template","url","cookie"],($,templat,url)=>{
	class Login{
		constructor(){

			// 可登陆标记
			this.login = true;
			// 可注册标记
			this.reg = true;
		}
		render(){
			$("#aside").load('/htmls/module/login.html',()=>{
				// 清空注册表单内容
				setTimeout(function() {
					$("#regsphone").prop("readonly","");
					$("#pswinput").prop("readonly","");
				}, 50)

				this.bindEvents();
			});
		}

		bindEvents(){
			let _this = this;
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

			/*失去焦点时进行输入数据进行验证*/

			// 注册
			// 输入电话号码后进行请求，判断该号码是否已经进行注册
			$("#regsphone").blur(function(){
				_this.phone = $("#regsphone").val();
				_this.psw = "";

				// 先验证电话号码格式
				if(_this.phone){
					if(!/^1(3|4|5|7|8)\d{9}$/.test(_this.phone)){
						// 正则验证，判断电话号码格式是否正确
						$("#mkphone-p").html("电话号码格式错误，请重新输入").css("opacity","1");
						_this.reg = false;
						return;
					}else{
						_this.reg = true;
						$("#mkphone-p").css("opacity","0");
					}
				}else{
					$("#mkphone-p").html("请输入电话号码").css("opacity","1");
					_this.reg = false;
				}

				_this.reg = true;
				
				
			})

			// 密码格式验证
			$("#pswinput").blur(function(){
				_this.psw = $(this).val();
				if(_this.regPsw()){
					_this.reg = true;
					$("#new-ps-p").css("opacity",0);
				}else{
					_this.reg = false;
					$("#new-ps-p").css("opacity",1);
				}
			})

			// 确认密码
			$("#pswconf").blur(function(){
				if($(this).val()===_this.psw){
					_this.reg = true;
					$("#che-pas-p").css("opacity",0);
				}else{
					_this.reg = false;
					$("#che-pas-p").css("opacity",1);
				}
			})

			//点击登录
			$(".login-btn").click(function(){
				$(".aside-wrap").hide();
				$(".self-li").show();
				$(".login-li").hide();
			});

			//点击注册
			$(".reg-btn").click(function(){
				if(_this.reg){

					// 访问数据库，插入数据
					let phone = _this.phone,
						psw = _this.psw;
					console.log(222);
					$.ajax({
						url:url.phpBaseUrl + "register.php",
						type:'post',
						data:{phone,psw},
						dataType:'json',
						success:data=>{
							if(data.res_code === 0){
								_this.reg = false;
								$("#mkphone-p").html(data.res_message).css("opacity","1");
							}else if(data.res_code === 1){
								if(confirm(data.res_message)){
									// 跳转到登陆页面
									$(".lg_form").show().siblings().hide();
									$("#user-reg").removeClass('border-bot');
									$("#user-login").addClass('border-bot');
									$('aside').css({'height':'400px'});
								}else{
									$(".aside-wrap").hide();
								}
							}else{
								alert(data.res_message);
							}
							
						}
					})

					
				}else{
					return;
				}
				
			});

		}
		// 密码格式验证
		regPsw() {
                let arr = [];
                arr.push(/^.{8,16}$/.test(this.psw));
                arr.push(/\d/.test(this.psw));
                arr.push(/[a-zA-Z]/.test(this.psw));
                arr.push(/[^0-9a-zA-Z]/.test(this.psw));
                if (arr[0]) {
                    if (arr[1] + arr[2] + arr[3] >= 2) return true;
                    else return false;
                } else {
                    return false;
                }
            }
}

 return new Login();
})