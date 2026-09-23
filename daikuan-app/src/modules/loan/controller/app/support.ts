import { BaseController, CoolController, CoolTag, TagTypes } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { LoanSupportService } from '../../service/support';
import { PluginService } from '../../../plugin/service/info';
import * as fs from 'fs';
import { CoolCommException } from '@cool-midway/core';

@CoolController()
export class AppLoanSupportController extends BaseController {
  @Inject() ctx;
  @Inject() loanSupportService: LoanSupportService;
  @Inject() pluginService: PluginService;
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/public/messages', { summary: '免登录客服消息' }) async publicMessages(@Query('token') token: string) {
    return this.ok(await this.loanSupportService.publicMessages(token));
  }
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/public/reply', { summary: '免登录客服回复' }) async publicReply(@Body('token') token: string, @Body('content') content: string) {
    return this.ok(await this.loanSupportService.publicReply(token, content));
  }
  @Get('/messages', { summary: '客服聊天记录' }) async messages(
    @Query('afterId') afterId?: number
  ) {
    return this.ok(
      await this.loanSupportService.messages(
        this.ctx.user.id,
        Number(afterId || 0)
      )
    );
  }
  @Post('/send', { summary: '发送客服消息' }) async send(
    @Body('content') content: string,
    @Body('attachment') attachment?: { url?: string; type?: string; name?: string }
  ) {
    return this.ok(
      await this.loanSupportService.sendUser(this.ctx.user.id, content, attachment)
    );
  }
  @Post('/upload', { summary: '客服附件上传' }) async upload() {
    const source = this.ctx.files?.[0];
    if (!source) throw new CoolCommException('请选择图片或视频');
    const mimeType = String(source.mimeType || '');
    if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) throw new CoolCommException('仅支持图片或视频');
    const size = fs.statSync(source.data).size;
    if (size > (mimeType.startsWith('video/') ? 100 : 20) * 1024 * 1024) throw new CoolCommException('文件超过大小限制');
    const uploader = await this.pluginService.getInstance('upload');
    return this.ok({ url: await uploader.upload(this.ctx), type: mimeType.startsWith('video/') ? 'video' : 'image', name: source.filename });
  }
}
