import Text from "@/src/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

interface TabProps {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

const Tab = ({ focused, iconName, title, onPress }: TabProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  const getIconName = () => {
    if (focused) {
      return iconName;
    }
    return `${iconName}-outline` as keyof typeof Ionicons.glyphMap;
  };

  useEffect(() => {
    scaleAnim.stopAnimation();
    backgroundColorAnim.stopAnimation();

    if (focused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const handlePressIn = () => {
    scaleAnim.stopAnimation();
    backgroundColorAnim.stopAnimation();

    Animated.spring(scaleAnim, {
      toValue: 0.85,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(backgroundColorAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    scaleAnim.stopAnimation();
    backgroundColorAnim.stopAnimation();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const iconColor = focused ? "#405d72" : "#9faeb8";
  const textColor = focused ? "text-primary-400" : "text-gray-500";

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      "transparent",
      "rgba(64, 93, 114, 0.15)",
      "rgba(64, 93, 114, 0.2)",
    ],
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mt-2 flex-1 flex flex-col items-center w-full"
    >
      <Animated.View
        style={{
          backgroundColor: backgroundColor,
          borderRadius: 4,
          paddingVertical: 8,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              paddingBottom: 0,
            }}
          >
            <Ionicons name={getIconName()} size={22} color={iconColor} />
          </View>
          <View style={{ marginTop: 0 }}>
            <Text
              size="2xs"
              weight={focused ? "semibold" : "medium"}
              className={`w-full text-center ${textColor}`}
              rtlAlign="center"
            >
              {title}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default Tab;
