	require(['config'],()=>{
		require(['header','url','cookie'],(header,url)=>{
			class Rent{
				constructor(){
					
					this.Submit = true;
					// 房源数据,初始化
					this.data = {
						"housename":"",
						"price":"",
						"discript":"",
						"imgs":"",
						"tips":"",
						"equipment":"",
						"modelclass":"",
						"houseclass":"",
						"remarks":"",
						"houseadress":"",
						"detailAdress":"",
						"userid":"",
					};

					this.checkLogin();
					this.bindEvents();
				}

				bindEvents(){

					let _this = this;

					//添加地址标签
					$('.addAdressBtn').click(function(){
						let text = document.querySelector('.addtipInput').value;
						//输入框在非空的情况下添加
						if(text){
							let adress_box = document.querySelector('.adress_box');
							let li = document.createElement('li');
							li.innerHTML = `${text}<span>x</span>`;
							adress_box.appendChild(li);
						}
						$(".addtipInput").val("");
					});
					//删除地址标签
					$('.adress_box').click(function(e){
						e = e || window.event;
						let target = e.target || e.srcElement;
						if(target.nodeName == 'SPAN'){
							let li = target.parentNode;
							li.remove();
						}
					});

					//设备标签选择
					$('.equipInfo').click(function(e){
						
						let target = e.target || e.srcElemtn;

						if(target.nodeName == 'LI'){
							if(!target.className){

								target.className = 'slc';
							}else{
								target.className = '';
							}
						}
					});

					$('#chooseImage').on('change',function(){

				 		//最多上传9张图片的限制
				 		if(document.querySelector('.imgsWrap').querySelectorAll('li').length < 9){

				 			document.querySelector('.imgsIn').querySelector('.docIng').style.display = 'none';
				 			var filePath = $(this).val(),         //获取到input的value，里面是文件的路径
				    		fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase(),
				    		src = window.URL.createObjectURL(this.files[0]); //转成可以在本地预览的格式
				    		
					    	// 检查是否是图片
					    	if( !fileFormat.match(/.png|.jpg|.jpeg/) ) {
					    		// error_prompt_alert('上传错误,文件格式必须为：png/jpg/jpeg');
					    		document.querySelector('.imgsIn').querySelector('.docIng').style.display = 'block';
					        	return;  
					        }

					        let li = document.createElement('li');
					        li.innerHTML = `<span>x</span><img src=${src}>`;
					       
					       document.querySelector('.imgsWrap').appendChild(li);
				 		}else{
				 			document.querySelector('.imgsIn').querySelector('.numIng').style.display = 'block';
				 		}
				    	
				        // $('imgsWrap').append(img);
				  
				        // $('#cropedBigImg').attr('src',src);
					});

					$('.imgsWrap').click(function(e){
						let target = e.target;
						if(target.nodeName == 'SPAN'){
							let li = target.parentNode;
							li.remove();
							if(document.querySelector('.imgsWrap').querySelectorAll('li').length < 9){
								document.querySelector('.imgsIn').querySelector('.numIng').style.display = 'none';
							}
						}
					});

					// 点击发布房源，获取所有房源数据，并存储到数据库
					$("#subBtn").on('click', () =>{
						
						// 获取地址
						$("#addAdress input").each(function(index){
							if(index===0 || index === 1){
								_this.data.houseadress += $(this).val();
							}
							_this.data.detailAdress += $(this).val();
						})

						// 获取房源标签
						$("#adress_box li").each(function(index){
							let text = $(this).text();
							text = text.substring(0,text.length-1);
							
							if(index === 0){
								_this.data.tips += text ;
							}else{
								_this.data.tips += "," + text;
							}
						})

						// 获取房屋类型
						$("#houseclass option:selected").each(function(index){
							if(index === 0){
								_this.data.houseclass += $(this).text() ;
							}else{
								_this.data.houseclass += "," + $(this).text();
							}
						})

						// 获取房屋户型
						$("#modelclass option:selected").each(function(index){
							if(index === 0){
								_this.data.modelclass += $(this).text() ;
							}else{
								_this.data.modelclass += "," + $(this).text();
							}
						})
						// 房源名称
						_this.data.housename = $("#houseName").val();
						// 房源描述
						_this.data.discript = $("#houseDiscript").val();
						_this.data.remarks = $("#houseRemark").val();

						// 获取配套设施
						$("#equipInfo li").each(function(index){
							if($(this).hasClass('slc')){
								_this.data.equipment += "1,";
							}else{
								_this.data.equipment += "0,";
							}
						})
						_this.data.equipment = _this.data.equipment.substring(0,_this.data.equipment.length-1);

						// 获取图片
						_this.data.imgs = "house4";

						// 获取价格规格
						_this.data.price = $("#priceInput").val();

						Object.keys(_this.data).forEach(function(key,value){
							if(!_this.data[key]){
								// _this.Submit = false;
								// return;
							}
						})
						if(_this.Submit){
							// 数据完善，可以提交房源，插入到数据库
							let data = _this.data;
// 
							$.ajax({
								url: url.phpBaseUrl + 'addHouse.php',
								type: 'get',
								dataType: 'json',
								data: {data},
								success:data =>{
									if(data.res_code === 1){
										if(confirm(data.res_message + " 立即查看?")){
											location.href="/htmls/self.html";
										}else{
											location.reload();
										}
									}else{
										alert(data.res_message);
									}
								}
							});
							
						}else{
							// 数据不完善，不能进行提交
							alert('请完善所有房源信息再提交！');
						}

						// console.log(_this.data);
					});
				}

				// 检查是否登陆，登陆状态下才能进行房源发布
				checkLogin(){
					if(!$.cookie("user")){

						$('.confirm_wrap').show();
						$('.confirm_box').show(function(){
							$(this).animate({"top":"200px","right":"500px"},500);
						});

						$('.toLogin').click(function(){
							$('.confirm_box').hide();
							$(".confirm_wrap").hide();
							$('.aside-wrap').show();
						});

						$('.toHome').click(function(){
							$('.confirm_box').hide();
							$('.confirm_wrap').hide();
							window.location.href = 'file:///D:/%E6%AF%95%E8%AE%BE/gitfile/Youjia/home.html';
						});
					}else{
						this.user = JSON.parse(localStorage.getItem("userInfo"));
						this.data.userid = this.user.userid;
					}
				}
	}
	new Rent();
	})
})