import { styled } from '@stitches/react';
import { useContext } from 'react';
import { GlobalContext } from '../../services/context';
import ViewCustomer from './viewCustomer/ViewCustomer';
import { GoClippy } from 'react-icons/go';

/* * */
/* CUSTOMER LIST ROW */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const RowContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'stretch',
  alignItems: 'stretch',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  borderRadius: '$md',
  color: '$gray11',
  backgroundColor: '$gray3',
  '&:active': {
    color: '$gray12',
    backgroundColor: '$gray8',
    borderColor: '$gray9',
    boxShadow: '$sm',
  },
  variants: {
    selected: {
      true: {
        color: '$gray0',
        backgroundColor: '$primary5',
        borderColor: '$primary6',
        '&:active': {
          color: '$primary9',
          backgroundColor: '$primary6',
          borderColor: '$primary9',
          boxShadow: '$sm',
        },
      },
    },
  },
});

const DetailsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$xs',
  padding: '$md',
  width: '100%',
  borderRightWidth: '$md',
  borderRightStyle: 'solid',
  borderRightColor: '$gray7',
  '&:active': {
    borderRightColor: '$gray9',
  },
  variants: {
    selected: {
      true: {
        borderRightColor: '$primary6',
        '&:active': {
          borderRightColor: '$primary9',
        },
      },
    },
  },
});

const Text = styled('p', {
  fontWeight: '$bold',
  color: '$gray12',
  variants: {
    selected: {
      true: {
        color: '$gray0',
      },
    },
  },
});

const InfoContainer = styled(Text, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$md',
  overflow: 'hidden',
  width: '100%',
});

const CustomerName = styled(Text, {
  fontSize: '20px',
});

const CustomerInfo = styled(Text, {
  fontSize: '12px',
  fontWeight: '$medium',
  color: '$gray9',
  textTransform: 'uppercase',
  variants: {
    selected: {
      true: {
        opacity: 0.8,
      },
    },
  },
});

const MoreDetailsIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md $lg',
  fontSize: '30px',
  color: '$gray9',
  aspectRatio: '9/8',
  variants: {
    selected: {
      true: {
        color: '$gray0',
        '&:active': {
          color: '$primary9',
        },
      },
    },
  },
});

/* */
/* LOGIC */

export default function CustomersListRow({ customer, onSelect, selectedCustomer }) {
  //

  const { overlay } = useContext(GlobalContext);

  let isThisCustomerSelected = false;
  if (selectedCustomer && selectedCustomer._id == customer._id) isThisCustomerSelected = true;

  function handleView() {
    overlay.setComponent(<ViewCustomer customer={customer} />);
  }

  return (
    <RowContainer selected={isThisCustomerSelected}>
      <DetailsContainer selected={isThisCustomerSelected} onClick={() => onSelect(customer)}>
        <CustomerName selected={isThisCustomerSelected}>
          {customer.name.first} {customer.name.last}
        </CustomerName>
        <InfoContainer>
          <CustomerInfo selected={isThisCustomerSelected}>{customer.email ? customer.email : '-'}</CustomerInfo>
          <CustomerInfo selected={isThisCustomerSelected}>NIF: {customer.tax.number ? customer.tax.number : '-'}</CustomerInfo>
        </InfoContainer>
      </DetailsContainer>
      <MoreDetailsIcon selected={isThisCustomerSelected} onClick={handleView}>
        <GoClippy />
      </MoreDetailsIcon>
    </RowContainer>
  );
}
