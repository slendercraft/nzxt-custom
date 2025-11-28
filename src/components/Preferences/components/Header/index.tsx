import React from 'react'

import { usePreferencesStore } from 'store/preferences'

import {
  AiFillGithub as GitIcon,
  AiOutlineInstagram as InstagramIcon,
  AiOutlineYoutube as YoutubeIcon,

} from 'react-icons/ai'

import { Dialog } from 'components/Preferences/components/Dialog'
import { IDialogActions } from 'components/Preferences/components/Dialog/types'

import { Container } from './styles'

export const Header = () => {
  const preferencesStore = usePreferencesStore()

  const saveDialog = React.useRef<IDialogActions>(null)
  const discardDialog = React.useRef<IDialogActions>(null)

  const notModified =
    JSON.stringify(preferencesStore.current) ===
    JSON.stringify(preferencesStore.themes[preferencesStore.lastUsedTheme])

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value
    preferencesStore.changeTheme(theme)
  }

  const handleSaveChanges = () => {
    preferencesStore.saveTheme()
  }

  const handleDiscardChanges = () => {
    preferencesStore.discardChanges()
  }

  return (
    <Container>
      <div className="info">
        <div className="title">
          Dual Info <span>v1.6.3 [Custom]</span>
        </div>

        <div className="author">
          <span>
            Original by <i><a title="github" target="_blank" href="https://github.com/brunoandradebr">Bruno Andrade</a></i>
          </span>
        </div>
      </div>


      <div className="panel">
        <select
          defaultValue={preferencesStore.lastUsedTheme}
          onChange={handleThemeChange}
        >
          <option value={'purple'}>Purple theme</option>
          <option value={'gif'}>Gif theme</option>
          <option value={'pixel'}>Pixel theme</option>
          <option value={'user'}>User theme</option>
        </select>

        <button onClick={() => saveDialog.current?.open()}>Save</button>
        <button onClick={() => discardDialog.current?.open()} disabled={notModified}>
          Discard
        </button>
      </div>

      <Dialog
        ref={saveDialog}
        onConfirm={handleSaveChanges}
        title="Do you really want to do this?"
      >
        Your user theme will be overwritten.
      </Dialog>

      <Dialog
        ref={discardDialog}
        onConfirm={handleDiscardChanges}
        title="Do you really want to do this?"
      />
    </Container>
  )
}
