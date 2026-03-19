import {
  createContext,
  useContext,
  useReducer,
  useRef,
  type FC,
  type ReactNode,
  type Dispatch,
  type MutableRefObject,
} from 'react';
import type OpenSeadragon from 'openseadragon';
import type { Annotation } from '../SvsOverlay/types';
import type { SvsToolName } from './tools';

export interface SvsToolbarState {
  activeTool: SvsToolName;
  annotations: Annotation[];
  magnifierEnabled: boolean;
  zoomLevel: number;
  mpp: number | null;
}

export type SvsToolbarAction =
  | { type: 'SET_TOOL'; tool: SvsToolName }
  | { type: 'ADD_ANNOTATION'; annotation: Annotation }
  | { type: 'DELETE_ANNOTATION'; id: string }
  | { type: 'CLEAR_ANNOTATIONS' }
  | { type: 'LOAD_ANNOTATIONS'; annotations: Annotation[] }
  | { type: 'TOGGLE_MAGNIFIER' }
  | { type: 'SET_ZOOM'; level: number }
  | { type: 'SET_MPP'; mpp: number };

const initialState: SvsToolbarState = {
  activeTool: 'pan',
  annotations: [],
  magnifierEnabled: false,
  zoomLevel: 100,
  mpp: null,
};

function reducer(state: SvsToolbarState, action: SvsToolbarAction): SvsToolbarState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, activeTool: action.tool };
    case 'ADD_ANNOTATION':
      return { ...state, annotations: [...state.annotations, action.annotation] };
    case 'DELETE_ANNOTATION':
      return { ...state, annotations: state.annotations.filter((a) => a.id !== action.id) };
    case 'CLEAR_ANNOTATIONS':
      return { ...state, annotations: [] };
    case 'LOAD_ANNOTATIONS':
      return { ...state, annotations: action.annotations };
    case 'TOGGLE_MAGNIFIER':
      return { ...state, magnifierEnabled: !state.magnifierEnabled };
    case 'SET_ZOOM':
      return { ...state, zoomLevel: action.level };
    case 'SET_MPP':
      return { ...state, mpp: action.mpp };
    default:
      return state;
  }
}

interface SvsToolbarContextValue {
  state: SvsToolbarState;
  dispatch: Dispatch<SvsToolbarAction>;
  viewerRef: MutableRefObject<OpenSeadragon.Viewer | null>;
  imageId: number | null;
}

const SvsToolbarCtx = createContext<SvsToolbarContextValue | null>(null);

export const SvsToolbarProvider: FC<{ children: ReactNode; imageId?: number | null }> = ({
  children,
  imageId = null,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);

  return (
    <SvsToolbarCtx.Provider value={{ state, dispatch, viewerRef, imageId }}>
      {children}
    </SvsToolbarCtx.Provider>
  );
};

export function useSvsToolbar(): SvsToolbarContextValue {
  const ctx = useContext(SvsToolbarCtx);
  if (!ctx) throw new Error('useSvsToolbar must be used inside SvsToolbarProvider');
  return ctx;
}
