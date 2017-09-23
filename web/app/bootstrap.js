import cluster from 'cluster'

import api from './api/api'
import gatherer from './gatherer/gatherer'

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  cluster.fork({ PEDRO_FORK_TYPE: 'api' })
  cluster.fork({ PEDRO_FORK_TYPE: 'gatherer' })
} else {
  const forkType = process.env.PEDRO_FORK_TYPE
  console.log(`Worker ${process.pid} started: ${forkType}`)
  if (forkType === 'gatherer') {
    gatherer.start()
  } else {
    api.start()
  }
}
