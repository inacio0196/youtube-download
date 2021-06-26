import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Box, Button, Spinner } from 'grommet';

import { TextInput, Title, Space } from '../../components';

const Home: React.FC = () => {
  // States
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Functions
  const validateURL = () => {
    const valid = true
    const notValid = false
    const youtubeURLPattern = /https?:\/\/www.youtube.com\//g

    if (youtubeURLPattern.test(videoUrl)) {
      return valid
    }

    return notValid
  }

  const downlaodVideo = () => {
    if (!validateURL()) {
      alert('URL incorreta')
      return
    }

    setLoading(true)

    ipcRenderer.on('download-video-ipcrender', (event, args) => {
      console.log('download-video', {video_render: args})
      setLoading(false)
    })

    ipcRenderer.send('download-video-ipcmain', { videoUrl })
  };

  const downloadMp3 = () => {
    if (!validateURL()) {
      alert('URL incorreta')
      return
    }

    setLoading(true)

    ipcRenderer.on('download-mp3-ipcrender', (event, args) => {
      console.log('download-mp3', {mp3_render: args})
      setLoading(false)
    })

    ipcRenderer.send('download-mp3-ipcmain', { videoUrl })
  }

  return (
    <Box pad="medium">
      <Box flex align="center">
        <Title
          title={['You', 'Tube ', 'DOWNLOAD']}
          colors={['', '#ff0000']}
        />
      </Box>
      <Space vertical={80} />
      <TextInput
        placeholder="Cole a URL do vídeo YouTube aqui!"
        value={videoUrl}
        onSearchClick={downlaodVideo}
        errorMessage="Digite uma URL válida."
        onChange={(e) => setVideoUrl(e.target.value)}
        searchIcon
      />
      <Space vertical={20} />
      <Box
        flex
        align='center'
      >
        {
          loading && <Spinner color='#ff0000' size='large' />
        }
      </Box>
      <Space vertical={40} />
      <Box
        direction='row'
        justify='between'
      >
        <Button
          size="large"
          primary
          color="#ff0000"
          label="Video Download"
          onClick={downlaodVideo}
        />
        <Button
          size="large"
          primary
          color="#ff0000"
          label="MP3 Download"
          onClick={downloadMp3}
        />
      </Box>
    </Box>
  );
};

export default Home;
