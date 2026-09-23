import { CoolEvent, Event } from '@cool-midway/core';
import { Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanBankEntity } from '../entity/bank';
import { LoanCreditConfigEntity } from '../entity/credit-config';
import { LoanAgreementEntity } from '../entity/agreement';
import { LoanPageContentEntity } from '../entity/page-content';
import { LoanUserBankCardEntity } from '../entity/user-bank-card';
import { LoanProfileEntity } from '../entity/profile';
import { LoanNotificationEntity } from '../entity/notification';
import { UserInfoEntity } from '../../user/entity/info';
import { BaseSysMenuEntity } from '../../base/entity/sys/menu';

const DEFAULT_AGREEMENTS = [
  {
    code: 'PERSONAL_LOAN',
    title: '个人借款合同',
    content: '<h2>个人借款合同</h2><p>甲方（借款人）：以实名认证信息为准</p><p>乙方（出借方）：以最终放款主体展示信息为准</p><h3>一、借款基本信息</h3><p>借款金额、借款期限、年化利率、收款账户及还款计划以申请确认页和放款后的账单记录为准。</p><h3>二、借款用途</h3><p>借款人承诺按照申请时填写的用途使用借款，不用于法律法规禁止的领域。</p><h3>三、还款约定</h3><p>借款人应按照还款计划足额还款。发生逾期时，相关处理方式以实际签署版本及适用法律法规为准。</p><h3>四、合同生效</h3><p>借款人点击同意并提交申请，即表示已阅读、理解并接受本合同全部条款。正式合同主体信息将在审核及放款环节补充确认。</p>',
  },
  {
    code: 'CREDIT_AUTHORIZATION',
    title: '征信查询授权书',
    content: '<h2>征信查询授权书</h2><p>本人授权平台及依法开展业务的合作机构，在借款申请审核、风险管理及贷后管理所必需的范围内，向依法设立的信用信息服务机构查询、使用本人的信用信息。</p><h3>授权范围</h3><p>包括身份信息、信贷交易信息、公共信息及依法可以查询的其他信用信息。</p><h3>授权期限</h3><p>自本人确认授权之日起，至本次借款业务及相关权利义务履行完毕之日止；法律法规另有规定的，从其规定。</p><h3>本人声明</h3><p>本人已知悉查询信用信息可能产生查询记录，并确认本授权是本人真实、自愿的意思表示。</p>',
  },
  {
    code: 'PERSONAL_INFO_AUTHORIZATION',
    title: '个人信息使用授权书',
    content: '<h2>个人信息使用授权书</h2><p>为完成身份认证、额度评估、借款审核、合同签署、放款及还款管理，本人同意平台依法处理业务所必需的个人信息。</p><h3>信息范围</h3><p>包括身份信息、联系方式、银行卡信息、申请资料、设备及操作记录，以及本人主动提交的其他资料。</p><h3>处理目的</h3><p>用于身份核验、反欺诈、风险评估、客户服务、安全保障及履行法定义务。</p><h3>信息保护</h3><p>平台将采取合理的安全措施保护个人信息，并按照法律法规及隐私政策规定保存和处理。本人可依法行使查询、更正等权利。</p>',
  },
] as const;

const DEFAULT_PAGE_CONTENTS = [
  { key: 'about', title: '关于快贷', content: '<h2>快贷</h2><p>快贷致力于提供清晰、便捷、安全的借款申请与账单管理服务。</p><h3>服务能力</h3><p>用户可在线完成实名认证、资料提交、额度查看、借款申请、进度查询及账单管理。</p><h3>联系我们</h3><p>如有疑问，请通过 App 内在线客服与我们联系。服务时间：09:30-19:30。</p>' },
  { key: 'privacy', title: '隐私政策', content: '<h2>隐私政策</h2><p>我们重视您的个人信息和隐私安全，并按照合法、正当、必要和诚信原则处理个人信息。</p><h3>信息收集</h3><p>为提供身份认证、风险评估、借款申请和客户服务，我们可能收集身份信息、联系方式、银行卡信息以及您主动提交的申请资料。</p><h3>信息使用与保护</h3><p>相关信息仅用于提供服务、保障账户安全及履行法定义务。我们采取访问控制、加密传输等措施保护信息安全。</p><h3>您的权利</h3><p>您可以依法查询、更正个人信息，或通过在线客服联系我们处理相关请求。</p>' },
] as const;

