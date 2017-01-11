greenDot
=============
    简单的node.js应用，输入用户id,node抓取用户主页的小绿点数据，然后借助chart.js生成相关数据的柱状图

##更新日志
* 2017.1.10 实现的是被动显示表格，在后端修改github用户名(user变量)，前端负责显示表格，无法交互
* 2017-1-11 实现前端交互，项目有三条路由，localhost:3000/对应输入github用户名页面，/user/:id路由对应在新页面显示表格，/ajax/:id对应ajax请求在当前页面显示表格。

##应用截图
![](https://github.com/imgss/greenDot/raw/master/image/chart.PNG "chart截图")

##ToDo
* 优化界面
* 增加数据库缓存来提高响应速度
* 增加支持图表种类  

##体验一下

git clone https://github.com/imgss/greenDot.git

npm install

node index(暂时)