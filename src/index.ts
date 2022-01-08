// export {default as schema} from './schema'
import * as process
  from 'process'
import {URL} from 'url'

interface Options {
  hasura_base?: string
  admin_secret?: string
  api_metadata?: string
  api_health?: string
  api_schema?: string
  api_pgdump?: string
}

import createHeaders
  from './helper/headers'
import {
  default as metadata,
  MetadataSDK,
} from './metadata'
import {
  default as schema,
  SchemaSDK,
} from './schema'
import {
  default as healthz,
} from './healthz'
import {
  default as pgdump,
  PGDumpArgs,
} from './pgdump'

export interface HasuraSDK {
  metadata: MetadataSDK
  schema: SchemaSDK
  healthz: () => Promise<boolean>,
  pgdump: (args: PGDumpArgs) => Promise<string>,
}

export default (opt?: Options): HasuraSDK => {
  const hasura_base = opt?.hasura_base || process.env.HASURA_BASE
  const admin_secret = opt?.admin_secret || process.env.HASURA_ADMIN_SECRET
  const api_metadata = opt?.api_metadata || process.env.HASURA_GRAPHQL_METADATA_API || '/v1/metadata'
  const api_schema = opt?.api_schema || process.env.HASURA_GRAPHQL_SCHEMA_API || '/v2/query'
  const api_health = opt?.api_health || process.env.HASURA_GRAPHQL_HEALTH_API || '/healthz'
  const api_pgdump = opt?.api_pgdump || process.env.HASURA_GRAPHQL_PGDUMP_API || '/v1alpha1/pg_dump'

  if (!admin_secret) throw new Error('admin_secret || env.HASURA_ADMIN_SECRET  is required')
  if (!hasura_base) throw new Error('hasura_base || env.HASURA_BASE is required')

  const adminHeaders = createHeaders(admin_secret)

  const metadata_url = new URL(api_metadata, hasura_base)
  const metadata_api = metadata(metadata_url, adminHeaders)

  const schema_url = new URL(api_schema, hasura_base)
  const schema_api = schema(schema_url, adminHeaders)

  const pgdump_url = new URL(api_pgdump, hasura_base)
  const pgdump_api = pgdump(pgdump_url, adminHeaders)

  const health_url = new URL(api_health, hasura_base)
  const healthz_api = healthz(health_url)

  return {
    metadata: metadata_api,
    schema: schema_api,
    pgdump: pgdump_api,
    healthz: healthz_api,
  }
}
