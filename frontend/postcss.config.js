const path = require('path')

module.exports = {
    parser: require('postcss-comment'),
    plugins: {
        'postcss-import': {
            resolve(id, basedir) {
                // resolve alias @shared, @import '@shared/style.pcss'
                if (/^@/.test(id)) {
                    const [alias, ...rest] = id.split('/')
                    return path.resolve('src', alias.slice(1), ...rest)
                }

                // resolve relative path, @import './components/style.css'; prefix with './' or '../'
                if (/^\./.test(id)) {
                    return path.resolve(basedir, id)
                }

                // resolve node_modules, @import 'normalize.css/normalize.css'
                return path.resolve('./node_modules', id)
            }
        },
        'postcss-nested': {},
        'postcss-nested-vars': {},
        'postcss-simple-vars': {},
        'postcss-nested-ancestors': {},
        'cssnano': {
            preset: 'default'
        },
        'postcss-preset-env': {},
        'at-rule-packer': {},
        'postcss-custom-properties': {},
        'postcss-custom-media': {},
        'postcss-for': {},
        'postcss-nth-list': {},
        'postcss-each': {}
    }
}
