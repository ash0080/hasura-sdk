import genSDK
  from '../../src'

export const {
  healthz,
  metadata,
  schema,
  pgdump,
} = genSDK()
