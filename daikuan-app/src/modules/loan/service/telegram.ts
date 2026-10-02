import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CoolCommException } from '@cool-midway/core';
import { LoanTelegramConfigEntity } from '../entity/telegram-config';
import { SupportConversationEntity } from '../entity/support-conversation';
import { SupportMessageEntity } from '../entity/support-message';
import { UserInfoEntity } from '../../user/entity/info';
import axios from 'axios';

@Provide()
export class LoanTelegramService {
  @InjectEntityModel(LoanTelegramConfigEntity) configRepo: Repository<LoanTelegramConfigEntity>;
  @InjectEntityModel(SupportConversationEntity) conversationRepo: Repository<SupportConversationEntity>;
  @InjectEntityModel(UserInfoEntity) userRepo: Repository<UserInfoEntity>;
  @Inject() logger: any;
  private async firstConfig() {
    const rows = await this.configRepo.find({ order: { id: 'ASC' }, take: 1 });
    return rows[0];
  }
  async getConfig() { const c = await this.firstConfig(); return { enabled: Boolean(c?.enabled), chatId: c?.chatId || '', botTokenConfigured: Boolean(c?.botToken) }; }
  async saveConfig(input: any) {
    const current = await this.firstConfig(); const chatId = String(input.chatId ?? current?.chatId ?? '').trim(); const botToken = input.clearBotToken ? '' : String(input.botToken || current?.botToken || '').trim(); const enabled = Boolean(input.enabled);
    if (enabled && (!chatId || !botToken)) throw new CoolCommException('启用 Telegram 通知前请填写 Chat ID 和 Bot Token');
    const saved = await this.configRepo.save({ ...(current || {}), enabled: enabled ? 1 : 0, chatId, botToken });
    let testSuccess = false;
    let testError = '';
    if (enabled) {
      try {
        await this.call(saved.botToken, 'sendMessage', {
          chat_id: saved.chatId,
          text: `快贷 Telegram 通知测试成功\n时间：${new Date().toLocaleString('zh-CN')}`,
        });
        testSuccess = true;
      } catch (error) {
        testError = error?.message || String(error);
        this.logger.error(`Telegram 配置测试失败：${testError}`);
      }
    }
    return { enabled: Boolean(saved.enabled), chatId: saved.chatId, botTokenConfigured: Boolean(saved.botToken), testSuccess, testError };
  }
  async notify(conversation: SupportConversationEntity, input: { content?: string; attachmentUrl?: string; attachmentType?: string }) {
    const config = await this.firstConfig(); if (!config?.enabled || !config.botToken || !config.chatId) return;
    try {
      const user = await this.userRepo.findOne({ where: { id: conversation.userId }, select: ['id', 'phone', 'nickName'] }); let topicId = conversation.telegramTopicId;
      if (!topicId) { const topic = await this.call(config.botToken, 'createForumTopic', { chat_id: config.chatId, name: `用户 ${user?.phone || conversation.userId}` }); topicId = Number(topic.message_thread_id); await this.conversationRepo.update(conversation.id, { telegramTopicId: topicId }); }
      const text = `手机号：${user?.phone || '未知'}\n消息：${input.content || ''}`.trim(); const common = { chat_id: config.chatId, message_thread_id: topicId };
      if (input.attachmentType === 'image' && input.attachmentUrl) await this.call(config.botToken, 'sendPhoto', { ...common, photo: input.attachmentUrl, caption: text }); else if (input.attachmentType === 'video' && input.attachmentUrl) await this.call(config.botToken, 'sendVideo', { ...common, video: input.attachmentUrl, caption: text }); else await this.call(config.botToken, 'sendMessage', { ...common, text: text || '用户发送了一条消息' });
    } catch (error) { this.logger.error(`Telegram 客服通知失败: ${error?.message || error}`); }
  }
  private async call(token: string, method: string, body: Record<string, any>) {
    const proxyValue = process.env.HTTPS_PROXY || process.env.https_proxy;
    const proxyUrl = proxyValue ? new URL(proxyValue) : undefined;
    const response = await axios.post(`https://api.telegram.org/bot${token}/${method}`, body, {
      timeout: 15000,
      proxy: proxyUrl ? { protocol: proxyUrl.protocol.replace(':', ''), host: proxyUrl.hostname, port: Number(proxyUrl.port), auth: proxyUrl.username ? { username: decodeURIComponent(proxyUrl.username), password: decodeURIComponent(proxyUrl.password) } : undefined } : undefined,
    });
    const result = response.data;
    if (!result?.ok) throw new Error(result?.description || `Telegram ${method} failed`);
    return result.result;
  }
}
