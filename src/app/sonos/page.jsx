"use client"

import {useEffect, useState} from 'react';
import { useSearchParams } from 'next/navigation'
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';

import {getAllZones, handleInput, useSonosInfo} from '../lib/SonosClient';
import {TrackInfo} from './components/TrackInfo';
import {TrackControls} from './components/TrackControls';
import {TrackPosition} from './components/TrackPosition';
import {VolumeControls} from './components/VolumeControls';
import {ZoneSelector} from './components/ZoneSelector';

const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 640,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

export default function SonosPlayer() {
  const searchParams = useSearchParams()
  const defaultZone = searchParams.get('defaultzone')
  const [zone, setZone] = useState(defaultZone || 'office')
  const {isLoading, sonosInfo: songInfo, getInfo} = useSonosInfo();

  const handleSetZone = async (zone) => {
    const data = await getAllZones()
    const zoneList = data.flatMap(z => z.members.map(m => m.roomName))
    zoneList.includes(zone) && setZone(zone)
  }

  useEffect(() => {
    getInfo(zone)

    const interval = setInterval(() => {
      getInfo(zone)
    }, 10000);

    return () => clearInterval(interval);
  }, [zone])

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        <TrackInfo songInfo={songInfo} />
        <TrackControls isLoading={isLoading} songInfo={songInfo} handleInput={handleInput} currentZone={zone} />
        {/* <TrackPosition /> */}
        <VolumeControls currentZone={zone} />
        <ZoneSelector initZone={zone} handleSetZone={handleSetZone} />
      </Widget>
      <WallPaper />
    </Box>
  );
}