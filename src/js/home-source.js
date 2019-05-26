require(['config'],()=>{
	require(['header','template','url','footer','calender','login'],(header,template,url)=>{
		class Source{

			constructor(){
				this.render('all');
			}

			render(condition){

				$.ajax({
					url:url.phpBaseUrl+'homeSource.php',
					type:'get',
					data:{condition},
					dataType: 'json',
					success:data =>{
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
			}
		}

		new Source();
	})
})