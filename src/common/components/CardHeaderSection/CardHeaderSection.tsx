import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconSwitcher from '../icons/IconSwitcher.tsx';

export default function CardHeaderSection({ title }) {
  return (
    <CardHeader
      avatar={<Avatar aria-label="recipe"><IconSwitcher language ={title} /></Avatar>}
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title={title}
      subheader={null}
      sx={{ borderBottom: 1 }}
    />
  );
}


