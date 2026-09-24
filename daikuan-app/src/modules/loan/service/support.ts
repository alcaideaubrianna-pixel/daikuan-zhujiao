import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as moment from 'moment';
import { randomUUID } from 'crypto';
import { SupportConversationEntity } from '../entity/support-conversation';
import { SupportMessageEntity } from '../entity/support-message';
import { UserInfoEntity } from '../../user/entity/info';

@Provide()
export class LoanSupportService extends BaseService {
  @InjectEntityModel(SupportConversationEntity)
  conversationRepo: Repository<SupportConversationEntity>;
  @InjectEntityModel(SupportMessageEntity)
  messageRepo: Repository<SupportMessageEntity>;
  @InjectEntityModel(UserInfoEntity)
  userRepo: Repository<UserInfoEntity>;

  async conversation(userId: number) {
    let conversation = await this.conversationRepo.findOneBy({ userId });
    if (!conversation)
      conversation = await this.conversationRepo.save({
        userId,
        status: 'open',
        userUnread: 0,
        staffUnread: 0,
      });
    return conversation;
  }

  async accessToken(conversationId: number) {
    const conversation = await this.conversationRepo.findOneBy({ id: conversationId });
    if (!conversation) throw new CoolCommException('会话不存在');
    if (!conversation.staffAccessToken) {
      conversation.staffAccessToken = randomUUID();
      await this.conversationRepo.save(conversation);
    }
    return conversation.staffAccessToken;
  }

  async publicMessages(token: string, afterId = 0) {
    const conversation = await this.conversationRepo.findOneBy({ staffAccessToken: token });
    if (!conversation) throw new CoolCommException('客服链接无效或已失效');
    const messages = await this.messageRepo.find({ where: { conversationId: conversation.id, id: MoreThan(afterId) }, order: { id: 'ASC' }, take: 100 });
    const user = await this.userRepo.findOne({ where: { id: conversation.userId }, select: ['id', 'phone', 'nickName', 'avatarUrl'] });
    return { conversation, user, messages };
  }

  async publicReply(token: string, content: string, attachment?: { url?: string; type?: string; name?: string }) {
    const conversation = await this.conversationRepo.findOneBy({ staffAccessToken: token });
    if (!conversation) throw new CoolCommException('客服链接无效或已失效');
    if ((!content?.trim() && !attachment?.url) || content?.length > 2000) throw new CoolCommException('消息内容不正确');
    const message = await this.messageRepo.save({ conversationId: conversation.id, senderType: 'staff', content: content?.trim() || '', messageType: attachment?.type || 'text', isRead: 0, attachmentUrl: attachment?.url, attachmentType: attachment?.type, attachmentName: attachment?.name });
    Object.assign(conversation, { lastMessage: content?.trim() || `[${attachment?.type === 'video' ? '视频' : '图片'}]`, lastMessageAt: moment().format('YYYY-MM-DD HH:mm:ss'), userUnread: conversation.userUnread + 1, staffUnread: 0 });
    await this.conversationRepo.save(conversation);
    return message;
  }

  async messages(userId: number, afterId = 0) {
    const conversation = await this.conversation(userId);
    const messages = await this.messageRepo.find({
      where: { conversationId: conversation.id, id: MoreThan(afterId) },
      order: { id: 'ASC' },
      take: 100,
    });
    if (conversation.userUnread) {
      conversation.userUnread = 0;
      await this.conversationRepo.save(conversation);
    }
    return { conversation, messages };
  }

  async messagesByConversation(conversationId: number, afterId = 0) {
    return this.messageRepo.find({ where: { conversationId, id: MoreThan(afterId) }, order: { id: 'ASC' }, take: 100 });
  }

  async sendUser(userId: number, content: string, attachment?: { url?: string; type?: string; name?: string }) {
    if ((!content?.trim() && !attachment?.url) || content?.trim().length > 2000)
      throw new CoolCommException('消息内容不正确');
    const conversation = await this.conversation(userId);
    const message = await this.messageRepo.save({
      conversationId: conversation.id,
      senderType: 'user',
      senderId: userId,
      content: content.trim(),
      messageType: 'text',
      isRead: 0,
      attachmentUrl: attachment?.url,
      attachmentType: attachment?.type,
      attachmentName: attachment?.name,
    });
    Object.assign(conversation, {
      lastMessage: content.trim(),
      lastMessageAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      staffUnread: conversation.staffUnread + 1,
    });
    await this.conversationRepo.save(conversation);
    return message;
  }

  async reply(conversationId: number, staffId: number, content: string) {
    if (!content?.trim() || content.trim().length > 2000)
      throw new CoolCommException('消息内容不正确');
    const conversation = await this.conversationRepo.findOneBy({
      id: conversationId,
    });
    if (!conversation) throw new CoolCommException('会话不存在');
    const message = await this.messageRepo.save({
      conversationId,
      senderType: 'staff',
      senderId: staffId,
      content: content.trim(),
      messageType: 'text',
      isRead: 0,
    });
    Object.assign(conversation, {
      staffId,
      lastMessage: content.trim(),
      lastMessageAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      userUnread: conversation.userUnread + 1,
      staffUnread: 0,
    });
    await this.conversationRepo.save(conversation);
    return message;
  }
}
