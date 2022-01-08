export interface Headers {
  [key: string]: string
}

export default (secret): Headers => ({
  'X-Hasura-Role': 'admin',
  'X-Hasura-Admin-Secret': secret,
})
