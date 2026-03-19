import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import cornerstoneTools from 'cornerstone-tools';

let initialized = false;

export function initCornerstone(): void {
  if (initialized) return;

  // Wire up external dependencies
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;

  // Configure web workers for image decoding
  const config = {
    maxWebWorkers: Math.min(navigator.hardwareConcurrency || 1, 4),
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
      },
    },
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

  // Initialize cornerstone tools
  cornerstoneTools.init({
    showSVGCursors: true,
  });

  // Register tools
  cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
  cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
  cornerstoneTools.addTool(cornerstoneTools.PanTool);
  cornerstoneTools.addTool(cornerstoneTools.RotateTool);
  cornerstoneTools.addTool(cornerstoneTools.LengthTool);

  initialized = true;
}

export { cornerstone, cornerstoneTools };
