import React, { Component } from 'react';
import css from '../../styles/User/profile.less';
import { MDIcon } from '../General';

class ProfileInput extends Component {
  constructor(props) {
    super(props);
    const docBody = document.body;
    const bodyRect = docBody.getBoundingClientRect();

    this.state = {
      inputOnFocus: false,
      inputIsPristine: true,
      inputXIndex: 0,
      inputYIndex: 0,
      scrollLeft: docBody.scrollLeft,
      scrollTop: docBody.scrollTop,
      docTop: bodyRect.top,
      docLeft: bodyRect.left
    };
  }
  onInputChange(event) {
    const { onChange } = this.props;
    this.setState({ inputIsPristine: false });
    if (onChange) onChange(event);
  }
  onInputFocus(event) {
    const { onFocus } = this.props;
    this.onInputClick();
    if (onFocus) onFocus(event);
  }
  onInputClick() {
    const { readOnly, disabled } = this.props;
    this.setDocRefs();
    if (!readOnly && !disabled) {
      this.setState({ inputOnFocus: true });
    }
  }
  onInputHover() {
    const { readOnly, disabled } = this.props;
    this.setDocRefs();
    if (!readOnly && !disabled) {
      this.setState({ inputOnFocus: true });
    }
  }
  onInputBlur(event) {  
    const { onBlur, mouseLeaveSensitive } = this.props;
    const { inputIsPristine } = this.state;
    if ((inputIsPristine === false || mouseLeaveSensitive) && onBlur) onBlur(event);
  }
  onInputMouseLeave() {
    const { mouseLeaveSensitive } = this.props;
    const input = this.refs.input;
    if (mouseLeaveSensitive) {
      this.setState({ inputOnFocus: false });
      input.blur();
    }
  }
  onDropdownClick() {
    this.setState({ inputOnFocus: false });
    const input = this.refs.input;    
    input.blur();
  }
  setDocRefs() {
    // const docBody = document.body;
    // const bodyRect = docBody.getBoundingClientRect();
    const input = this.refs.input;
    const inputRect = input.getBoundingClientRect();
    const inputXIndex = (inputRect.top) + inputRect.height;
    const inputYIndex = inputRect.left;
    
    this.setState({
      inputXIndex,
      inputYIndex,
      inputWidth: inputRect.width
    });
  }
  renderIndicateLength() {
    const {
      readOnly, value, max, type
    } = this.props;
    const valueLength = value ? value.length : 0;
    if (readOnly || !max) { return null; }

    return (
      <span className={css.profile_inputLength}>
        { type !== 'number' ? <span>{valueLength}</span> : null } / { max }
      </span>
    );
  }
  renderIndicateMsg() {
    const { dataMsg, readOnly, dataIcon } = this.props;
    const className = dataMsg ? css.profile_indicateMsg__show : css.profile_indicateMsg;
    if (readOnly) { return null; }
    return (
      <span className={className}>
        <MDIcon
          className={css.profile_inputMsgIcon}
          iconName={dataIcon}
        />
        <i>{ dataMsg }</i>
      </span>
    );
  }
  renderDropdown() {
    const { renderOptions } = this.props;
    const { inputOnFocus } = this.state;
    
    if (renderOptions && inputOnFocus) {
      return (
        <div
          className={css.profile_select}
          onClick={this.onDropdownClick.bind(this)}
        >
          { renderOptions() }
        </div>
      );
    }
  }
  renderDateIcon() {
    const inputType = this.props.type || 'text';
    if (inputType.indexOf('date') >= 0) {
      return <MDIcon iconName="calendar" className={css.profile_dateInputIcon} />;
    }
  }
  render() {
    const {
      label, name, dataColor, max, min, pattern,
      placeholder, readOnly, value, type, width,
      style, disabled
    } = this.props;
    const notEditable = disabled || readOnly;
    // const { inputXIndex, inputYIndex, inputWidth } = this.state;
    // const style = { width: inputWidth, top: inputYIndex, left: inputXIndex };
    return (
      <div
        style={{ width }}
        className={css.profile_inputBox}
        onMouseEnter={this.onInputHover.bind(this)}
        onMouseLeave={this.onInputMouseLeave.bind(this)}
      >
        <label
          htmlFor={name} className={css.profile_inputLabel}
          style={{ color: notEditable ? '' : dataColor }}          
        >
          <span>{label}</span>
          {
            notEditable ?
            <MDIcon iconName="pencil-lock" className={css.profile_readOnlyIcon} /> : null
          }
          { this.renderIndicateMsg() }
        </label>
        { this.renderDateIcon() }
        <input
          disabled={disabled}
          max={max} min={min} pattern={pattern}
          placeholder={placeholder} readOnly={readOnly || false}
          name={name}
          value={value}
          type={type || 'text'}
          className={css.profile_input}
          onBlur={event => this.onInputBlur(event)}
          onClick={this.onInputClick.bind(this)}
          onChange={event => this.onInputChange(event)}
          onFocus={event => this.onInputFocus(event)}
          ref="input"
          style={{ ...style, borderColor: notEditable ? '' : dataColor }}
        />
        { this.renderDropdown() }
        { this.renderIndicateLength() }
      </div>
    );
  }
}

export default ProfileInput;
