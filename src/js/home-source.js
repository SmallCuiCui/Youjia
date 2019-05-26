require(['config'],()=>{
	require(['header','template','url','footer','calender','login'],(header,template,url)=>{
		class Source{

			constructor(){
				// location.search.slice(4)
				// 链接中取到的数据被编码过了，需要进行解码，
				let condition = decodeURI(location.search.slice(11));
				this.render(condition);
			}

			render(condition){

				let tiaojian = {"condition":condition};
				$.ajax({
					url:url.phpBaseUrl+'homeSource.php',
					type:'get',
					data:{'condition':condition},
					dataType: 'json',
					success:data =>{
						console.log(data);
						this.data = data.res_data;

						let list = [];
						this.data.forEach(item =>{
							item = JSON.parse(item);
							item.houseclass = item.houseclass.split(',');
							item.tips = item.tips.split(',');
							list.push(item);
						})
						this.data = list;
						$("#houseWrap").html(template('houseModle',{list}));

						this.bindEvents();
					}
				})
				
			}

			bindEvents(){
				let _this = this;

				// 点击筛选按钮，进行房源筛选
				$("#aFilter").on("click",function(){
					let condition = $("#addressInput").val();
					if(condition){
						location.href = "/htmls/home-source.html?condition="+condition;
					}else{
						alert("请输入筛选条件");
					}
				})

				// 房源收藏
				$(".shoucang").on("click","i",function(){
					$(this).toggleClass('red');

					let collectionId = $(this).parents(".post").attr("data-index");
					let userInfo = JSON.parse(localStorage.getItem("userInfo"));
					console.log(userInfo.collection);
					let collection = userInfo.collection.split(',');

					if($(this).hasClass('red')){//收藏
						if(collection){
							collection.push(collectionId);
						}else{
							collection=[collectionId];
						}
					}else{// 取消收藏
						let index= collection.indexOf(collectionId);
						collection.splice(index,1);
					}

					userInfo.collection = collection.join();
					console.log(userInfo.collection);
					$.ajax({
						url: url.phpBaseUrl + 'userInfoUd.php',
						type: 'get',
						dataType: 'json',
						data: {userInfo},
						success:data=>{
							console.log(data);
						}
					});

					// 修改本地，可以不需要
					localStorage.setItem('userInfo',JSON.stringify(userInfo));
				})

				// 点击选择日期
				$(".selectDate").on("click",function(){

					console.log(111);
					// 阻止冒泡，实现点击其他位置隐藏日历选择
					event.stopPropagation();
					$('.date-wrap').show();
				}).parents().click(function(){
					$('.date-wrap').hide();
				});

			}
		}

		new Source();
	})
})