export * from './Req';
export * from './plugins/cache/cache.plugin';
export * from './plugins/cache/Cache';
export * from './plugins/cancel/cancel.plugin';
export * from './plugins/retry/retry.plugin';
export * from './plugins/simplify/simplify.plugin';
export * from './plugins/codeHandler/codeHandler.plugin';

// const req = new Req({ baseURL: '' })
//   .use(SimplifyPlugin())
//   .use(CachePlugin())
//   .use(CancelPlugin())
//   .use(RetryPlugin());
// const post = req.useRetry({ times: 4 }).useCache({ enable: true }).simplifyMethodFactory('post');
// post<number>('10').then((res) => {
//   console.log(res);
// });
// req.cancelCurrent();
