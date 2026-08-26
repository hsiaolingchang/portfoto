# 足水日攝影工作室 Portfolio

以 [Astro](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) 建置的靜態攝影作品集。

## 內容

- 文章放在 `content/`（不存在時會 fallback 到 `content.example/`）。
- 目錄與檔名的數字前綴決定排序，並在網址中被移除：
  `content/1.work/2.Portrait/3.md` → `/work/portrait/3/`。
- 沒有 `index.md` 的資料夾會自動產生一頁列表。
- frontmatter：`title`、`showTitle`、`banner`、`gallery`。
  `banner` / `gallery` 中以 `/` 結尾的項目，會展開成該資料夾內的所有圖片。
- 站台資訊（標題、頭像、聯絡方式、社群連結）放在 `content/info.yml`。

## 圖片

原圖放在 **`source-images/`**（不是 `public/`），`npm run prepare-images` 會用 sharp
產生 `public/resized/{small,large}/…webp`，已存在的會跳過。`npm run dev` 與
`npm run build` 都會先跑這一步。

`source-images/` 在 `public/` 之外，所以原圖不會被部署 —— `dist/` 只帶縮圖。
frontmatter 裡的路徑相對於 `source-images/`：`source-images/img/a/b.jpg` 寫成 `/img/a/b.jpg`。

`public/` 只放真正要直接對外的檔案（`logo-1.png`、`favicon.ico`、`robots.txt`）
和產生出來的 `resized/`。

## 指令

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 輸出到 dist/
npm run preview
```
