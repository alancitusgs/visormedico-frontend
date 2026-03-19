/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'cornerstone-core' {
  export interface CornerstoneImage {
    imageId: string;
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number | number[];
    windowWidth: number | number[];
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    data: {
      string: (tag: string) => string | undefined;
      uint16: (tag: string) => number | undefined;
    };
    getPixelData: () => Uint16Array | Int16Array;
    render: (enabledElement: any, invalidated: boolean) => void;
  }

  export interface Viewport {
    scale?: number;
    translation?: { x: number; y: number };
    voi?: { windowWidth: number; windowCenter: number };
    invert?: boolean;
    rotation?: number;
    hflip?: boolean;
    vflip?: boolean;
  }

  export function enable(element: HTMLElement): void;
  export function disable(element: HTMLElement): void;
  export function loadImage(imageId: string): Promise<CornerstoneImage>;
  export function displayImage(element: HTMLElement, image: CornerstoneImage, viewport?: Viewport): void;
  export function getViewport(element: HTMLElement): Viewport;
  export function setViewport(element: HTMLElement, viewport: Viewport): void;
  export function reset(element: HTMLElement): void;
  export function resize(element: HTMLElement, fitToWindow?: boolean): void;
  export function getImage(element: HTMLElement): CornerstoneImage | undefined;
  export function updateImage(element: HTMLElement): void;
  export function getDefaultViewportForImage(element: HTMLElement, image: CornerstoneImage): Viewport;

  export const events: {
    IMAGE_RENDERED: string;
    NEW_IMAGE: string;
    IMAGE_LOADED: string;
    IMAGE_LOAD_FAILED: string;
  };

  const cornerstone: {
    enable: typeof enable;
    disable: typeof disable;
    loadImage: typeof loadImage;
    displayImage: typeof displayImage;
    getViewport: typeof getViewport;
    setViewport: typeof setViewport;
    reset: typeof reset;
    resize: typeof resize;
    getImage: typeof getImage;
    updateImage: typeof updateImage;
    getDefaultViewportForImage: typeof getDefaultViewportForImage;
    events: typeof events;
  };

  export default cornerstone;
}

declare module 'cornerstone-wado-image-loader' {
  const cornerstoneWADOImageLoader: {
    external: {
      cornerstone: any;
      dicomParser: any;
    };
    webWorkerManager: {
      initialize: (config: any) => void;
    };
    wadouri: {
      dataSetCacheManager: any;
    };
  };
  export default cornerstoneWADOImageLoader;
}

declare module 'dicom-parser' {
  const dicomParser: any;
  export default dicomParser;
}

declare module 'cornerstone-tools' {
  const cornerstoneTools: {
    external: {
      cornerstone: any;
      Hammer: any;
    };
    init: (config?: any) => void;
    addTool: (tool: any) => void;
    addToolForElement: (element: HTMLElement, tool: any) => void;
    setToolActive: (name: string, options?: any) => void;
    setToolActiveForElement: (element: HTMLElement, name: string, options?: any) => void;
    WwwcTool: any;
    ZoomTool: any;
    PanTool: any;
    RotateTool: any;
    LengthTool: any;
    StackScrollMouseWheelTool: any;
  };
  export default cornerstoneTools;
}
