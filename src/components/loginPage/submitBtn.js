import React from 'react';
// import { useButton } from '@mui/base/ButtonUnstyled';
import { ButtonUnstyled } from '@mui/base';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const CustomButtonRoot = styled('button')`
background-color: #212121;
padding: 14px 24px;
color: #fff;
font-weight: 700;
font-size: 14px;
cursor: pointer;
border: none;
margin-top: 40px;
width: 100%;


&.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

const CustomButton = React.forwardRef(function CustomButton(props, ref) {
  const { children } = props;
  const { active, disabled, focusVisible, getRootProps } = ButtonUnstyled({
    ...props,
    ref,
    component: CustomButtonRoot,
  });

  const classes = {
    active,
    disabled,
    focusVisible,
  };

  return (
    <CustomButtonRoot {...getRootProps()} className={clsx(classes)}>
      {children}
    </CustomButtonRoot>
  );
});

CustomButton.propTypes = {
  children: PropTypes.node,
};

const submitBtn = (props) => {
  return (
    <div>
      <CustomButton
        variant="contained"
        disabled={!props.value}
        onClick={props.onClick}
      >
        {props.text}
      </CustomButton>
    </div>
  )
}

export default submitBtn
