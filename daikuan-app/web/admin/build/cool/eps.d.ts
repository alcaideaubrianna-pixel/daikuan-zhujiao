declare namespace Eps {
	interface BaseSysDepartmentEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanAgreementEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanApplicationEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanBankEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanCreditConfigEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanMediaEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanNotificationEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanPageContentEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanProfileEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanReviewLogEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SupportMessageEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SupportConversationEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LoanUserBankCardEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserSmsCodeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: BaseSysLogEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: BaseSysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: BaseSysParamEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: BaseSysRoleEntity[];
	}

	interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: BaseSysUserEntity[];
	}

	interface DemoGoodsPageResponse {
		pagination: PagePagination;
		list: DemoGoodsEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface LoanAgreementPageResponse {
		pagination: PagePagination;
		list: LoanAgreementEntity[];
	}

	interface LoanApplicationPageResponse {
		pagination: PagePagination;
		list: LoanApplicationEntity[];
	}

	interface LoanBankPageResponse {
		pagination: PagePagination;
		list: LoanBankEntity[];
	}

	interface LoanCreditConfigPageResponse {
		pagination: PagePagination;
		list: LoanCreditConfigEntity[];
	}

	interface LoanMediaPageResponse {
		pagination: PagePagination;
		list: LoanMediaEntity[];
	}

	interface LoanNotificationPageResponse {
		pagination: PagePagination;
		list: LoanNotificationEntity[];
	}

	interface LoanPageContentPageResponse {
		pagination: PagePagination;
		list: LoanPageContentEntity[];
	}

	interface LoanProfilePageResponse {
		pagination: PagePagination;
		list: LoanProfileEntity[];
	}

	interface LoanReviewLogPageResponse {
		pagination: PagePagination;
		list: LoanReviewLogEntity[];
	}

	interface LoanSupportMessagePageResponse {
		pagination: PagePagination;
		list: SupportMessageEntity[];
	}

	interface LoanSupportPageResponse {
		pagination: PagePagination;
		list: SupportConversationEntity[];
	}

	interface LoanUserBankCardPageResponse {
		pagination: PagePagination;
		list: LoanUserBankCardEntity[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface UserSmsCodePageResponse {
		pagination: PagePagination;
		list: UserSmsCodeEntity[];
	}

	interface BaseCoding {
		/**
		 * getModuleTree
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * createCode
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Request;
	}

	interface BaseComm {
		/**
		 * personUpdate
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * uploadMode
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * permmenu
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * program
		 */
		program(data?: any): Promise<any>;

		/**
		 * person
		 */
		person(data?: any): Promise<any>;

		/**
		 * upload
		 */
		upload(data?: any): Promise<any>;

		/**
		 * logout
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Request;
	}

	interface BaseOpen {
		/**
		 * refreshToken
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * captcha
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * login
		 */
		login(data?: any): Promise<any>;

		/**
		 * html
		 */
		html(data?: any): Promise<any>;

		/**
		 * eps
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * order
		 */
		order(data?: any): Promise<any>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysLog {
		/**
		 * setKeep
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * getKeep
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * clear
		 */
		clear(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * create
		 */
		create(data?: any): Promise<any>;

		/**
		 * export
		 */
		export(data?: any): Promise<any>;

		/**
		 * import
		 */
		import(data?: any): Promise<any>;

		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * parse
		 */
		parse(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysParam {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * html
		 */
		html(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysRole {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysUser {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * move
		 */
		move(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoGoods {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoTenant {
		/**
		 * noTenant
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * noUse
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string };

		/**
		 * 权限状态
		 */
		_permission: { noTenant: boolean; noUse: boolean; use: boolean };

		request: Request;
	}

	interface DictInfo {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * types
		 */
		types(data?: any): Promise<any>;

		/**
		 * data
		 */
		data(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictType {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LoanAgreement {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanAgreementEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanAgreementEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanAgreementPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LoanApplication {
		/**
		 * review
		 */
		review(data?: any): Promise<any>;

		/**
		 * detail
		 */
		detail(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanApplicationEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanApplicationEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanApplicationPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { review: string; detail: string; info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: {
			review: boolean;
			detail: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface LoanBank {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanBankEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanBankEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanBankPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LoanCreditConfig {
		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanCreditConfigEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanCreditConfigEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanCreditConfigPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { update: string; info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { update: boolean; info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface LoanMedia {
		/**
		 * info
		 */
		info(data?: any): Promise<LoanMediaEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanMediaEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanMediaPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface LoanNotification {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanNotificationEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanNotificationEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanNotificationPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; info: string; list: string; page: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: { delete: boolean; info: boolean; list: boolean; page: boolean; add: boolean };

		request: Request;
	}

	interface LoanPageContent {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<LoanPageContentEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanPageContentEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanPageContentPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LoanProfile {
		/**
		 * info
		 */
		info(data?: any): Promise<LoanProfileEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanProfileEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanProfilePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface LoanReviewLog {
		/**
		 * info
		 */
		info(data?: any): Promise<LoanReviewLogEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanReviewLogEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanReviewLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface LoanSupportMessage {
		/**
		 * info
		 */
		info(data?: any): Promise<SupportMessageEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SupportMessageEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanSupportMessagePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface LoanSupport {
		/**
		 * accesstoken
		 */
		accesstoken(data?: any): Promise<any>;

		/**
		 * stream
		 */
		stream(data?: any): Promise<any>;

		/**
		 * reply
		 */
		reply(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<SupportConversationEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SupportConversationEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanSupportPageResponse>;

		/**
		 * 权限标识
		 */
		permission: {
			accesstoken: string;
			stream: string;
			reply: string;
			info: string;
			list: string;
			page: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			accesstoken: boolean;
			stream: boolean;
			reply: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface LoanUserBankCard {
		/**
		 * info
		 */
		info(data?: any): Promise<LoanUserBankCardEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<LoanUserBankCardEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<LoanUserBankCardPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface PluginInfo {
		/**
		 * install
		 */
		install(data?: any): Promise<any>;

		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RecycleData {
		/**
		 * restore
		 */
		restore(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * page
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Request;
	}

	interface SpaceInfo {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceType {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TaskInfo {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * start
		 */
		start(data?: any): Promise<any>;

		/**
		 * once
		 */
		once(data?: any): Promise<any>;

		/**
		 * stop
		 */
		stop(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * page
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * log
		 */
		log(data?: any): Promise<any>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAddress {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAuthConfig {
		/**
		 * save
		 */
		save(data?: any): Promise<any>;

		/**
		 * get
		 */
		get(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { save: string; get: string };

		/**
		 * 权限状态
		 */
		_permission: { save: boolean; get: boolean };

		request: Request;
	}

	interface UserInfo {
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;

		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * add
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserSmsCode {
		/**
		 * update
		 */
		update(data?: any): Promise<any>;

		/**
		 * info
		 */
		info(data?: any): Promise<UserSmsCodeEntity>;

		/**
		 * list
		 */
		list(data?: any): Promise<UserSmsCodeEntity[]>;

		/**
		 * page
		 */
		page(data?: any): Promise<UserSmsCodePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { update: string; info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { update: boolean; info: boolean; list: boolean; page: boolean };

		request: Request;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	type Service = {
		request: Request;

		base: {
			coding: BaseCoding;
			comm: BaseComm;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		loan: {
			agreement: LoanAgreement;
			application: LoanApplication;
			bank: LoanBank;
			creditConfig: LoanCreditConfig;
			media: LoanMedia;
			notification: LoanNotification;
			pageContent: LoanPageContent;
			profile: LoanProfile;
			reviewLog: LoanReviewLog;
			supportMessage: LoanSupportMessage;
			support: LoanSupport;
			userBankCard: LoanUserBankCard;
		};
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: {
			address: UserAddress;
			authConfig: UserAuthConfig;
			info: UserInfo;
			smsCode: UserSmsCode;
		};
	};
}
