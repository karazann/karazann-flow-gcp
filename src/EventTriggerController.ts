import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('flow/trigger')
export default class UserController {

    @Post()
    private trigger(req: Request, res: Response): void {
        console.log(req.body)
        res.status(200).json({ msg: 'add_called' })
    }
}
