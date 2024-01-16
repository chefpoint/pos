import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../../context/Appstate';

/* * */
/* FOLDER BUTTON */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const FolderBtn = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: '$md',
  borderStyle: 'solid',
  height: '40px',
  textTransform: 'uppercase',
  fontWeight: '$bold',
  fontSize: '13px',
  padding: '$xs $md',
  cursor: 'pointer',
  variants: {
    selected: {
      true: {
        color: '$gray0',
        backgroundColor: '$primary5',
        borderColor: '$primary7',
        boxShadow: '$md',
      },
      false: {
        color: '$gray12',
        backgroundColor: '$gray0',
        borderColor: '$gray5',
        '&:hover': {
          backgroundColor: '$gray2',
          borderColor: '$gray6',
        },
        '&:active': {
          backgroundColor: '$gray6',
          borderColor: '$gray8',
        },
      },
    },
  },
});

/* */
/* LOGIC */

export default function FolderButton({ folder }) {
  //

  const appstate = useContext(Appstate);

  function handleClick() {
    appstate.setCurrentFolder(folder);
  }

  return (
    <FolderBtn selected={folder._id == appstate.currentFolder?._id} onClick={handleClick}>
      {folder.title}
    </FolderBtn>
  );
}
