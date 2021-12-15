# 批量下载文件

将需要下载的文件直接填写到 `list.json` 数组中即可进行批量下载。

这里主要是为了解决 `.m3u8` 系列的文件下载问题。只需要将文件中的下载文件列表整理成 JSON 的数组类型放置在 `list.json` 中即可。

### 安装

```
npm i
```

### 执行下载

```
node .
```

### 下载位置

默认执行下载后，文件会存储在当前目录的 `downloads` 文件夹中。

![image](https://user-images.githubusercontent.com/11046969/146113604-fe30b21e-8215-410c-9db8-661b039f9dc9.png)
