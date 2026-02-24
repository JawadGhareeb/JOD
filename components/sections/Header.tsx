import { icons } from "@/constants";
import { NavigationHelper } from "@/lib/helpers";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import Text from "../ui/Text";

interface HeaderProps {
  pageTitle: string;
  showBackButton?: boolean;
  showSideMenu?: boolean;
  onSideMenuPress?: () => void;
}

const Header = ({
  pageTitle,
  showBackButton = false,
  showSideMenu = false,
  onSideMenuPress,
}: HeaderProps) => {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleNotificationPress = () => {
    NavigationHelper.goToNotifications(router);
  };

  const handleBackPress = () => {
    NavigationHelper.goBack(router);
  };
  const handleProfilePress = () => {
    NavigationHelper.goToProfile(router);
  };

  const handleThemeToggle = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <View>
      <View
        className={`flex-row items-center justify-between px-4 pb-2 pt-12 border-b ${isDark ? "border-dark-350" : "border-gray-200"}`}
      >
        <View className="flex-row items-center gap-2">
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress}>
              <icons.chevronRight size={20} color="#405d72" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleProfilePress}>
            <icons.profile size={20} color="#405d72" />
          </TouchableOpacity>
          <Text size="base" weight="bold" color={isDark ? "light" : "dark"}>
            {pageTitle}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleThemeToggle}
            className="w-10 h-10 items-center justify-center"
          >
            {isDark ? (
              <icons.sun size={20} color={"#F59E0B"} />
            ) : (
              <icons.moon size={20} color={"#405d72"} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNotificationPress}
            className="w-10 h-10 items-center justify-center"
          >
            <icons.bell size={20} color="#405d72" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
