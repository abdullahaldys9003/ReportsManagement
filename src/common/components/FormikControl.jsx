import React from 'react';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
const FormikControl = ({ control, ...rest }) => {
  switch (control) {
    case 'input':
      return <InputField {...rest} />;
    case 'textarea':
      return <TextareaField {...rest} />;
    case 'select':
      return <SelectField {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;