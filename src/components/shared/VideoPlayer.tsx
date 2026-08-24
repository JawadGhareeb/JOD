import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { appIcons } from "@/src/components/layout/iconMap";

const PlayIcon = appIcons.play;

type VideoPlayerProps = {
  url: string;
  active?: boolean;
  loop?: boolean;
  muted?: boolean;
  nativeControls?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function VideoPlayer({
  url,
  active = true,
  loop = true,
  muted = false,
  nativeControls = false,
  style,
}: VideoPlayerProps) {
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === "active");
  const player = useVideoPlayer(url, (instance) => {
    instance.loop = loop;
    instance.muted = muted;
  });

  useEffect(() => {
    player.loop = loop;
    player.muted = muted;
  }, [loop, muted, player]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setAppActive(state === "active");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (active && appActive && !manuallyPaused) {
      player.play();
    } else {
      player.pause();
    }
  }, [active, appActive, manuallyPaused, player]);

  const togglePlayback = () => {
    if (!active) return;
    setManuallyPaused((current) => !current);
  };

  return (
    <Pressable onPress={nativeControls ? undefined : togglePlayback} style={[{ overflow: "hidden" }, style]}>
      <View className="absolute inset-0 items-center justify-center bg-black">
        <ActivityIndicator color="#FFFFFF" />
      </View>
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        nativeControls={nativeControls}
        contentFit="contain"
        allowsFullscreen
      />
      {!nativeControls && manuallyPaused ? (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <PlayIcon size={26} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}
