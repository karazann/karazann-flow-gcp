import {Logging} from '@google-cloud/logging'

const logging = new Logging()
export const log = logging.log('test')