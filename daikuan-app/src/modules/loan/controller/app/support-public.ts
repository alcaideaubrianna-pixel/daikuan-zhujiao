import { BaseController, CoolController, CoolTag, TagTypes } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import * as fs from 'fs';
import { CoolCommException } from '@cool-midway/core';
import { PluginService } from '../../../plugin/service/info';
import { LoanSupportService } from '../../service/support';

@CoolController('/public')
export class AppLoanSupportPublicController extends BaseController {
  @Inject() ctx;
  @Inject() loanSupportService: LoanSupportService;
  @Inject() pluginService: PluginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/upload', { summary: '客服附件上传' }) async upload() {
    const token = String(this.ctx.fields?.token || '');
    await this.loanSupportService.publicMessages(token);
    const source = this.ctx.files?.[0];
    if (!source) throw new CoolCommException('请选择图片或视频');
    const mimeType = String(source.mimeType || '');
    if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) throw new CoolCommException('仅支持图片或视频');
    const size = fs.statSync(source.data).size;
    if (size > (mimeType.startsWith('video/') ? 100 : 20) * 1024 * 1024) throw new CoolCommException('文件超过大小限制');
    const uploader = await this.pluginService.getInstance('upload');
    return this.ok({ url: await uploader.upload(this.ctx), type: mimeType.startsWith('video/') ? 'video' : 'image', name: source.filename });
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/messages', { summary: '客服分享链接消息' }) async messages(@Query('token') token: string, @Query('afterId') afterId?: number) {
    return this.ok(await this.loanSupportService.publicMessages(token, Number(afterId || 0)));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/reply', { summary: '客服分享链接回复' }) async reply(@Body('token') token: string, @Body('content') content: string, @Body('attachment') attachment?: { url?: string; type?: string; name?: string }) {
    return this.ok(await this.loanSupportService.publicReply(token, content, attachment));
  }
}
