const gulp = require('gulp')
const util = require('gulp-util')
const sequence = require('run-sequence')

require('./gulpTask/app')
require('./gulpTask/deps')
require('./gulpTask/server')

gulp.task('default',()=>{
    if(util.env.production)
    {
        sequence('deps','app')
    }
    else
    {
        sequence('deps','app','server')
    }
})