const DEFAULT_BANKS = [
  ['ICBC', '中国工商银行', '工商银行'], ['ABC', '中国农业银行', '农业银行'],
  ['BOC', '中国银行', '中国银行'], ['CCB', '中国建设银行', '建设银行'],
  ['BOCOM', '交通银行', '交通银行'], ['PSBC', '中国邮政储蓄银行', '邮储银行'],
  ['CMB', '招商银行', '招商银行'], ['SPDB', '上海浦东发展银行', '浦发银行'],
  ['CITIC', '中信银行', '中信银行'], ['CEB', '中国光大银行', '光大银行'],
  ['HXB', '华夏银行', '华夏银行'], ['CMBC', '中国民生银行', '民生银行'],
  ['CIB', '兴业银行', '兴业银行'], ['PAB', '平安银行', '平安银行'],
  ['GDB', '广发银行', '广发银行'], ['CZB', '浙商银行', '浙商银行'],
  ['EGB', '恒丰银行', '恒丰银行'], ['CBHB', '渤海银行', '渤海银行'],
  ['BOB', '北京银行', '北京银行'], ['BOS', '上海银行', '上海银行'],
  ['GZCB', '广州银行', '广州银行'], ['JSB', '江苏银行', '江苏银行'],
  ['NJCB', '南京银行', '南京银行'], ['NBCB', '宁波银行', '宁波银行'],
  ['HZCB', '杭州银行', '杭州银行'], ['WZCB', '温州银行', '温州银行'],
  ['CQCB', '重庆银行', '重庆银行'], ['BOCD', '成都银行', '成都银行'],
  ['HKB', '汉口银行', '汉口银行'], ['CSCB', '长沙银行', '长沙银行'],
  ['XACB', '西安银行', '西安银行'], ['QDCCB', '青岛银行', '青岛银行'],
  ['ZZBANK', '郑州银行', '郑州银行'], ['LZBANK', '兰州银行', '兰州银行'],
  ['XMBANK', '厦门银行', '厦门银行'], ['JXBANK', '江西银行', '江西银行'],
  ['HEBBANK', '河北银行', '河北银行'], ['JLBANK', '吉林银行', '吉林银行'],
  ['HRBB', '哈尔滨银行', '哈尔滨银行'], ['BRCB', '北京农商银行', '北京农商银行'],
  ['SHRCB', '上海农商银行', '上海农商银行'], ['GRCB', '广州农商银行', '广州农商银行'],
  ['SRCB', '深圳农商银行', '深圳农商银行'], ['CQRCB', '重庆农商银行', '重庆农商银行'],
  ['WE_BANK', '深圳前海微众银行', '微众银行'], ['MYBANK', '浙江网商银行', '网商银行'],
  ['XW_BANK', '四川新网银行', '新网银行'], ['AI_BANK', '百信银行', '百信银行'],
  ['SUNING_BANK', '苏商银行', '苏商银行'], ['HSBC_CN', '汇丰银行（中国）', '汇丰银行'],
  ['SCB_CN', '渣打银行（中国）', '渣打银行'], ['CITI_CN', '花旗银行（中国）', '花旗银行'],
  ['DBS_CN', '星展银行（中国）', '星展银行'], ['BEA_CN', '东亚银行（中国）', '东亚银行'],
] as const;

@CoolEvent()
export class LoanBankEvent {
  @InjectEntityModel(LoanBankEntity)
  bankRepo: Repository<LoanBankEntity>;

  @InjectEntityModel(LoanCreditConfigEntity)
  creditConfigRepo: Repository<LoanCreditConfigEntity>;

  @InjectEntityModel(LoanAgreementEntity)
  agreementRepo: Repository<LoanAgreementEntity>;

