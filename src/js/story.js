require(['config'],()=>{
	require(['header',"template","url"],(header,template,url)=>{
		class Story{
			constructor(){
				this.render();
				
				// 初始化新故事的属性
				this.newStory = {
					"userid":"",
					"theme":"",
					"storytext":"",
					"image":"",
					"adress":"",
					"time":""
				}
				// 可发表标识，数据为空时不能发表成功
				this.publish = true;
			}
			// 获取数据，渲染故事,同时渲染故事下面的评论
			render(){
				$.ajax({
					url:url.phpBaseUrl + 'story.php',
					data:{},
					type:'get',
					data: {operation:"selectAll"},
					dataType:"json",
					success:data=>{
						
						let list = [];
						data.res_data.forEach(item=>{
							item = JSON.parse(item);
							// 处理评论数据，此时为字符串，转成一个数组
							if(item["comments"]){
								let comments = JSON.parse(item["comments"]);
								item["comments"] = [];
								comments.forEach(itemc=>{
									item["comments"].push(JSON.parse(itemc));
								})
							}
							list.push(item);
						})

						$("#storyWrap").html(template("storyModle",{list}));

						this.bindEvents();
					}
				})
				
			}
			bindEvents(){
				let _this = this;

				//点击发表故事
				$('#newStoryBtn').click(function(){
					if($('.new_story').css('display') == 'none'){
						$('.new_story').show();
					}else{
						$('.new_story').hide();
					}

				});

				//点击选择图片按钮,获取src路径
				var _src = '';
				$('.chatuBtn').on('change',function(){

					var filePath = $(this).val(),
					fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
					_src = window.URL.createObjectURL(this.files[0]);

					// 检查是否是图片
					if( !fileFormat.match(/.png|.jpg|.jpeg/) ) {
						document.querySelector('.new_b_r').querySelector('.chatuTip').style.display = 'block';
						return;  
					}else{
						document.querySelector('.new_b_r').querySelector('.chatuTip').style.display = 'none';
					}
					$('.chatuBox').children('li').remove();

					let li = document.createElement('li');
					li.innerHTML = `<img src=${_src}>`;
					_this.newStory.image = _src;

					document.querySelector('.chatuBox').appendChild(li);

				})
				//点击立即发表,进行故事的发表
				$('.okBtn').click(function(){
					// 获取内容
					_this.newStory.theme = document.querySelector('.zhuti').value;
					_this.newStory.adress = document.querySelector('.didian').value;
					_this.newStory.storytext = document.querySelector('.neirong').value;

					// 获取当前时间
					let date = new Date();
					var year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					h = date.getHours(),
					m = date.getMinutes();

					_this.newStory.time = year+"/"+month+"/"+day+" "+h+":"+m;
					// 获取当前登录用户id
					_this.newStory.userid = JSON.parse(localStorage.getItem("userInfo")).userid;
					let story = _this.newStory;

					Object.keys(story).forEach(function(key,value){
						if(!story[key]){
							_this.publish = false;
							return;
						}
					})

					if(_this.publish){//成功发表故事
						$.ajax({
							url: url.phpBaseUrl + 'story.php',
							type: 'get',
							dataType: 'json',
							data: {operation:story},
							success:data=>{
								if(data.res_code === 1){
									alert(data.res_message);
									_this.render();
								}else{
									alert(data.res_message);
								}

								$('.new_story').hide();
							}
						});
					}else{
						alert("请完善故事信息再进行发表！");
					}
					
				})


				// 点击取消发表
				$('.cancelBtn').click(function(){
					$('.new_story').hide();
				});

				// 点赞
				$('.zanBtn').click(function(e){
					var target = e.target;
					if(target.nodeName == 'SPAN'){
						if(target.className == ''){
							target.className = 'ac';
						}else{
							target.className = '';
						}
					}
				});

				// 点击评论图标，显示该故事下的评论
				$(".pinglun").on("click",function(){
					$(this).parents(".modle").find(".commentsWrap").toggleClass('hide');
				});

				// 点击发表评论
				$(".postBtn").on("click",function(){
					let comment={};
					comment.commenttext = $(this).parents(".postComment").find("textarea").val();
					comment.userid = JSON.parse(localStorage.getItem("userInfo")).userid;
					comment.username = JSON.parse(localStorage.getItem("userInfo")).username;
					comment.userimg = JSON.parse(localStorage.getItem("userInfo")).img;
					comment.targetid = Number($(this).parents('.modle').attr("story-index"));
					comment.commentclass = "story";
					// 获取当前时间
					let date = new Date();
					var year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate();
					comment.time = year+"-"+month+"-"+day;

					if(comment.commenttext){
						let data = comment;
						$.ajax({
							url: url.phpBaseUrl + 'addComment.php',
							type: 'get',
							dataType: 'json',
							data: {data},
							success:data =>{
								if(data.res_code === 1){
									_this.render();
								}else{
									alert(data.res_message);
								}
							}
						});
					}else{
						alert("请输入评论内容！");
					}
				})
			}
		}
		
		new Story();
	})
})