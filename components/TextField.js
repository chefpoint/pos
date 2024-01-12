/* * */

import { styled } from '../stitches.config';

/* * */

const Input = styled('input', {
  width: '100%',
  padding: '$md',
  fontSize: '25px',
  fontWeight: '$regular',
  backgroundColor: '$gray3',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  borderSpacing: '0',
  outline: 'none',
  textAlign: 'left',
  margin: '0',
  borderRadius: '$md',
  '&:focus': {
    '&::placeholder': {
      color: '$gray7',
    },
  },
  '&::placeholder': {
    color: '$gray9',
  },
});

/* * */

export default function TextField(props) {
  return <Input {...props} />;
}
