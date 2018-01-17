const webpack = require("webpack");
const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//#region PRODUCTION DEVELOPMENT
const STAGE_DEVELOPMENT = "development";
const STAGE_PRODUCTION = "production";

if (!process.env.NODE_ENV) process.env.NODE_ENV = STAGE_DEVELOPMENT;
else process.env.NODE_ENV = process.env.NODE_ENV.trim().toLowerCase();
var CurrentStage = process.env.NODE_ENV;

const production = (process.env.NODE_ENV) ? process.env.NODE_ENV === 'production' : false;

console.log("Export en mode " + process.env.NODE_ENV.toUpperCase());
//#endregion

var webpackConfig = {
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        loaders: []
    }
};

// -- application d'entrée
webpackConfig.entry = {
    main: [path.resolve(__dirname, "./../src/index.tsx")]
}

// -- sortie
webpackConfig.output = {
    path: path.resolve(__dirname, "./../bin"),
    filename: "js/[name].js",
}

// -- resolve
webpackConfig.resolve = {
    extensions: [".json", ".ts", ".tsx", ".js"],
    alias: {
        "components": path.resolve(__dirname, "./../src/components"),
        "modules": path.resolve(__dirname, "./../modules"),
    },
    modules: [
        path.resolve(__dirname, "."),
        "node_modules"
    ]
}


// -- plugins
webpackConfig.plugins = []
webpackConfig.plugins.push(new webpack.DefinePlugin({
    STAGE: JSON.stringify(CurrentStage),
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
}))

// -- plugin de recharge en développement
if (CurrentStage == STAGE_DEVELOPMENT) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin({
        multiStep: false
    }))
}

// -- Compression
if (CurrentStage == STAGE_PRODUCTION) {
    webpackConfig.plugins.push(new webpack.ProgressPlugin());
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true
        },
        mangle: true
    }));
}

// -- index html
webpackConfig.plugins.push(new htmlWebpackPlugin({
    title: 'Main',
    chunks: ["main"],
    template: path.resolve(__dirname, './../src/index.html')
}))

// -- server de développement
if(CurrentStage == STAGE_DEVELOPMENT){
    webpackConfig.devtool = (production) ? 'cheap-module-source-map' : 'eval-source-map'
    webpackConfig.devServer = {
        hot: true,
        inline: true,
        port: 5080,
        stats: {
            warnings: false
        },
        headers: { 
            "Access-Control-Allow-Origin": "*" 
        },
        proxy: {
            "*": {
                target: "http://localhost/monapplication/",
                //secure: false
            }
        }
    }
}

// ---- typescript
webpackConfig.module.loaders.push({
    test: /.tsx?$/,
    loader: "ts-loader",
    options: {
        configFile: path.resolve(__dirname, "./../tsconfig.json")
    }
})

// ---- sass css
const extractCss = new ExtractTextPlugin({
    filename: "css/[name].css",
    disable: !production,
    allChunks: true
});
webpackConfig.module.loaders.push({
    test: /\.s?css$/,
    loader: extractCss.extract({
        fallback: {
            loader: 'style-loader',
            options: {
                singleton: true
            }
        },
        use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
        ]
    })
})
webpackConfig.plugins.push(
    extractCss
);

// ---- txt files
webpackConfig.module.loaders.push(
    {
        test: /\.txt$/,
        use: "raw-loader"
    }
);

// ---- images
webpackConfig.module.loaders.push(
    {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
            name: "img/img-[name]-[hash:6].[ext]",
            limit: 50
        }
    }
);

// ---- fonts
webpackConfig.module.loaders.push(
    {
        test: /\.(ttf|eot|woff|woff2|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
            name: "fonts/[name].[ext]",
            publicPath: (CurrentStage == STAGE_DEVELOPMENT) ? undefined : "../",
            limit: 10000
        }
    }
);

module.exports = webpackConfig;