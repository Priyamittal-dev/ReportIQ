import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'List all clients for the agency' })
  findAll(@Req() req: any) {
    return this.clientsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details with recent reports' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.clientsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new client' })
  create(@Body() dto: CreateClientDto, @Req() req: any) {
    return this.clientsService.create(req.user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client details' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @Req() req: any) {
    return this.clientsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a client' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.clientsService.remove(id, req.user.id);
  }
}
