import React from 'react';
import css from '../../styles/general/rangeInput.less';

function RangeInput({
  max, min, onBlur, onChange, step,
  value, dataColor, className, style,
  name, label, minLabel, maxLabel, indicatorLabel,
  shouldShowValue
}) {
  const valuePercentage = `${((value - min) / (max - min)) * 100}%`;
  const hasValue = value > min;
  return (
    <div className={css.inputBox} style={style}>
      { label ? <label className={css.inputLabel} htmlFor={name}>{label}</label> : null }
      <div className={css.inputBody}>
        { shouldShowValue ?
          <span className={css.inputValue}>{indicatorLabel || value}</span> : null
        }
        <span className={css.inputMarker__min}>{ minLabel || min }</span>
        <div className={css.input}>
          <input
            className={className}
            style={{ zIndex: 5 }}
            name={name}
            max={max}
            min={min}
            onBlur={onBlur}
            onChange={onChange}
            step={step}
            type="range"
            value={value}
            data-hasValue={hasValue}
          />
          <span
            style={{
              backgroundColor: hasValue ? dataColor : '',
              left: valuePercentage
            }}
            className={css.hander}
          />
          <div
            className={css.inputTrack__highlight}
            style={{
              width: valuePercentage,
              backgroundColor: dataColor
            }}
          />
          <div
            className={css.inputTrack}
          />
          <span
            style={{ left: valuePercentage }}
            className={css.inputValueIndicator}
          >
            {indicatorLabel || value}
          </span>
        </div>
        <span className={css.inputMarker__max}>{ maxLabel || max}</span>      
      </div>
    </div>
  );
}

export { RangeInput };
