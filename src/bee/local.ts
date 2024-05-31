import Autobase from 'autobase'
import RemoteAutobase from './remote'
import Corestore from 'corestore'
import { apply, open } from './helpers'
import consola from 'consola'
import Hyperbee from 'hyperbee'

const logger = consola.withTag('bee')
const corestore = new Corestore('./.out/local-corestore')

logger.info('local', corestore)

await corestore.ready()

const LocalAutobase = new Autobase(corestore, RemoteAutobase.key, {
  open,
  apply,
  valueEncoding: 'binary',
})

// LocalAutobase.ready()

// await sync(LocalAutobase, RemoteAutobase)

logger.info(LocalAutobase)

const hypercore = corestore.get({
  name: 'hypercore',
})

await hypercore.ready()

logger.info('remote', hypercore)

const hyperbee = new Hyperbee(hypercore, {
  keyEncoding: 'utf-8',
  valueEncoding: 'binary',
})

await hyperbee.ready()

logger.info('local', await hyperbee.get('key2'))
