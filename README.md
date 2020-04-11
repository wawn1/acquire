# acquire
使用typescript封装XMLHttpRequest，实现网络请求

### 拦截器
使用双向链表+Map存储拦截器
通过promise链的方式执行拦截器和请求

### 取消功能
````javascipt
cancelToken?: CancelToken
````
Acquire函数对象上的属性

- CancelToken，是一个类，可以new一个cancelToken对象放入config
  CancelToken的构造函数，接收外部回调函数，向回调函数注入一个cancel函数，函数的功能是控制内部promise成功，从而abort请求
  CancelToken类提供静态方法source，可以直接拿到一个包含CancelToken实例和cancel功能的函数
- Cancel, 消息记录类，acquire请求失败的promise可以catch这个类的对象e
- isCancel，可以判断失败对象e是不是Cancel类的消息对象
