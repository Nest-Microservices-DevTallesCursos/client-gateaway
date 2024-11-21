
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { object } from 'joi';
import { error } from 'console';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

    catch(exception: RpcException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if (rpcError.toString().includes('Empty response')) {
            return response.status(500).json({
                status:500,
                message:rpcError.toString().substring(0,rpcError.toString().indexOf('(')-1) 
            })
        }

        if (
            typeof rpcError == 'object' &&
            'status' in rpcError &&
            'message' in rpcError
        ) {
            const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
            return response.status(status).json(rpcError);
        }

        response.status(400).json({
            status: 400,
            massage: 'Internal Server Error',

        })


    }


}