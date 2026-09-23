import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  size?: number;
};

// Simple placeholder mascot built from shapes so Phase 1 has no dependency
// on final illustration assets. Swap for the real panda artwork later.
export function PandaMascot({ size = 140 }: Props) {
  const earSize = size * 0.32;
  const eyeSize = size * 0.22;
  const pupilSize = size * 0.08;
  const noseSize = size * 0.12;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View style={[styles.ear, styles.earLeft, { width: earSize, height: earSize, borderRadius: earSize / 2 }]} />
      <View style={[styles.ear, styles.earRight, { width: earSize, height: earSize, borderRadius: earSize / 2 }]} />
      <View style={[styles.face, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.eyesRow}>
          <View style={[styles.eyePatch, { width: eyeSize, height: eyeSize * 1.2, borderRadius: eyeSize / 2 }]}>
            <View style={[styles.pupil, { width: pupilSize, height: pupilSize, borderRadius: pupilSize / 2 }]} />
          </View>
          <View style={[styles.eyePatch, { width: eyeSize, height: eyeSize * 1.2, borderRadius: eyeSize / 2 }]}>
            <View style={[styles.pupil, { width: pupilSize, height: pupilSize, borderRadius: pupilSize / 2 }]} />
          </View>
        </View>
        <View style={[styles.nose, { width: noseSize, height: noseSize * 0.7, borderRadius: noseSize / 2 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ear: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.textPrimary,
  },
  earLeft: {
    left: '2%',
  },
  earRight: {
    right: '2%',
  },
  face: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  eyePatch: {
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    backgroundColor: colors.white,
  },
  nose: {
    backgroundColor: colors.textPrimary,
  },
});
