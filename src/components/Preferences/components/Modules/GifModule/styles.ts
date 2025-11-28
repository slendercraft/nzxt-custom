import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  gap: 10px;

  .preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 150px;
    margin-right: 10px;

    user-select: none;
    pointer-events: none;
    filter: contrast(0.2);

    svg {
      cursor: pointer;

      :hover {
        opacity: 0.6;
      }
    }

    .blendSelect {
      display: flex;
      flex-direction: column;
      width: 130px;

      span {
        font-size: 1.2rem;
      }
    }
  }

  &.--is-gifSet {
    .preview {
      user-select: initial;
      pointer-events: initial;
      filter: none;
    }
  }

  .gif-tab {
    .gif-tabSelectorContainer {
      display: flex;
    }

    .gif-tabSelector {
      padding: 5px 15px;
      border: 1px solid var(--background-contrast-lighter-color);
      border-bottom: none;
      cursor: pointer;

      &.--is-active {
        background-color: var(--primary-color);
      }

      &:first-of-type {
        border-top-left-radius: 5px;
        border-right: none;
      }

      &:last-of-type {
        border-top-right-radius: 5px;
      }
    }

    .gif-tabContent {
      padding: 10px;
      border: 1px solid var(--background-contrast-lighter-color);
    }
  }

  .search {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-x: auto;
    max-width: calc(100vw - 240px);

    .searchInput {
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;

      input {
        padding: 10px 35px;
      }

      svg {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translate(0, -50%);
      }
    }

    .grid {
      margin-top: 50px;
      height: 400px;
    }
  }

  .url-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    
    input[type="text"] {
      width: 100%;
      padding: 10px;
      background: var(--background-contrast-light-color);
      border: 1px solid var(--background-contrast-lighter-color);
      border-radius: 4px;
      color: var(--text-primary-color);
      font-size: 1.4rem;
    }

    button {
      padding: 8px 20px;
    }

    .url-info {
      font-size: 1.2rem;
      color: var(--text-secondary-color);
      text-align: center;
    }
  }

  .custom-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border: 2px dashed var(--background-contrast-lighter-color);
    border-radius: 8px;
    
    input[type="file"] {
      display: block;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--background-contrast-lighter-color);
      border-radius: 4px;
      background: var(--background-contrast-light-color);
      color: var(--text-primary-color);
      cursor: pointer;
    }

    .upload-info {
      font-size: 1.4rem;
      color: var(--text-secondary-color);
      text-align: center;
    }

    .storage-info {
      font-size: 1.2rem;
      color: var(--text-accent-color);
      text-align: center;
      padding: 10px;
      background: var(--background-contrast-light-color);
      border-radius: 4px;
      width: 100%;
    }
  }
`
