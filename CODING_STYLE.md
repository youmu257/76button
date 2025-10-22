# Coding Style Guide

本專案的編碼風格指南，確保程式碼的一致性和可讀性。

## 目錄

- [通用規則](#通用規則)
- [JavaScript/Vue 規則](#javascriptvue-規則)
- [HTML 規則](#html-規則)
- [CSS 規則](#css-規則)
- [命名規範](#命名規範)
- [註解規範](#註解規範)
- [Git Commit 規範](#git-commit-規範)

## 通用規則

### 縮排與空格

- 使用 **2 個空格** 進行縮排（不使用 Tab）
- 檔案結尾必須有一個空行
- 移除行尾的空白字元
- 使用 UTF-8 編碼
- 使用 LF (Unix) 換行符號

### 檔案命名

- Vue 組件：使用 PascalCase（如 `VoiceButton.vue`）
- JavaScript 檔案：使用 camelCase（如 `audioUtils.js`）
- CSS 檔案：使用 kebab-case（如 `voice-button.css`）
- JSON 檔案：使用 kebab-case（如 `button-list.json`）

## JavaScript/Vue 規則

### 基本語法

```javascript
// ✅ 好的寫法
const name = 'Chilla'
const items = [1, 2, 3]
const obj = { key: 'value' }

// ❌ 避免的寫法
var name = "Chilla";
const items = [ 1,2,3 ];
const obj = {key:"value"};
```

### 引號

- 使用**單引號** `'` 而非雙引號 `"`
- 避免不必要的跳脫字元時可使用雙引號

```javascript
// ✅ 好的寫法
const message = 'Hello World'
const escaped = "It's OK"

// ❌ 避免的寫法
const message = "Hello World"
const escaped = 'It\'s OK'
```

### 分號

- **不使用分號**（讓 Prettier 自動處理）

```javascript
// ✅ 好的寫法
const foo = 'bar'
const func = () => {
  return true
}

// ❌ 避免的寫法
const foo = 'bar';
const func = () => {
  return true;
};
```

### 變數宣告

- 優先使用 `const`，需要重新賦值時使用 `let`
- 禁止使用 `var`

```javascript
// ✅ 好的寫法
const MAX_COUNT = 100
let currentCount = 0

// ❌ 避免的寫法
var MAX_COUNT = 100
var currentCount = 0
```

### 比較運算子

- 使用 `===` 和 `!==` 而非 `==` 和 `!=`

```javascript
// ✅ 好的寫法
if (value === 'test') { }
if (item !== null) { }

// ❌ 避免的寫法
if (value == 'test') { }
if (item != null) { }
```

### 箭頭函數

- 參數永遠使用括號包裹

```javascript
// ✅ 好的寫法
const func = (x) => x * 2
const handler = (event) => { console.log(event) }

// ❌ 避免的寫法
const func = x => x * 2
```

### Vue 組件規則

#### 組件命名

```vue
<!-- ✅ 好的寫法 -->
<template>
  <VoiceButton />
  <PageHeader />
</template>

<!-- ❌ 避免的寫法 -->
<template>
  <voice-button />
  <page-header />
</template>
```

#### Props 命名

```javascript
// ✅ 好的寫法 - JavaScript 使用 camelCase
export default {
  props: {
    buttonName: String,
    isActive: Boolean,
  }
}
```

```vue
<!-- ✅ 好的寫法 - HTML 使用 kebab-case -->
<VoiceButton button-name="測試" :is-active="true" />
```

#### 屬性順序

單行最多 3 個屬性，超過則每行一個屬性：

```vue
<!-- ✅ 好的寫法 -->
<img src="image.jpg" alt="描述" width="100">

<button
  type="button"
  class="btn btn-primary"
  :disabled="isLoading"
  @click="handleClick"
>
  點擊
</button>
```

#### v-for 必須有 key

```vue
<!-- ✅ 好的寫法 -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

<!-- ❌ 避免的寫法 -->
<div v-for="item in items">
  {{ item.name }}
</div>
```

## HTML 規則

### 屬性順序建議

1. `is`
2. `v-for`
3. `v-if` / `v-else-if` / `v-else` / `v-show`
4. `v-pre` / `v-once`
5. `id`
6. `ref` / `key`
7. `v-model`
8. `v-on` / `@`
9. `v-bind` / `:`
10. 其他屬性
11. `v-html` / `v-text`

### 自閉合標籤

```vue
<!-- ✅ 好的寫法 -->
<img src="image.jpg" alt="描述" />
<MyComponent />

<!-- ❌ 避免的寫法 -->
<img src="image.jpg" alt="描述">
<MyComponent></MyComponent>
```

### 無障礙性

```vue
<!-- ✅ 好的寫法 -->
<button type="button" aria-label="關閉">
  <i class="icon-close" aria-hidden="true" />
</button>

<img src="logo.png" alt="公司標誌" loading="lazy" />

<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  外部連結
</a>
```

## CSS 規則

### 基本格式

```css
/* ✅ 好的寫法 */
.selector {
  display: flex;
  margin: 0;
  padding: 10px;
}

.another-selector {
  color: #fff;
}

/* ❌ 避免的寫法 */
.selector{
  display:flex;margin:0;padding:10px;}
.another-selector{color:#fff;}
```

### 顏色值

```css
/* ✅ 好的寫法 */
color: #fff;
color: #f0f0f0;

/* ❌ 避免的寫法 */
color: #FFF;
color: #F0F0F0;
```

### 字串

```css
/* ✅ 好的寫法 */
font-family: 'Arial', sans-serif;
background-image: url('image.jpg');

/* ❌ 避免的寫法 */
font-family: Arial, sans-serif;
background-image: url(image.jpg);
```

## 命名規範

### JavaScript 變數和函數

```javascript
// 變數：camelCase
const userName = 'Chilla'
const isActive = true

// 常數：UPPER_SNAKE_CASE
const MAX_COUNT = 100
const API_URL = 'https://api.example.com'

// 函數：camelCase，動詞開頭
function getUserName() { }
function handleClick() { }
function fetchData() { }

// 私有變數/函數：_開頭
const _privateVar = 'private'
function _privateMethod() { }
```

### Vue 組件

```javascript
// 組件名稱：PascalCase
export default {
  name: 'VoiceButton',
  components: {
    PageHeader,
    VoicePageFooter,
  }
}
```

### CSS 類別

```css
/* BEM 命名法 */
.block { }
.block__element { }
.block--modifier { }

/* 範例 */
.voice-button { }
.voice-button__icon { }
.voice-button--active { }
```

## 註解規範

### JavaScript 註解

```javascript
/**
 * 函數說明（JSDoc 格式）
 * 
 * 詳細描述函數的功能、用途和注意事項
 * 
 * @param {string} name - 參數說明
 * @param {number} count - 參數說明
 * @returns {boolean} 返回值說明
 * 
 * @example
 * checkName('Chilla', 5)
 */
function checkName(name, count) {
  // 單行註解：說明接下來的程式碼邏輯
  return name.length === count
}
```

### Vue 組件註解

```vue
<template>
  <!-- HTML 註解：說明區塊的用途 -->
  <div class="container">
    <!-- 使用者資訊區塊 -->
    <UserInfo />
  </div>
</template>

<script>
/**
 * 組件名稱
 * 
 * 功能說明：
 * - 列出組件的主要功能
 * - 說明特殊邏輯
 * 
 * @component
 */
export default {
  name: 'ComponentName',
}
</script>
```

### CSS 註解

```css
/* 主要區塊註解 */
.main-container {
  /* 單一屬性說明 */
  display: flex; /* 使用 flexbox 佈局 */
}

/* 
 * 複雜邏輯的多行註解
 * 說明為什麼要這樣寫
 */
.complex-selector {
  z-index: 999;
}
```

## Git Commit 規範

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

- `feat`: 新功能
- `fix`: 修復 bug
- `refactor`: 重構（不是新功能也不是修復）
- `style`: 格式調整（不影響程式邏輯）
- `docs`: 文件更新
- `test`: 測試相關
- `chore`: 建置工具或輔助工具的變動
- `perf`: 效能優化

### 範例

```
feat(voice): 新增重疊播放功能

- 新增重疊播放模式開關
- 支援同時播放多個音效
- 新增播放列表管理

Closes #123
```

```
fix(sidebar): 修復記憶體洩漏問題

- 在 beforeUnmount 中移除事件監聽器
- 將匿名函數改為具名方法
```

```
refactor(timeline): 優化組件效能與無障礙性

- 使用 computed 屬性管理數據
- 新增 ARIA 屬性
- 改善 IntersectionObserver 生命週期
```

## 工具配置

本專案使用以下工具確保程式碼品質：

- **EditorConfig**: 統一編輯器配置
- **ESLint**: JavaScript/Vue 程式碼檢查
- **Prettier**: 程式碼格式化
- **Stylelint**: CSS 程式碼檢查

請確保你的編輯器已安裝相關擴充套件。

## 參考資源

- [Vue.js 風格指南](https://vuejs.org/style-guide/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
