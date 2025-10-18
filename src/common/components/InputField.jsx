import { useField } from 'formik';
import { TextField } from '@mui/material';

const InputField = (props) => {
  const { name, ...rest } = props;
  const [field,meta,helpers] = useField(name);
  console.log(field);
  console.log(meta);
  console.log(helpers);
  return (
    <TextField
      {...field} 
      {...rest}
      id={name}
      fullWidth
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ''}
    />
  );
};

export default InputField;