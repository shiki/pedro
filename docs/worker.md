# Worker

For queueing and running long tasks in the background, it looks like these are what are available:

* [webworker-threads](https://github.com/audreyt/node-webworker-threads)
* [kue](https://github.com/Automattic/kue)

I would still need to run a separate process that infinitely loops and fetches from the Phisix API. I could probably use [cluster](https://nodejs.org/api/cluster.html) for this. Then, for every stock processed, run a webworker-thread. Using Kue is probably too complicated right now for my situation because it requires Redis.

I only have 1 CPU in DigitalOcean. However, I would need 2 forks. I have read that this should be fine but [there would not be a huge performance gain](https://stackoverflow.com/a/32533075). Maybe I can do a `cron` job using [node-cron](https://github.com/kelektiv/node-cron) instead. 