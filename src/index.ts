import { Req } from './Req';

const p1 = {
  extends: {
    hello() {
      return 'world';
    },
  },
};
const t = new Req().use(p1).use({
  extends: {
    foo() {
      return 'bar';
    },
    test(this: Req, p: number) {
      console.log(p);
      return this; // 怎么让this包含hello和foo两个方法呢
    },
  },
});
t.hello();
t.hello();
t.hello();
t.test(2).request({});
t.test(3).hello();
t.test(2).hello(); // error test()的返回值类型不包含hello和foo
t.test(3).request({ headers: {} });
