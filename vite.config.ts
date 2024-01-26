import path from 'path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import {
  ElementPlusResolver,
  AntDesignVueResolver
} from 'unplugin-vue-components/resolvers'

const Timestamp = new Date().getTime()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    plugins: [
      vue(),
      AutoImport({
        dts: './auto-imports.d.ts',
        imports: ['vue', 'vue-router'],
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          AntDesignVueResolver({ importStyle: false }),
          IconsResolver({
            prefix: 'Icon'
          })
        ]
      }),
      Components({
        dirs: ['src/components'],
        dts: './components.d.ts',
        extensions: ['vue'],
        deep: true,
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          AntDesignVueResolver({ importStyle: false }),
          IconsResolver({
            enabledCollections: ['ep']
          })
        ]
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')], //路径
        symbolId: 'icon-[dir]-[name]'
      }),
      Icons({
        autoInstall: true
      }),
      // 图片压缩
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7, // 设置GIF图片的优化等级为7
          interlaced: false // 不启用交错扫描
        },
        optipng: {
          optimizationLevel: 7 // 设置PNG图片的优化等级为7
        },
        mozjpeg: {
          quality: 20 // 设置JPEG图片的质量为20
        },
        pngquant: {
          quality: [0.8, 0.9], // 设置PNG图片的质量范围为0.8到0.9之间
          speed: 4 // 设置PNG图片的优化速度为4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox' // 启用移除SVG视图框的插件
            },
            {
              name: 'removeEmptyAttrs',
              active: false // 不启用移除空属性的插件
            }
          ]
        }
      }),
      ElementPlus({
        useSource: true
      })
    ],
    resolve: {
      alias: {
        // 配置目录别名
        '@': path.resolve(__dirname, 'src'),
        '~/': `${path.resolve(__dirname, 'src')}/`,
        views: path.resolve(__dirname, 'src/views'),
        utils: path.resolve(__dirname, 'src/utils')
      },
      extensions: [
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`
        }
      }
    },
    server: {
      port: 81,
      host: '0.0.0.0',
      open: false,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          target: 'http://39.108.187.100:8080/',
          // target: 'http://192.168.50.48:8080',
          changeOrigin: true,
          // rewrite: p => p.replace(/^\/dev-api/, '')
          rewrite: path => path.replace(/^\/dev-api/, '')
        }
      }
    },
    base: VITE_APP_ENV === 'production' ? '/' : './',
    //  生产环境
    build: {
      minify: 'terser',
      //指定输出路径
      assetsDir: './assets',
      // 指定输出文件路径
      outDir: 'dist',
      sourcemap: false, // 构建后是否生成 source map 文件。如果为 true，将会创建一个独立的 source map 文件。
      // 代码压缩配置
      terserOptions: {
        output:{
          comments: true, //去除注释
        },
        warnings: true, //去除黄色警告
        // 生产环境移除console
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      chunkSizeWarningLimit: 2000, // 规定触发警告的 chunk 大小 消除打包大小超过 500kb 警告
      rollupOptions: {
        output: {
          chunkFileNames: `static/js/[name].[hash]${Timestamp}.js`,
          entryFileNames: `static/js/[name].[hash]${Timestamp}.js`,
          assetFileNames: `static/[ext]/[name].[hash]${Timestamp}.[ext]`,
        }
      }
    }
  }
})
