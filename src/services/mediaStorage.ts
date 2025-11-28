export interface StoredMedia {
  type: 'dataUrl' | 'objectUrl' | 'fileSystem';
  url: string;
  name: string;
  size: number;
}

const MAX_DATA_URL_SIZE = 5 * 1024 * 1024; // 5MB limit for Data URLs
const STORAGE_KEY = 'nzxt-custom-media';

export class MediaStorageService {
  private static async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static async storeInLocalStorage(media: StoredMedia): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(media));
    } catch (error) {
      console.error('Error storing media in localStorage:', error);
      throw error;
    }
  }

  private static async storeInFileSystem(file: File): Promise<string> {
    try {
      // Request file system access
      // @ts-ignore - File System API
      const handle = await window.showSaveFilePicker({
        suggestedName: file.name,
        types: [{
          description: 'Media Files',
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'video/*': ['.mp4', '.webm']
          }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      
      return handle.name;
    } catch (error) {
      console.error('Error storing in file system:', error);
      throw error;
    }
  }

  static async store(file: File): Promise<StoredMedia> {
    let media: StoredMedia;

    // For small files, use Data URL
    if (file.size <= MAX_DATA_URL_SIZE) {
      const dataUrl = await this.fileToDataUrl(file);
      media = {
        type: 'dataUrl',
        url: dataUrl,
        name: file.name,
        size: file.size
      };
    }
    // For larger files, try File System API first, then fall back to Object URL
    else {
      try {
        const fsName = await this.storeInFileSystem(file);
        media = {
          type: 'fileSystem',
          url: fsName,
          name: file.name,
          size: file.size
        };
      } catch (error) {
        // Fall back to Object URL if File System API fails
        const objectUrl = URL.createObjectURL(file);
        media = {
          type: 'objectUrl',
          url: objectUrl,
          name: file.name,
          size: file.size
        };
      }
    }

    // Store metadata in localStorage
    await this.storeInLocalStorage(media);
    return media;
  }

  static async load(): Promise<StoredMedia | null> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const media: StoredMedia = JSON.parse(stored);
    
    if (media.type === 'fileSystem') {
      try {
        // @ts-ignore - File System API
        const [fileHandle] = await window.showOpenFilePicker({
          multiple: false,
        });
        const file = await fileHandle.getFile();
        media.url = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error loading from file system:', error);
        return null;
      }
    }

    return media;
  }

  static cleanup(media: StoredMedia | null): void {
    if (!media) return;
    
    if (media.type === 'objectUrl') {
      URL.revokeObjectURL(media.url);
    }
  }
}