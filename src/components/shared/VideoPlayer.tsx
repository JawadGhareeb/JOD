import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Pause, RotateCcw, RotateCw } from "lucide-react-native";
import { appIcons } from "@/src/components/layout/iconMap";
import Text from "@/src/components/ui/Text";
import { PRIMARY_COLOR_LIGHT } from "@/src/theme";

const PlayIcon = appIcons.play;

type VideoPlayerProps = {
  url: string;
  active?: boolean;
  loop?: boolean;
  muted?: boolean;
  nativeControls?: boolean;
  showProgressControls?: boolean;
  progressControlsPlacement?: "bottom" | "center";
  onRequestPlay?: () => void;
  style?: StyleProp<ViewStyle>;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function VideoPlayer({
  url,
  active = true,
  loop = true,
  muted = false,
  nativeControls = false,
  showProgressControls = false,
  progressControlsPlacement = "bottom",
  onRequestPlay,
  style,
}: VideoPlayerProps) {
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === "active");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressWidth, setProgressWidth] = useState(1);
  const [centerControlsVisible, setCenterControlsVisible] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const player = useVideoPlayer(url, (instance) => {
    instance.loop = loop;
    instance.muted = muted;
    instance.timeUpdateEventInterval = 0.25;
  });

  useEffect(() => {
    player.loop = loop;
    player.muted = muted;
    player.timeUpdateEventInterval = 0.25;
  }, [loop, muted, player]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setAppActive(state === "active");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      setManuallyPaused(false);
      setCenterControlsVisible(false);
      player.pause();
      return;
    }

    if (appActive && !manuallyPaused) player.play();
    else player.pause();
  }, [active, appActive, manuallyPaused, player]);

  useEffect(() => {
    if (!showProgressControls) return;
    const interval = setInterval(() => {
      setCurrentTime(Number.isFinite(player.currentTime) ? player.currentTime : 0);
      setDuration(Number.isFinite(player.duration) ? player.duration : 0);
    }, 250);
    return () => clearInterval(interval);
  }, [player, showProgressControls]);

  const progress = useMemo(
    () => (duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0),
    [currentTime, duration],
  );

  const scheduleCenterControlsHide = () => {
    if (progressControlsPlacement !== "center" || manuallyPaused) return;
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setCenterControlsVisible(false), 1600);
  };

  const revealCenterControls = () => {
    if (progressControlsPlacement !== "center") return;
    setCenterControlsVisible(true);
    scheduleCenterControlsHide();
  };

  const togglePlayback = () => {
    if (!active) {
      onRequestPlay?.();
      return;
    }
    const nextPaused = !manuallyPaused;
    setManuallyPaused(nextPaused);
    if (progressControlsPlacement === "center") {
      setCenterControlsVisible(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (!nextPaused) {
        controlsTimerRef.current = setTimeout(() => setCenterControlsVisible(false), 1600);
      }
    }
  };

  const seekFromPress = (event: GestureResponderEvent) => {
    if (!active || duration <= 0 || progressWidth <= 0) return;
    const ratio = Math.min(1, Math.max(0, event.nativeEvent.locationX / progressWidth));
    player.currentTime = ratio * duration;
    setCurrentTime(player.currentTime);
    revealCenterControls();
  };

  const seekBy = (seconds: number) => {
    if (!active) return;
    const nextTime = Math.min(duration || Number.POSITIVE_INFINITY, Math.max(0, player.currentTime + seconds));
    player.currentTime = Number.isFinite(nextTime) ? nextTime : 0;
    setCurrentTime(player.currentTime);
    revealCenterControls();
  };

  const restart = () => {
    player.currentTime = 0;
    setCurrentTime(0);
    setManuallyPaused(false);
    if (active && appActive) player.play();
  };

  const centerControlsShown = progressControlsPlacement === "center" && (centerControlsVisible || manuallyPaused);

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <Pressable onPress={nativeControls ? undefined : togglePlayback} className="flex-1">
        <View className="absolute inset-0 items-center justify-center bg-dark-500">
          <ActivityIndicator color={PRIMARY_COLOR_LIGHT} />
        </View>
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          nativeControls={nativeControls}
          contentFit="contain"
          allowsFullscreen
        />
        {!nativeControls && (!active || manuallyPaused) && progressControlsPlacement !== "center" ? (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-black/65">
              <PlayIcon size={26} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        ) : null}
      </Pressable>

      {centerControlsShown ? (
        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center bg-black/15">
          <View className="flex-row items-center gap-7">
            <Pressable
              onPress={() => seekBy(-10)}
              className="h-14 w-14 items-center justify-center rounded-full bg-black/60"
              accessibilityRole="button"
              accessibilityLabel="تأخير 10 ثواني"
            >
              <View className="items-center">
                <RotateCcw size={24} color="#FFFFFF" />
                <Text size="2xs" weight="bold" className="absolute top-1.5 text-white">10</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={togglePlayback}
              className="h-16 w-16 items-center justify-center rounded-full bg-black/65"
              accessibilityRole="button"
              accessibilityLabel={manuallyPaused ? "تشغيل" : "إيقاف مؤقت"}
            >
              {manuallyPaused ? (
                <PlayIcon size={30} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Pause size={30} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </Pressable>
            <Pressable
              onPress={() => seekBy(10)}
              className="h-14 w-14 items-center justify-center rounded-full bg-black/60"
              accessibilityRole="button"
              accessibilityLabel="تقديم 10 ثواني"
            >
              <View className="items-center">
                <RotateCw size={24} color="#FFFFFF" />
                <Text size="2xs" weight="bold" className="absolute top-1.5 text-white">10</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showProgressControls && progressControlsPlacement === "center" ? (
        <View className="absolute bottom-0 left-0 right-0 px-2 pb-1">
          <Pressable
            onLayout={(event) => setProgressWidth(Math.max(1, event.nativeEvent.layout.width))}
            onPress={seekFromPress}
            className="h-4 justify-end"
            accessibilityRole="adjustable"
            accessibilityLabel="تقديم أو تأخير الفيديو"
          >
            <View className="h-1 overflow-hidden rounded-full bg-white/30">
              <View className="h-full rounded-full bg-primary-400" style={{ width: `${progress * 100}%` }} />
            </View>
          </Pressable>
        </View>
      ) : null}

      {showProgressControls && progressControlsPlacement === "bottom" ? (
        <View className="absolute bottom-0 left-0 right-0 bg-black/55 px-3 pb-2 pt-3">
          <Pressable
            onLayout={(event) => setProgressWidth(Math.max(1, event.nativeEvent.layout.width))}
            onPress={seekFromPress}
            className="h-5 justify-center"
            accessibilityRole="adjustable"
            accessibilityLabel="تقديم أو تأخير الفيديو"
          >
            <View className="h-1 overflow-hidden rounded-full bg-white/30">
              <View className="h-full rounded-full bg-primary-400" style={{ width: `${progress * 100}%` }} />
            </View>
          </Pressable>
          <View className="flex-row-reverse items-center justify-between">
            <View className="flex-row-reverse items-center gap-3">
              <Pressable onPress={togglePlayback} className="p-1" accessibilityLabel={manuallyPaused ? "تشغيل" : "إيقاف مؤقت"}>
                {manuallyPaused ? <PlayIcon size={18} color="#FFFFFF" fill="#FFFFFF" /> : <Pause size={18} color="#FFFFFF" />}
              </Pressable>
              <Pressable onPress={() => seekBy(-10)} className="flex-row items-center p-1" accessibilityLabel="تأخير 10 ثواني">
                <RotateCcw size={17} color="#FFFFFF" />
                <Text size="2xs" className="text-light-50">10</Text>
              </Pressable>
              <Pressable onPress={() => seekBy(10)} className="flex-row items-center p-1" accessibilityLabel="تقديم 10 ثواني">
                <RotateCw size={17} color="#FFFFFF" />
                <Text size="2xs" className="text-light-50">10</Text>
              </Pressable>
              <Pressable onPress={restart} className="p-1" accessibilityLabel="إعادة الفيديو من البداية">
                <RotateCcw size={17} color={PRIMARY_COLOR_LIGHT} />
              </Pressable>
            </View>
            <Text size="2xs" className="text-light-50">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
