const { src, dest} = require('gulp')
const helper = require('./gulphelper.js')

function buildTask(cb) {
    helper.copyPlugin('fragmentEvents')
    helper.copyPlugin('modelViewer')
    cb()
}

exports.build = buildTask