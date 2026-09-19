# 待辦清單 Web App

這是一個在 **GitHub Copilot 實戰工作坊**中完成的待辦清單 Web App。專案以純前端技術實作，提供待辦事項管理、篩選與深色模式等日常使用功能，並透過 GitHub Copilot Agent Mode、MCP 與可重複使用的 agentic workflow 完成開發與 issue 修正流程。

## 線上展示

https://vivianyeh.github.io/copilot-workshop-agent-mode-mcp/

## 功能

- 新增待辦事項。
- 輸入空白內容時不會新增。
- 勾選待辦事項為完成，完成項目會顯示刪除線並淡化文字。
- 可取消已完成狀態。
- 刪除單筆待辦事項。
- 顯示整體清單的「未完成:N 項」計數，不受目前篩選條件影響。
- 提供「全部」、「未完成」與「已完成」三種篩選條件。
- 重新整理後保留上次選擇的篩選條件；不合法的保存值會安全回到「全部」。
- 篩選結果為空時顯示對應提示文字。
- 提供淺色與深色模式切換。
- 深色模式偏好會保存；未手動選擇時跟隨作業系統的 `prefers-color-scheme` 設定。
- 重新整理頁面後保留待辦資料與主題偏好。
- 採用置中卡片式介面，並支援手機螢幕的 RWD 排版。

## 技術

- 使用 HTML、CSS 與原生 JavaScript。
- 不使用任何框架或套件，沒有建立 `package.json`，也沒有建置流程。
- 不引用外部 CDN，可直接離線開啟。
- 使用 CSS 變數集中管理顏色與淺色／深色主題。
- 使用瀏覽器 `localStorage` 保存待辦資料、主題偏好與篩選條件。
- 使用 `textContent` 與 `createElement` 產生動態 DOM 內容。
- 專案主要檔案固定為根目錄的 `index.html`、`styles.css` 與 `app.js`。

## 開發方式

- **GitHub Copilot Agent Mode**：根據完整需求建立待辦清單介面，並在後續需求中跨檔案加入深色模式與篩選功能。
- **MCP**：透過設定好的 MCP Server 查詢 Microsoft Learn 官方文件與 GitHub issue，將文件建議及 issue 內容納入開發與驗證。
- **`.github/prompts` agentic workflow**：使用 `fix-issue.prompt.md` 定義處理 issue 的步驟，包含讀取 issue、提出計畫、建立分支、修改、驗證、提交、推送與建立 Pull Request。
- **版本控制與 Pull Request**：針對 issue #2 與 issue #3 建立修復分支、完成驗證並開立 Pull Request，之後合併回 `main`。

## 我學到什麼

- 如何用 Agent Mode 從需求描述開始，逐步建立可操作的前端專案。
- 如何透過 MCP 讓 AI 查詢官方文件與 GitHub issue，取得更具體的開發依據。
- 如何使用 CSS 變數與 `prefers-color-scheme` 實作可保存偏好的淺色／深色模式。
- 如何把 issue 修正流程寫成可重複執行的 prompt，並配合分支與 Pull Request 管理變更。
- 如何透過瀏覽器互動測試與 JavaScript 語法檢查，驗證功能修正是否符合預期。
