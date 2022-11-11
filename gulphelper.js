const { src, dest  } = require('gulp')
const stylus = require('gulp-stylus')
const cache = require('gulp-cached')
const terser = require('gulp-terser')
const cleanCSS = require('gulp-clean-css')
const path = require('path')

function copyPlugin(folder){
    const base = path.join('src', folder)
    const destDir = path.join('dist', folder)
    console.log('Copy Plugin from', base)

    src(path.join(base, '*.md'))
        .pipe(cache(`plugin-${folder}`))
        .pipe(dest(destDir))

    src(path.join(base, '*.js'))
        .pipe(cache(`plugin-${folder}`))
        .pipe(terser())
        .pipe(dest(destDir))

    src(path.join(base, '*.css'))
        .pipe(cache(`plugin-${folder}`))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(destDir))

    src(path.join(base, '*.styl'))
        .pipe(cache(`plugin-${folder}`))
        .pipe(stylus())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(destDir))
}

exports.copyPlugin = copyPlugin