  @InjectEntityModel(LoanPageContentEntity)
  pageContentRepo: Repository<LoanPageContentEntity>;

  @InjectEntityModel(LoanUserBankCardEntity)
  userBankCardRepo: Repository<LoanUserBankCardEntity>;

  @InjectEntityModel(LoanProfileEntity)
  profileRepo: Repository<LoanProfileEntity>;

  @InjectEntityModel(LoanNotificationEntity)
  notificationRepo: Repository<LoanNotificationEntity>;

  @InjectEntityModel(UserInfoEntity)
  userRepo: Repository<UserInfoEntity>;

  @InjectEntityModel(BaseSysMenuEntity)
  menuRepo: Repository<BaseSysMenuEntity>;

  @Inject()
  logger;

  @Event('onServerReady')
  async seedBanks() {
    const loanMenu = await this.menuRepo.findOne({ where: [{ name: '借款管理' }, { name: '借款业务' }] });
    if (loanMenu) {
      const supportMenu = await this.menuRepo.findOneBy({ router: '/loan/support' });
      const menuData = { parentId: loanMenu.id, name: '客服聊天', router: '/loan/support', type: 1, icon: 'ChatDotRound', viewPath: 'modules/loan/views/support.vue', orderNum: 90, keepAlive: false, isShow: true };
      if (!supportMenu) {
        await this.menuRepo.save(menuData);
        this.logger.info('Initialized loan support admin menu');
      } else if (supportMenu.viewPath !== menuData.viewPath || supportMenu.icon !== menuData.icon) {
        await this.menuRepo.update(supportMenu.id, { viewPath: menuData.viewPath, icon: menuData.icon, parentId: loanMenu.id, isShow: true });
        this.logger.info('Updated loan support admin menu');
      }
    }
    if (!(await this.bankRepo.count())) {
      await this.bankRepo.insert(
        DEFAULT_BANKS.map(([code, name, shortName], index) => ({
          code,
          name,
          shortName,
          orderNum: index + 1,
          status: 1,
        }))
      );
      this.logger.info(`Initialized ${DEFAULT_BANKS.length} default banks`);
    }
    if (!(await this.creditConfigRepo.count())) {
      await this.creditConfigRepo.save({
        minCredit: 250000,
        maxCredit: 300000,
        minLoanAmount: 1000,
        amountStep: 1000,
        annualRate: 7.2,
        terms: [3, 6, 12, 24, 36],
        status: 1,
      });
      this.logger.info('Initialized default loan credit config');
    }
    if (!(await this.agreementRepo.count())) {
      await this.agreementRepo.insert(
        DEFAULT_AGREEMENTS.map((agreement, index) => ({
          ...agreement,
          version: '1.0',
          orderNum: index + 1,
          status: 1,
        }))
      );
      this.logger.info('Initialized default loan agreements');
    }
    if (!(await this.pageContentRepo.count())) {
      await this.pageContentRepo.insert(DEFAULT_PAGE_CONTENTS.map(item => ({ ...item, version: '1.0', status: 1 })));
      this.logger.info('Initialized default app page contents');
    }
    if (!(await this.userBankCardRepo.count())) {
      const profiles = await this.profileRepo.find();
      const cards = profiles.filter(item => item.bankCode && item.bankName && item.bankCardNo).map(item => ({ userId: item.userId, bankCode: item.bankCode, bankName: item.bankName, cardNo: item.bankCardNo, lastFour: item.bankCardNo.slice(-4), isDefault: 1, status: 1 }));
      if (cards.length) await this.userBankCardRepo.insert(cards);
    }
    if (!(await this.notificationRepo.count())) {
      const users = await this.userRepo.findBy({ status: 1 });
      if (users.length) {
        await this.notificationRepo.insert(users.map(user => ({ userId: user.id, type: 'system', title: '欢迎使用快贷', content: '您可以在首页查看额度、提交借款申请，并在消息中心及时了解审核进度。', link: '/home' })));
      }
    }
  }
}
