declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((width: number, height: number, config: any) => any);
    projectionConfig?: any;
    className?: string;
    style?: React.CSSProperties;
    onMouseMove?: (event: React.MouseEvent) => void;
    children?: React.ReactNode;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }, event: any) => void;
    onMove?: (position: { coordinates: [number, number]; zoom: number }, event: any) => void;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }, event: any) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  export interface GeographiesProps {
    geography?: string | Record<string, any> | string[];
    children: (args: { geographies: any[] }) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps {
    geography: any;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseUp?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    className?: string;
    tabIndex?: number;
  }
  export const Geography: React.FC<GeographyProps>;
}