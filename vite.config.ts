import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//引入按需引入插件
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

//引入Varlet的解析器
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(),
    //按需导入组件：从Varlet库中找
    Components(
      {
        resolvers: [VarletUIResolver()]
      }),
    //按需引入插件：导入API相关
    AutoImport(
      {
        resolvers: [VarletUIResolver({ autoImport: true })]
      }
    )
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
