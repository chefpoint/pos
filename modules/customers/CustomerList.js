/* * */

import useSWR from 'swr';
import { styled } from '@stitches/react';

import { useContext, useState, useEffect } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';

import { GoPlus, GoSearch } from 'react-icons/go';

import Pannel from '@/components/Pannel';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import ButtonBar from '@/components/ButtonBar';
import AssociateOnlyNIF from '@/components/AssociateOnlyNIF/AssociateOnlyNIF';
import CustomerCreateOrEdit from '@/components/CustomerCreateOrEdit/CustomerCreateOrEdit';

import CustomersListRow from './CustomerListRow';
import Icon from '@/components/Icon';

/* * */

const Toolbar = styled('div', {
  display: 'grid',
  gridTemplateColumns: '10fr 1fr',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  gap: '$md',
  width: '100%',
});

const SearchBar = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  width: '100%',
});

const SearchBarIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  borderRightWidth: '0',
  fontSize: '30px',
  color: '$gray9',
  aspectRatio: '9/8',
  borderRadius: '$md',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: '$gray3',
});

const SearchBarTextField = styled(TextField, {
  margin: '0',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
});

const ListContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sm',
  height: '450px',
  overflow: 'scroll',
  position: 'relative',
  margin: '$md -$md',
  padding: '$md',
  borderTopWidth: '$md',
  borderTopStyle: 'solid',
  borderTopColor: '$gray7',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray7',
});

const NoResultsMessage = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textTransform: 'uppercase',
  width: '100%',
  height: '100%',
  fontSize: '30px',
  fontWeight: '$regular',
  color: '$gray7',
});

/* */

export default function CustomerList() {
  //

  const { data: customers } = useSWR('/api/customers/');

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [selectedCustomer, setSelectedCustomer] = useState();

  useEffect(() => {
    if (searchQuery) {
      const searchResult = customers.filter((customer) => {
        const firstName = customer.first_name?.toLowerCase().includes(searchQuery);
        const lastName = customer.last_name?.toLowerCase().includes(searchQuery);
        const contact_email = customer.contact_email?.toLowerCase().includes(searchQuery);
        const tax_id = customer.tax_number?.toString().toLowerCase().includes(searchQuery);
        const reference = customer.reference?.toLowerCase().includes(searchQuery);
        // Return true if any field contains query value
        return firstName || lastName || contact_email || tax_id || reference;
      });
      setFilteredCustomers(searchResult);
      setSelectedCustomer();
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchQuery]);

  const handleSearchQueryChange = ({ target }) => {
    const query = target.value.toLowerCase();
    setSearchQuery(query);
  };

  function handleSelect(clickedCustomer) {
    if (selectedCustomer && clickedCustomer._id == selectedCustomer._id) {
      setSelectedCustomer();
    } else {
      setSelectedCustomer(clickedCustomer);
    }
  }

  function handleCreateCustomer() {
    appstate.setOverlay(<CustomerCreateOrEdit />);
  }

  function handleAssociateCustomer() {
    currentOrder.setCustomer(selectedCustomer);
    appstate.setOverlay();
  }

  function handleAssociateOnlyNIF() {
    appstate.setOverlay(<AssociateOnlyNIF />);
  }

  /* */
  /* RENDER */

  return (
    <Pannel title={'Procurar Cliente'}>
      <Toolbar>
        <SearchBar>
          <SearchBarIcon>
            <GoSearch />
          </SearchBarIcon>
          <SearchBarTextField name={'searchQuery'} type={'text'} placeholder={'Procurar por Nome, NIF, etc…'} value={searchQuery} onChange={handleSearchQueryChange} />
        </SearchBar>
        <Icon color={'secondary'} onClick={handleCreateCustomer}>
          <GoPlus />
        </Icon>
      </Toolbar>
      {/*  */}
      <ListContainer>{filteredCustomers?.length ? filteredCustomers.map((customer) => <CustomersListRow key={customer._id} customer={customer} onSelect={handleSelect} selectedCustomer={selectedCustomer} />) : <NoResultsMessage>Nenhum Resultado Encontrado</NoResultsMessage>}</ListContainer>
      <ButtonBar>
        <Button disabled={!selectedCustomer} onClick={handleAssociateCustomer}>
          Associar Cliente
        </Button>
        <Button color={'secondary'} onClick={handleAssociateOnlyNIF}>
          Apenas NIF
        </Button>
      </ButtonBar>
    </Pannel>
  );
}
