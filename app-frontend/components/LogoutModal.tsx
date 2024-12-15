import { BlurView } from "expo-blur";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";

export const LogoutModal = ({
  visible,
  onClose,
  onLogout,
  onLogoutAll,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onLogoutAll: () => void;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50">
        <TouchableOpacity className="flex-1" onPress={onClose}>
          <View className="flex-1 justify-end ">
            <View className="bg-[#2F6731] rounded-t-3xl p-4 space-y-4 pb-9 ">
              <TouchableOpacity
                className="p-4 border-b border-red-400"
                onPress={onLogout}
              >
                <Text className="text-white font-pmedium text-lg text-center">
                  Logout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4" onPress={onLogoutAll}>
                <Text className="text-white font-pmedium text-lg text-center">
                  Logout from all devices
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
