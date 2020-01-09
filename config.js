import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript'
// import tslint from "rollup-plugin-tslint"

const builds = {
    build: {
        plugins: [
            typescript(),
            postcss({
                extensions: ['.css']
            }),
            uglify.uglify()
        ]
    },
    dev: {
        plugins: [
            // tslint({}),
            typescript(),
            postcss({
                extensions: ['.css']
            })
        ],
        watch: {
            include: 'src/**'
        },
        sourceMap: true
    }
}

const getConfig = mode => {
    const opts = builds[mode];
    const config = {
        input: 'src/index.ts',
        output: {
            file: 'dist/lib/bundle.js',
            format: 'es',
            name: 'wui'
        },
        plugins: (opts.plugins || []).concat([
            commonjs(),
            resolve()
        ]),
        watch: opts.watch || null,
        sourceMap: !!opts.sourceMap
    }
    return config
}

export default getConfig(process.env.TARGET)