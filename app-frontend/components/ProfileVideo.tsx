import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { FontAwesome } from "@expo/vector-icons";

const ProfileVideo = ({ videoUrl }: { videoUrl: string }) => {
  const [isMuted, setIsMuted] = useState(true);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.volume = isMuted ? 0 : 1;
    player.play();
  });

  // const toggleMute = () => {
  //   if (player) {
  //     setIsMuted(!isMuted);
  //     player.volume = isMuted ? 1 : 0;
  //   }
  // };

  return (
    <View>
      <VideoView
        style={{
          width: "100%",
          height: "100%",
        }}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
};

export default ProfileVideo;
