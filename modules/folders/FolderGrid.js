import { styled } from '@stitches/react';
import { useContext, useEffect } from 'react';
import { Appstate } from '../../context/Appstate';
import FolderButton from './FolderButton';

/* * */
/* FOLDER GRID */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'grid',
  placeItems: 'stretch',
  placeContent: 'stretch',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '$xs',
  marginBottom: '$md',
});

/* */
/* LOGIC */

export default function FolderGrid() {
  //

  const appstate = useContext(Appstate);

  useEffect(() => {
    // If no folder is selected then select the first one by default
    if (!appstate.hasCurrentFolder) appstate.setCurrentFolder(appstate.device?.layout?.folders[0]);
  });

  return <Container>{appstate.hasDevice && appstate.device.layout.folders.map((folder) => <FolderButton key={folder._id} folder={folder} />)}</Container>;
}
