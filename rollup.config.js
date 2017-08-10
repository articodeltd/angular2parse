export default {
    entry: 'index.js',
    dest: 'bundles/angular2parse.umd.js',
    sourceMap: true,
    format: 'umd',
    exports: 'named',
    onwarn: function(warning) {},
    moduleName: 'angular2parse',
    globals: {
        '@angular/core' : 'ng.core'
    }
}