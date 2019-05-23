require(['config'],()=>{
	require(['header','template','url'],(header,template,url)=>{
		class Detail{
			constructor(){
				this.render();
			}
			render(){
				let id = Number(location.search.slice(4));
				console.log(id);
				$.ajax({
					url:url.phpBaseUrl + "detail.php",
					type:'get',
					dataType:'json',
					data:{id},
					success:data =>{
						let house = JSON.parse(data.res_data);
						this.data = house;
						console.log(house)
						$("#houseInfoWrap").html(template("houseInfoModle",{house}))

						this.bindEvents();
						// 房源预览图片切换效果
						this.imgsBindEvent();
					}
				})
			}

			bindEvents(){

				//固定订单框
				document.onscroll = function(e){
					console.log(1);
					var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					if(Number(scrollTop)>300){
						document.querySelector('.orderBox').classList.add('ac');
					}else{
						document.querySelector('.orderBox').classList.remove('ac');
					}
				}
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

						console.log(divs);
						divs.forEach(function(item){
							console.log(item.getAttribute('index'));
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