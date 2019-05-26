require(["config"],()=>{
	require(["header","url","template","footer","calender"],(header,url,template)=>{
		
		class Home{
			constructor(){

				// 轮播图相关变量
				this.index = 0;//标记当前轮播图

				this.banners = $(".banner_bg li");
				this.btns = $(".btns li");
				this.goPre = $("#goPre");
				this.goNext = $("#goNext");
				this.timer = null;//计时器

				this.render();
				this.bindEvents();
				this.autoPlay();
			}
			render(){
				let condition="8";
				$.ajax({
					url:url.phpBaseUrl+'homeSource.php',
					type:'get',
					data:{condition},
					dataType: 'json',
					success:data =>{
						data = data.res_data;
						let list = [];
						data.forEach(item =>{
							item = JSON.parse(item);
							item.houseclass = item.houseclass.split(',');
							item.tips = item.tips.split(',');
							list.push(item);
						})
						$("#hose_show").html(template('hoseModule',{list}));
					}
				})
			}
			bindEvents(){
				let _this = this;
				// 轮播图点击序号切换图片
				this.btns.on("click",function(){
					_this.index = $(this).index();
					_this.changeImg();
				})

				// 点击上一张
				this.goPre.on("click",()=>{
					if(--this.index<0)this.index = this.banners.length;
					this.changeImg();
				})

				// 点击下一张
				this.goNext.on("click",()=>{
					if(++this.index == this.banners.length)this.index = 0;
					this.changeImg();
				})

				//点击选择日期，显示日历
				$('.selectDate').click(function(){
					$('.date-wrap').show();
				}).siblings().click(function(){
					$('.date-wrap').hide();
				});

				//旅客故事的切换
				$("#ul-li-l li").mouseover(function(){
					var index = $(this).index();
					$(this).css("background-color","#f0546a");
					$(this).siblings().css("background-color","white");
					
					$(".story-l div").eq(index).show();
					$(".story-l div").eq(index).siblings().hide();
				});

				//房东故事的切换
				$("#ul-li-f li").mouseover(function(){
					var index = $(this).index();
					$(this).css("background-color","#f0546a");
					$(this).siblings().css("background-color","white");

					$(".story-f div").eq(index).show();
					$(".story-f div").eq(index).siblings().hide();
				});

			}

			//轮播自动播放，直接执行切换下一张的按钮
			autoPlay(){
				this.timer = setInterval(()=>{
					this.goNext.trigger("click");
				},4000)
			}

			// 切换图片
			changeImg(){
				clearInterval(this.timer);
				this.banners.eq(this.index).addClass('ac').siblings().removeClass('ac');
				this.btns.eq(this.index).addClass('ac').siblings().removeClass('ac');
				this.autoPlay();
			}
		}

		new Home();
	})
})