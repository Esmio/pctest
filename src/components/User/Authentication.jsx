import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/User/profile.less';
import Input from './ProfileInput';
import { type as TYPE } from '../../utils/';
import { getValidatePic } from '../../utils/API';
import { OrangeButton, MDIcon, Button, LoadingBar } from '../General/';

class Register extends Component {
	constructor(props) {
		super(props);
		this.dispatch = this.props.dispatch.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
		this.isRegister = false;
	}
	componentWillMount() {
		this.dispatch({ type: 'formModel/getBrowserUniqueId' });
		this.dispatch({
			type: 'formModel/initializeState',
			payload: [
				'password', 'repeatPassword', 'varifyCode', 'varifyPassed',
				'userAgreed', 'responseMsg',
			]
		});
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.authenticationState !== this.props.authenticationState) {
			this.dispatch({ type: 'formModel/getBrowserUniqueId' });
		}
		this.isRegister = (
			nextProps.authenticationState === 'REGISTER' ||
			nextProps.authenticationState === 'GUEST_REGISTER'
		);
		this.isGuestRegister = (
			nextProps.authenticationState === 'GUEST_REGISTER'
		);
	}
	componentWillUnmount() {
		this.dispatch({ type:
			'userModel/initializeState',
			payload: ['awaitingResponse', 'authenticationState']
		});
		this.dispatch({
			type: 'formModel/initializeState',
			payload: [
				'username', 'password', 'repeatPassword',
				'varifyCode', 'varifyPassed', 'userAgreed',
				'responseMsg', 'affCode'
			]
		});
	}
	onGuestAccountToggle() {
		this.dispatch({
			type: 'formModel/initializeState',
			payload: ['username', 'password', 'repeatPassword', 'varifyCode', 'responseMsg']
		});
		if (this.isGuestRegister) {
			this.dispatch({
				type: 'userModel/updateState',
				payload: { authenticationState: 'REGISTER' }
			});
		} else { 
			this.dispatch({
				type: 'userModel/updateState',
				payload: { authenticationState: 'GUEST_REGISTER' }
			});
			this.dispatch({ type: 'userModel/postPreRegisterGuest' });
		}
	}
	onSubmitClick() {
		this.dispatch({ type: 'userModel/postRegistration' });
	}
	onSwapRegisterState(authenticationState) {
		this.dispatch({
			type: 'formModel/initializeState',
			payload: ['username', 'password', 'repeatPassword', 'varifyCode', 'responseMsg']
		});
		this.dispatch({ type: 'userModel/updateState', payload: { authenticationState } });
	}
	onLoginClick() {
		this.dispatch({ type: 'userModel/putUserLogin' });
	}
	onReloadClick() {
		this.dispatch({ type: 'formModel/getBrowserUniqueId' });
		this.dispatch({ type: 'formModel/initializeState', payload: ['varifyCode', 'varifyPassed'] });
	}
	onInputChange(event) {
		event.persist();
		this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      this.dispatch({
        type: 'formModel/updateState', payload
      });
    }
  }
	onModalClose() {
		this.dispatch({
      type: 'layoutModel/updateState',
      payload: {
        shouldShowProfileModal: false,
        shouldShowAuthModel: false
      }
    });
	}
  validateInput(payload) {
    this.dispatch({ type: 'formModel/validateInput', payload });
  }
  validateRepeatInput(payload) {
    this.dispatch({ type: 'formModel/validateRepeatInput', payload });
  }
	validateVarifyCode() {
		this.dispatch({ type: 'formModel/getValidatePic' });
	}
	validateUsername(payload) {
    this.dispatch({ type: 'formModel/getUsernameExistState', payload });
	}
	toggleAgreeCheckbox() {
		this.dispatch({ type: 'userModel/toggleAgree' });
	}
	renderResponseMsg() {
    const { responseMsg } = this.props;
    const { msg, color, icon } = responseMsg;
    if (msg) {
      return (
        <div
          style={{ backgroundColor: color }}
          className={css.profile_formResponse}
        >
          <MDIcon iconName={icon} />
          <span>{ msg }</span>
        </div>
      );
    } return null;
  }
	renderUsernameInput() {
		const { username, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = username;
		return (
			<Input
				disabled={awaitingResponse}
				dataColor={color}
				dataIcon={icon}
				dataMsg={inputMsg}
				label={`${TYPE.inputFieldRefs.username}`}
				min="5" max="12"
				name="username"
				onBlur={this.validateUsername.bind(this)}
				onChange={this.onInputChange.bind(this)}
				pattern="^[A-Za-z0-9]\w{4,12}$"
				placeholder="请输入字母和数字组成的5-12个字符"
				value={value}
			/>
		);
	}
	renderPasswordInput() {
    const { password, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = password;
    return (
      <Input
				disabled={awaitingResponse}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.password}`}
        min="6" max="12"
        name="password"
        onBlur={this.validateInput.bind(this)}
        onChange={this.onInputChange.bind(this)}
        pattern="^[A-Za-z0-9]\w{5,11}$"
        placeholder="请输入字母和数字组成的6-12个字符"
        type="password"
        value={value}
      />
    );
  }
	renderRepeatPasswordInput() {
    const { repeatPassword, awaitingResponse } = this.props;
		if (this.isRegister && !this.isGuestRegister) {
			const { value, inputMsg, icon, color } = repeatPassword;
			return (
				<Input
					disabled={awaitingResponse}
					dataColor={color}
					dataIcon={icon}
					dataMsg={inputMsg}
					label={`${TYPE.inputFieldRefs.repeatPassword}`}
					min="6" max="12"
					name="repeatPassword"
					onBlur={this.validateRepeatInput.bind(this)}
					onChange={this.onInputChange.bind(this)}
					pattern="^[A-Za-z0-9]\w{5,11}$"
					placeholder="请输入字母和数字组成的6-12个字符"
					type="password"
					value={value}
				/>
			);
		} return null;
  }
	renderAffcodeInput() {
		const { affCode, awaitingResponse } = this.props;
		const { value, inputMsg, icon, color } = affCode;
		if (this.isRegister && !this.isGuestRegister) {
			return (
				<Input
					disabled={awaitingResponse}
					dataColor={color}
					dataIcon={icon}
					dataMsg={inputMsg}
					label={`${TYPE.inputFieldRefs.affCode}`}
					min="6" max="20"
					name="affCode"
					onBlur={this.validateInput.bind(this)}
					onChange={this.onInputChange.bind(this)}
					pattern="[A-Za-z0-9]{5,21}$"
					placeholder="请输入字母和数字组成的6-20个字符"
					value={value}
				/>
			);
		}
	}
	renderVarifyPic() {
		const { webUniqueCode, varifyCode, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = varifyCode;
		return (
			<div className={css.profile_inputBox}>
				<Input
					disabled={awaitingResponse}
					dataColor={color}
					dataIcon={icon}
					dataMsg={inputMsg}
					label={`${TYPE.inputFieldRefs.varifyCode}`}
					min="6" max="6"
					name="varifyCode"
					onBlur={this.validateInput.bind(this)}
					onChange={this.onInputChange.bind(this)}
					onKeyPress={this.onInputKeyPress}
					pattern="^[0-9]\w{5}$"
					placeholder="请输入六位数验证码"
					value={value}
				/>
				<div>
					<img
						className={css.profile_varifyPic}
						src={`${getValidatePic}?webUniqueCode=${webUniqueCode}`}
						alt="验证码"
					/>
					<button
						disabled={awaitingResponse}
						onClick={this.onReloadClick.bind(this)}
						className={css.profile_reloadBtn}
					>
						<MDIcon iconName="reload" /><i>换另一张照片</i>
					</button>
				</div>
			</div>
		);
	}
	renderAgreementCheckbox() {
		const { userAgreed, awaitingResponse } = this.props;
		if (this.isRegister) {
			return (
				<div
					className={css.profile_checkBox}
				>
					<button
						disabled={awaitingResponse}
						onClick={this.toggleAgreeCheckbox.bind(this)}
						className={css.profile_checkBoxLabel}
					>
						<MDIcon
							iconName={userAgreed ? 'checkbox-marked' : 'checkbox-blank'}
							className={css.profile_checkBoxIcon}
						/>
						<span>我已看过并同意</span>
					</button>
					<button
						className={css.profile_agreementBtn}
					>《用户购彩服务协议》</button>
				</div>
			);
		}
	}
	renderBtnRow() {
		const {
			userAgreed, password, repeatPassword, username,
			awaitingResponse, authenticationState, varifyCode
		} = this.props;
		let readyToSubmit = false;
		let btnPlaceHolder = '获取试玩账号';
		if (this.isGuestRegister) { btnPlaceHolder = '注册普通账号'; }
		if (this.isRegister) {
			readyToSubmit = 
				username.value && userAgreed && varifyCode.value 
				&& (
					this.isGuestRegister ? password.value !== undefined :
					password.value === repeatPassword.value
				);
			return (
				<div className={css.profile_formBtnRow}>
					<OrangeButton
						disabled={!readyToSubmit || awaitingResponse}
						className={css.profile_formSubmitBtn}
						onClick={this.onSubmitClick.bind(this)}
						placeholder={`立即${TYPE[authenticationState]}`}
					/>
					<Button
						className={css.profile_guestRegisterBtn}
						disabled={awaitingResponse}
						onClick={this.onGuestAccountToggle.bind(this)}
						placeholder={btnPlaceHolder}
					/>
				</div>
			);
		}
		readyToSubmit = username.value && password.value && varifyCode.value;
		return (
			<div className={css.profile_formBtnRow}>
				<OrangeButton
					disabled={!readyToSubmit || awaitingResponse}
					className={css.profile_formSubmitBtn}
					onClick={this.onLoginClick.bind(this)}
					placeholder={`立即${TYPE[authenticationState]}`}
				/>
			</div>
		);
	}
	renderRedirectBtnRow() {
		if (this.isRegister) {
			return (
				<div className={css.profile_formBtnRow}>
					<p className={css.profile_registerFooter}>
						已有账号？
						<a onClick={this.onSwapRegisterState.bind(this, 'LOGIN')}>点这里登录</a>
					</p>
				</div>
			);
		}
		return (
			<div className={css.profile_formBtnRow}>
				<p className={css.profile_registerFooter}>
					没有账号？
					<a onClick={this.onSwapRegisterState.bind(this, 'REGISTER')}>点这里注册一个</a>
				</p>
			</div>
		);
	}
	render() {
		const { awaitingResponse, authenticationState } = this.props;
		return (
			<div className={css.profile_contentBody}>
				<h4 className={css.profile_formLabel}>
					用户{TYPE[authenticationState]}
					<button
            onClick={this.onModalClose.bind(this)}
            className={css.profile_popUpCloseBtn}
					>
            <i>关闭</i><MDIcon iconName="window-close" />
          </button>
					<LoadingBar duration="2s" isLoading={awaitingResponse} />
				</h4>
				{ this.renderUsernameInput() }
				{ this.renderPasswordInput() }
				{ this.renderRepeatPasswordInput() }
				{ this.renderAffcodeInput() }
				{ this.renderVarifyPic() }
				{ this.renderAgreementCheckbox() }
				{ this.renderResponseMsg() }
				{ this.renderBtnRow() }
				{ this.renderRedirectBtnRow() }
			</div>
		);
	}
}

const mapStatesToProps = ({ userModel, formModel }) => {
	const {
		userAgreed, awaitingResponse, authenticationState
	} = userModel;
	return {
		...formModel, userAgreed, awaitingResponse, authenticationState
	};
};

export default connect(mapStatesToProps)(Register);
