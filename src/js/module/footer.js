
// footer模块
define(['jquery',"template"],($,templat)=>{
	class Footer{
		constructor(){
			this.container = $("footer");
			this.render();
		}

		render(){
			this.container.load('/htmls/module/footer.html')
		}
	}

	new Footer();
})