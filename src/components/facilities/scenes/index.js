import React from 'react';
import ClassroomScene from './ClassroomScene';
import PlayScene from './PlayScene';
import ArtScene from './ArtScene';
import LibraryScene from './LibraryScene';
import KitchenScene from './KitchenScene';
import TransportScene from './TransportScene';
import SafetyScene from './SafetyScene';
import CareScene from './CareScene';
import GenericScene from './GenericScene';

export const SCENE_COMPONENTS = {
  classroom: ClassroomScene,
  play: PlayScene,
  art: ArtScene,
  library: LibraryScene,
  kitchen: KitchenScene,
  transport: TransportScene,
  safety: SafetyScene,
  care: CareScene,
};

/**
 * Renders the scene illustration corresponding to a facility's scene key,
 * falling back gracefully to GenericScene for any unknown key.
 * Uses React.createElement so index.js remains valid plain JS.
 */
export function FacilityScene({ scene, ...props }) {
  const Component = SCENE_COMPONENTS[scene] || GenericScene;
  return React.createElement(Component, props);
}

export default FacilityScene;
