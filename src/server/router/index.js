const Router = require('koa-router');

const wsm = require('../../ws-manager');

const router = new Router();

module.exports = router;

router.get('/hello', async (ctx, next) => {
  await next();
  ctx.body = 'hello koa';
});

router.post('/ws', async (ctx, next) => {
  // const { request } = ctx;
  const { id } = ctx.request.body;
  console.log(`id: ${id}`);
  ctx.body = {
    type: 'message',
    message: 'connect success',
  };
  await next();
});

// router.post('/ws', wsm.routes());
