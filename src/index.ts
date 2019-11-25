/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Server } from './server'

new Server().start(8080 || process.env.PORT)
