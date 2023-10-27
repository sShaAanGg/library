This is a web application with CI supported by github action and automated pytest-playwright testing.  
To test it in local envrionment, install the dependencies specified in [test.yml](https://github.com/sShaAanGg/library/blob/origin/.github/workflows/test.yml).

Note: You can install and run MySQL DB server through Docker.

---

- 安裝nodeJS，版本要求：14.21.3 → 一定要這個版本，可以用nvm切換NodeJS版本
- 前後端需要分別開一個terminal

### back-end

```
**Terminal**
npm install
npm run start
```

### front-end

```
**Terminal**
npm install
npm run serve
```

- 開啟 http://localhost:8080/

### 資料庫schema
[init.sql](https://github.com/fangci221/library/blob/origin/init.sql)
