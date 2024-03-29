/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { createLogger, transports, format, config } from 'winston'

const { combine, json } = format
const { Console } = transports

/**
 * Error Levels
 * DEBUG     (7) Debug or trace information.
 * INFO      (6) Routine information, such as ongoing status or performance.
 * NOTICE    (5) Normal but significant events, such as start up, shut down, or a configuration change.
 * WARNING   (4) Warning events might cause problems.
 * ERROR     (3) Error events are likely to cause problems.
 * CRITICAL  (2) Critical events cause more severe problems or outages.
 * ALERT     (1) A person must take an action immediately.
 * EMERGENCY (0) One or more systems are unusable.
 */

/** Create custom formater for stackdriver on Google Cloud Run */
const stackdriver = format((info, opts) => {
    info.severity = info.level.toUpperCase()

    // fix for default levels
    if (info.severity === 'CRIT') info.severity = 'CRITICAL'
    if (info.severity === 'EMERG') info.severity = 'EMERGENCY'

    delete info.level

    if (info.module) {
        info.message = `[${info.module}] ${info.message}`
        delete info.module
    }

    return info
})

/** Logger object to use for general logging */
export const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: config.syslog.levels,
    format: combine(stackdriver(), json()),
    transports: [new Console()]
})
