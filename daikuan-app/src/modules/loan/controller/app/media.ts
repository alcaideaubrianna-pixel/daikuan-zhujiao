import {
  BaseController,
  CoolController,
  CoolCommException,
} from '@cool-midway/core';
import { Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PluginService } from '../../../plugin/service/info';
import { LoanMediaEntity } from '../../entity/media';
import * as fs from 'fs';

@CoolController()
export class AppLoanMediaController extends BaseController {
  @Inject() ctx;
  @Inject() pluginService: PluginService;
  @InjectEntityModel(LoanMediaEntity) mediaRepo: Repository<LoanMediaEntity>;

  @Post('/upload', { summary: '上传并登记申请材料' })
  async upload() {
    const purpose = String(this.ctx.fields?.purpose || 'other');
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(purpose))
      throw new CoolCommException('材料类型不正确');
    const source = this.ctx.files?.[0];
    if (!source) throw new CoolCommException('请选择需要上传的文件');
    const mimeType = String(source.mimeType || '');
    if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) {
      throw new CoolCommException('仅支持上传图片或视频材料');
    }
    const size = fs.statSync(source.data).size;
    const limit = mimeType.startsWith('video/') ? 100 : 20;
    if (size > limit * 1024 * 1024) {
      throw new CoolCommException(`文件大小不能超过${limit}MB`);
    }
    const uploader = await this.pluginService.getInstance('upload');
    const url = await uploader.upload(this.ctx);
    return this.ok(
      await this.mediaRepo.save({
        userId: this.ctx.user.id,
        purpose,
        url,
        fileName: source?.filename,
        size,
        mimeType,
        mediaType: mimeType.startsWith('video/') ? 'video' : 'image',
        status: 1,
      })
    );
  }

  @Get('/list', { summary: '我的申请材料' })
  async list(@Query('purpose') purpose?: string) {
    return this.ok(
      await this.mediaRepo.find({
        where: purpose
          ? { userId: this.ctx.user.id, purpose, status: 1 }
          : { userId: this.ctx.user.id, status: 1 },
        order: { id: 'DESC' },
      })
    );
  }
}
