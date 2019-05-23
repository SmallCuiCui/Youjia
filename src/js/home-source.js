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
					}
				})

			}
		}

		new Source();
	})
})