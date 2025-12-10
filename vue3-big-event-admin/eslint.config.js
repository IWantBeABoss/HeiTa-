import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      //prettier专注于代码的美观度(格式化工具)
      //前置条件:
      //1.禁用掉vscode上的格式化插件 prettier format on save
      //2.安装Eslint插件,并配置保存时自动修复
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 单引号
          semi: false, // 无分号
          printWidth: 80, // 每行宽度至多80字符
          trailingComma: 'none', // 不加对象|数组最后逗号
          endOfLine: 'auto', // 换行符号不限制（win mac 不一致）
        },
      ],
      //EsLint关注于规范，如果不符合规范，则报错
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'], // vue组件名称多单词组成（忽略index.vue）
        },
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验 (props解构会丢失响应式)
      // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-undef': 'error',
    },globals: {         //这个是为了防止报错的
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
])
