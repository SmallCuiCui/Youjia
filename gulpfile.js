
const gulp = require('gulp'),
	  jsMini = require('gulp-uglify'),
	  gulpSass = require('gulp-sass'),
	  cssMini = require('gulp-minify-css'),
	  htmlMini = require('gulp-htmlmin'),
	  babel = require('gulp-babel'),
	  connect = require('gulp-connect');


//制定css任务
gulp.task('css',()=>{
	// 模块化的sass文件不需要单独编译，在引入到其他sass文件中编译
	gulp.src('src/css/*.scss')
		.pipe(gulpSass())
		// .pipe(cssMini())
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
})

//html任务
gulp.task('html',()=>{
	gulp.src('src/**/*.html')
		/*.pipe(htmlMini({
			 removeComments: true,//清除HTML注释
	        collapseWhitespace: true,//压缩HTML
	        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input checked />
	        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	        removeStyleLinkTypeAttributes: true//删除<style>和<link>的type="text/css"
    	}))*/
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
})

//js任务
gulp.task('js',()=>{
	gulp.src('src/js/**/*.js')
		// .pipe(babel({
		//  	presets:['@babel/env']
		//  }))
		// .pipe(jsMini())
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
})

// images
gulp.task('images',()=>{
	gulp.src('src/img/**/*')
		.pipe(gulp.dest('dist/img'));
})

//libs
gulp.task('libs',()=>{
	gulp.src('src/libs/**/*')
		.pipe(gulp.dest('dist/libs'));
})

// 开启服务器
gulp.task('server',()=>{
	connect.server({
		root:'dist',
		port:2224,
		livereload:true
	});
})

//监听任务
gulp.task('watch',()=>{
	gulp.watch('src/**/*.html',['html']);
	gulp.watch('src/js/**/*.js',['js']);
	gulp.watch('src/css/**/*.sass',['css'])
})

// 任务集中执行,default为默认任务
gulp.task('default',['html','css','js','images','libs','server','watch']);