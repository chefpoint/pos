import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { CurrentOrder } from '../context/CurrentOrder';
import { styled } from '@stitches/react';
import pjson from '../package.json';

const AppVersion = styled('div', {
  position: 'fixed',
  bottom: '0',
  width: '100%',
  textAlign: 'center',
  padding: '$lg',
  color: '$gray10',
  fontSize: '12px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
});

export default function Refresh() {
  const router = useRouter();
  const { data: version } = useSWR('/api/version');
  const currentOrder = useContext(CurrentOrder);

  if (!currentOrder.hasItems && !currentOrder.hasCustomer) {
    if (version && version.latest != pjson.version) {
      router.reload();
    }
  }

  return (
    <AppVersion>
      {pjson.name} - {pjson.version}
    </AppVersion>
  );
}
