import { useRef, useState } from "react";
import { Animated } from "react-native";
import { Heart } from "lucide-react-native";

const BURST_HOLD_MS = 450;
const BURST_FADE_MS = 220;
const BURST_SIZE = 64;

export type HeartBurstPosition = { x: number; y: number };

/**
 * Instagram/Facebook-style heart that pops up and fades out at the tapped
 * spot, triggered by a double tap. Render <HeartBurst scale={scale}
 * opacity={opacity} position={position} /> inside a `relative` container
 * and call `trigger(x, y)` — x/y in that container's own coordinate space
 * (e.g. from event.nativeEvent measured against the container) — on the
 * double-tap gesture.
 */
export function useHeartBurst() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<HeartBurstPosition>({ x: 0, y: 0 });

  const trigger = (x: number, y: number) => {
    setPosition({ x, y });
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    scale.setValue(0);
    opacity.setValue(1);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();
    hideTimerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: BURST_FADE_MS,
        useNativeDriver: true,
      }).start();
    }, BURST_HOLD_MS);
  };

  return { trigger, scale, opacity, position };
}

type HeartBurstProps = {
  scale: Animated.Value;
  opacity: Animated.Value;
  position: HeartBurstPosition;
};

export function HeartBurst({ scale, opacity, position }: HeartBurstProps) {
  return (
    <Animated.View
      pointerEvents="none"
      className="absolute items-center justify-center"
      style={{
        left: position.x - BURST_SIZE / 2,
        top: position.y - BURST_SIZE / 2,
        width: BURST_SIZE,
        height: BURST_SIZE,
        opacity,
        transform: [{ scale }],
      }}
    >
      <Heart
        size={BURST_SIZE}
        color="#E11D48"
        fill="#E11D48"
        strokeWidth={1.5}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        }}
      />
    </Animated.View>
  );
}
