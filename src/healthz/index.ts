import {get} from '../helper/client'
import {HealthzError} from '../helper/error'

export default (url) => async (): Promise<boolean> => {
  const resp = await get({url})
  if (resp.statusCode === 200 && resp.body === 'OK') return true
  throw new HealthzError(resp.body)
}
