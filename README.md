# use-axios
使用插件的方式封装axios

在request-template基础上，使用插件方式优化

# 理想情况

```ts
import { useAxios } from "./useAxios";
import { CachePlugin } from "./cache.plugin";

const request = useAxios().use(CachePlugin({timeout:2000})).use(RetryPlugin());
request.request();
request.useCache({enable:true}).request(); // 
request.useRetry({times:3}).request(); // 
```

# 不好解决的问题

extends里的方法不好返回最新扩充后的对象，extends不好劫持生命周期