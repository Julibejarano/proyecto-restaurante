import { initSchema } from '~/server/utils/db'

export default defineNitroPlugin(async () => {
  await initSchema()
})
