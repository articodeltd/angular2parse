export default {
    entry: 'index.js',
    dest: 'bundles/angular2parse.umd.js',
    sourceMap: 'inline',
    format: 'umd',
    exports: 'named',
    onwarn: function(warning) {},
    moduleName: 'angular2parse',
    globals: {
        '@angular/core' : 'ng.core'
    }
}