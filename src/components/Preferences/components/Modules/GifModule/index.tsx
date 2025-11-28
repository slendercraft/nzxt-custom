import React, { ChangeEvent } from 'react'

import { usePreferencesStore } from 'store/preferences'
import { TBlendMode } from 'store/preferences/types'

import { useDebounce, useWindowSize } from 'hooks'
import { MediaStorageService, StoredMedia } from 'services/mediaStorage'

import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

import GifPicker, { Theme } from 'gif-picker-react'

import { AiOutlineSearch as SearchIcon, AiFillDelete as RemoveIcon } from 'react-icons/ai'

import { Range } from 'components/Preferences/components/Range'
import { Dialog } from 'components/Preferences/components/Dialog'
import { IDialogActions } from 'components/Preferences/components/Dialog/types'

import giphyLogo from './assets/giphy.gif'

import { Container } from './styles'

const tenorApiKey = import.meta.env.VITE_TENOR_API
const giphyApiKey = import.meta.env.VITE_GIPHY_API
const gf = new GiphyFetch(giphyApiKey)

export const GifModule = () => {
  const blendSelectRef = React.useRef<HTMLSelectElement>(null)

  const preferencesStore = usePreferencesStore()

  const [windowWidth] = useWindowSize()
  const [currentMedia, setCurrentMedia] = React.useState<StoredMedia | null>(null)
  const [gifEngine, setGifEngine] = React.useState<'giphy' | 'tenor' | 'custom' | 'url'>('giphy')
  const [urlInput, setUrlInput] = React.useState('')
  const debouncedUrl = useDebounce(urlInput, 500) as string

  const isValidMediaUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp|mp4|webm)$/i) !== null
  }

  React.useEffect(() => {
    // Load saved media on component mount
    MediaStorageService.load().then(media => {
      if (media) {
        setCurrentMedia(media);
        preferencesStore.updateGif({ url: media.url });
        setGifEngine('custom');
      }
    });

    // Cleanup on unmount
    return () => {
      if (currentMedia) {
        MediaStorageService.cleanup(currentMedia);
      }
    };
  }, []);

  const removeGifDialog = React.useRef<IDialogActions>(null)

  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedTerm = useDebounce(searchTerm, 1000)

  const fetchGifs = (offset: number) =>
    gf.search(debouncedTerm as string, { offset, limit: 10, type: 'gifs' })

  const handleRemoveGif = () => {
    if (currentMedia) {
      MediaStorageService.cleanup(currentMedia);
      setCurrentMedia(null);
    }
    preferencesStore.removeGif();
  }

  const handleChangeBlend = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesStore.updateGif({ blend: event.target.value as TBlendMode })

    setTimeout(() => {
      blendSelectRef?.current?.focus()
    }, 100)
  }

  const BlendSelect = () => (
    <div className="blendSelect">
      <span>Blend mode</span>

      <select
        ref={blendSelectRef}
        defaultValue={preferencesStore.current.gif.blend}
        onChange={handleChangeBlend}
      >
        <option value="normal">normal</option>
        <option value="multiply">multiply</option>
        <option value="screen">screen</option>
        <option value="overlay">overlay</option>
        <option value="darken">darken</option>
        <option value="lighten">lighten</option>
        <option value="color-dodge">color-dodge</option>
        <option value="color-burn">color-burn</option>
        <option value="hard-light">hard-light</option>
        <option value="soft-light">soft-light</option>
        <option value="difference">difference</option>
        <option value="exclusion">exclusion</option>
        <option value="hue">hue</option>
        <option value="saturation">saturation</option>
        <option value="color">color</option>
        <option value="luminosity">luminosity</option>
      </select>
    </div>
  )

  return (
    <Container className={`${preferencesStore.current.gif.url ? '--is-gifSet' : ''}`}>
      <div className="preview">
        {preferencesStore.current.gif.url && (
          <RemoveIcon
            title={'remove gif'}
            onClick={() => removeGifDialog.current?.open()}
          />
        )}

        <video
          src={preferencesStore.current.gif.url}
          autoPlay
          muted
          loop
          poster={preferencesStore.current.gif.url}
          controls={false}
          width={120}
        />

        <BlendSelect />

        <Range
          label="Size"
          value={preferencesStore.current.gif.size}
          onChange={value =>
            preferencesStore.updateGif({
              size: value,
            })
          }
        />

        <Range
          label="Blur"
          value={preferencesStore.current.gif.blur}
          onChange={value =>
            preferencesStore.updateGif({
              blur: value,
            })
          }
        />

        <Range
          label="Brightness"
          value={preferencesStore.current.gif.brightness}
          onChange={value =>
            preferencesStore.updateGif({
              brightness: value,
            })
          }
        />

        <Range
          label="Contrast"
          value={preferencesStore.current.gif.contrast}
          onChange={value =>
            preferencesStore.updateGif({
              contrast: value,
            })
          }
        />

        <Range
          label="Alpha"
          value={preferencesStore.current.gif.alpha}
          onChange={value =>
            preferencesStore.updateGif({
              alpha: value,
            })
          }
        />
      </div>

      <div className="gif-tab">
        <div className="gif-tabSelectorContainer">
          <div
            className={`gif-tabSelector ${gifEngine === 'giphy' ? '--is-active' : ''}`}
            onClick={() => setGifEngine('giphy')}
          >
            Giphy
          </div>

          <div
            className={`gif-tabSelector ${gifEngine === 'tenor' ? '--is-active' : ''}`}
            onClick={() => setGifEngine('tenor')}
          >
            Tenor
          </div>
          <div
              className={`gif-tabSelector ${gifEngine === 'custom' ? '--is-active' : ''}`}
              onClick={() => setGifEngine('custom')}
            >
              Local
          </div>
          <div
            className={`gif-tabSelector ${gifEngine === 'url' ? '--is-active' : ''}`}
            onClick={() => setGifEngine('url')}
          >
            URL
          </div>
        </div>

        <div className="gif-tabContent">
          {gifEngine === 'url' ? (
            <div className="url-input">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter image or video URL (e.g., https://example.com/video.mp4)"
              />
              <button
                onClick={() => {
                  if (debouncedUrl && isValidMediaUrl(debouncedUrl)) {
                    preferencesStore.updateGif({ url: debouncedUrl });
                  } else {
                    console.error('Invalid media URL. Please use a direct link to an image or video file.');
                  }
                }}
                disabled={!debouncedUrl || !isValidMediaUrl(debouncedUrl)}
              >
                Set Background
              </button>
              <p className="url-info">
                Enter a direct link to an image (.jpg, .png, .gif, .webp) or video file (.mp4, .webm)
              </p>
            </div>
          ) : gifEngine === 'custom' ? (
            <div className="custom-upload">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      // Cleanup previous media if exists
                      if (currentMedia) {
                        MediaStorageService.cleanup(currentMedia);
                      }

                      // Store new media
                      const media = await MediaStorageService.store(file);
                      setCurrentMedia(media);
                      preferencesStore.updateGif({ url: media.url });

                      // Show success message
                      const storageType = media.type === 'dataUrl' ? 'Data URL' :
                                        media.type === 'fileSystem' ? 'File System' : 'Object URL';
                      console.log(`File stored successfully using ${storageType}`);
                    } catch (error) {
                      console.error('Error storing media:', error);
                      // You might want to show this error to the user
                    }
                  }
                }}
              />
              <p className="upload-info">Select an image or video file from your computer</p>
              {currentMedia && (
                <p className="storage-info">
                  Current file: {currentMedia.name} ({(currentMedia.size / 1024 / 1024).toFixed(2)} MB)
                  <br />
                  Storage: {currentMedia.type === 'dataUrl' ? 'Data URL' :
                           currentMedia.type === 'fileSystem' ? 'File System' : 'Object URL'}
                </p>
              )}
            </div>
          ) : gifEngine === 'tenor' ? (
            <GifPicker
              tenorApiKey={tenorApiKey}
              theme={Theme.DARK}
              width={windowWidth - 250}
              onGifClick={gif => preferencesStore.updateGif({ url: gif.url })}
            />
          ) : (
            <>
              <div className="search">
                <div className="searchInput">
                  <input
                    type="text"
                    defaultValue={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="search gif"
                  />
                  <SearchIcon />
                  <img src={giphyLogo} height={36} />
                </div>

                <Grid
                  className="grid"
                  key={debouncedTerm as string}
                  width={windowWidth - 250}
                  columns={4}
                  noLink
                  fetchGifs={fetchGifs}
                  onGifClick={gif =>
                    preferencesStore.updateGif({ url: gif.images.original.mp4 })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog
        ref={removeGifDialog}
        title={'Do you really want to do this?'}
        onConfirm={handleRemoveGif}
      />
    </Container>
  )
}
