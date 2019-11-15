import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('api/test')
export default class UserController {

    @Get()
    private getAll(req: Request, res: Response): void {
        res.status(200).json({ msg: 'get_all_called' })
    }

    @Post()
    private add(req: Request, res: Response): void {
        res.status(200).json({ msg: 'add_called' })
    }
}
