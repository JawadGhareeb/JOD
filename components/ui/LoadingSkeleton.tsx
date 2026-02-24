import { useColorScheme } from "nativewind";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Card from "./Card";

interface SkeletonProps {
  isLoading?: boolean;
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  children?: React.ReactNode;
}

interface SkeletonLayout {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
  marginRight?: number;
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  alignItems?: "flex-start" | "center" | "flex-end";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  children?: SkeletonLayout[];
  flex?: number;
}

interface GridSkeletonProps {
  itemCount?: number;
  itemComponent: React.ComponentType;
  numColumns?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  columnWrapperStyle?: StyleProp<ViewStyle>;
}

interface CardSkeletonProps {
  type?: "teacher" | "subject" | "custom";
  width?: number | string;
  height?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  elevated?: boolean;
  bordered?: boolean;
  children?: React.ReactNode;
  customLayout?: SkeletonLayout;
}

const useSkeletonPalette = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return useMemo(
    () => ({
      boneColor: isDark ? "#2E2F3A" : "#E4E8F0",
      highlightColor: isDark ? "#3B3C47" : "#F8FAFD",
    }),
    [isDark]
  );
};

const SkeletonItem: React.FC<SkeletonProps> = ({
  isLoading = true,
  width = 0,
  height = 12,
  borderRadius = 8,
  style,
  children,
}) => {
  const palette = useSkeletonPalette();
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isLoading) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isLoading, animatedValue]);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: palette.boneColor,
          opacity: animatedValue,
        },
        style,
      ]}
    />
  );
};

const SkeletonLayoutComponent: React.FC<{
  layout: SkeletonLayout;
  isLoading?: boolean;
  children?: React.ReactNode;
}> = ({ layout, isLoading = true, children }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const containerStyle = {
    flexDirection: layout.flexDirection || "column",
    alignItems: layout.alignItems || "flex-start",
    justifyContent: layout.justifyContent || "flex-start",
    marginBottom: layout.marginBottom,
    marginRight: layout.marginRight,
  };

  return (
    <View style={containerStyle}>
      {layout.children?.map((child, index) => (
        <SkeletonLayoutComponent
          key={index}
          layout={child}
          isLoading={isLoading}
        />
      ))}
      <SkeletonItem
        isLoading={isLoading}
        width={layout.width}
        height={layout.height}
        borderRadius={layout.borderRadius}
      />
    </View>
  );
};

export const Skeleton: React.FC<{
  isLoading?: boolean;
  layout?: SkeletonLayout;
  containerStyle?: any;
  children?: React.ReactNode;
}> = ({ isLoading = true, layout, containerStyle, children }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (layout) {
    return (
      <View style={[styles.skeletonContainer, containerStyle]}>
        <SkeletonLayoutComponent layout={layout} isLoading={isLoading} />
      </View>
    );
  }

  return (
    <View style={[styles.skeletonContainer, containerStyle]}>
      <SkeletonItem isLoading={isLoading} />
    </View>
  );
};

const defaultCardLayout: SkeletonLayout = {
  width: "100%",
  children: [
    {
      width: "100%",
      height: 20,
      borderRadius: 8,
      marginBottom: 12,
    },
    {
      width: "80%",
      height: 16,
      borderRadius: 6,
      marginBottom: 8,
    },
    {
      width: "60%",
      height: 16,
      borderRadius: 6,
      marginBottom: 12,
    },
    {
      width: "100%",
      height: 40,
      borderRadius: 8,
      marginBottom: 8,
    },
    {
      width: "70%",
      height: 14,
      borderRadius: 6,
    },
  ],
};

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  type = "custom",
  width = "100%",
  height = 200,
  borderRadius = 12,
  padding = 16,
  margin = 8,
  elevated = false,
  bordered = true,
  children,
  customLayout,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const getLayout = (): SkeletonLayout => {
    switch (type) {
      case "custom":
        return customLayout || defaultCardLayout;
      default:
        return defaultCardLayout;
    }
  };

  const cardStyle = {
    width: width as any,
    height,
    borderRadius,
    padding,
    margin,
    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
    borderWidth: bordered ? 1 : 0,
    borderColor: isDark ? "#374151" : "#E5E7EB",
    shadowColor: elevated ? (isDark ? "#000000" : "#000000") : "transparent",
    shadowOffset: elevated ? { width: 0, height: 2 } : { width: 0, height: 0 },
    shadowOpacity: elevated ? 0.1 : 0,
    shadowRadius: elevated ? 4 : 0,
    elevation: elevated ? 2 : 0,
  };

  return (
    <View style={[cardStyle]}>
      <Skeleton layout={getLayout()} />
      {children}
    </View>
  );
};

const quizCardLayout: SkeletonLayout = {
  flexDirection: "column",
  width: "0",
  marginBottom: 16,
  children: [
    {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "0",
      marginBottom: 8,
      children: [
        {
          flexDirection: "row",
          alignItems: "center",
          children: [
            {
              width: 24,
              height: 24,
              borderRadius: 999,
              marginRight: 8,
            },
            {
              width: 100,
              height: 14,
              borderRadius: 999,
              marginRight: 8,
            },
          ],
        },
      ],
    },
    {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "0",
      marginBottom: 8,
      children: [
        {
          flexDirection: "row",
          alignItems: "center",
          children: [
            {
              width: 125,
              height: 10,
              borderRadius: 999,
            },
          ],
        },
      ],
    },
    {
      width: 125,
      height: 10,
      borderRadius: 999,
      marginBottom: 8,
    },
    {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "0",
      children: [
        {
          flexDirection: "row",
          alignItems: "center",
          children: [
            {
              width: 14,
              height: 14,
              borderRadius: 999,
              marginRight: 8,
            },
            {
              width: 50,
              height: 10,
              borderRadius: 999,
            },
          ],
        },
      ],
    },
  ],
};

export const QuizCardSkeleton: React.FC = () => {
  return (
    <Card
      className="flex-1 mx-1 mb-4"
      padding="md"
      radius="xl"
      elevated={Platform.OS === "android"}
    >
      <Skeleton layout={quizCardLayout} />
    </Card>
  );
};

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  itemCount = 6,
  itemComponent: ItemComponent,
  numColumns = 2,
  contentContainerStyle,
  columnWrapperStyle,
}) => {
  const skeletonData = useMemo(
    () =>
      Array.from({ length: itemCount }, (_, index) => ({
        id: `skeleton-${index}`,
      })),
    [itemCount]
  );

  return (
    <FlatList
      data={skeletonData}
      renderItem={() => <ItemComponent />}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={StyleSheet.flatten([
        styles.gridContent,
        contentContainerStyle,
      ])}
      columnWrapperStyle={
        numColumns > 1
          ? StyleSheet.flatten([styles.columnWrapper, columnWrapperStyle])
          : columnWrapperStyle
      }
    />
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    paddingTop: 16,
  },
  skeletonContainer: {
    width: "100%",
  },
  subjectCard: {
    minHeight: 140,
  },
});
