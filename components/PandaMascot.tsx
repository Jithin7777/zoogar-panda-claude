import { Image } from 'react-native';

type Props = {
  size?: number;
};

// Exported from assets/images/panda.svg (the editable master). A bitmap is used
// because Android dark mode recolored the previous View-based panda.
const pandaImage = require('../assets/images/panda.png');

export function PandaMascot({ size = 140 }: Props) {
  return (
    <Image
      source={pandaImage}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
