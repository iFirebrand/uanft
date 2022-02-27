import React from 'react';

import { Box } from '@mui/material';
import ReactPlayer from 'react-player';


const ResponsivePlayer = () => {
    return (
        <Box sx={{
            position: 'relative',
            paddingTop: 'padding-top: 56.25%',
        }}>
            <ReactPlayer
                url={[{src: '/video.mp4', type: 'video/mp4'}]}
                controls={true} 
                width='100%'
                height='100%'
                playsinline
                />
        </Box>

    );
}

export default ResponsivePlayer;