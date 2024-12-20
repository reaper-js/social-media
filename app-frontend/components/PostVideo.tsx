import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { FontAwesome } from "@expo/vector-icons";

const PostVideo = ({ videoUrl }: { videoUrl: string }) => {
  const [isMuted, setIsMuted] = useState(true);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.volume = isMuted ? 0 : 1;
    player.play();
  });

  const toggleMute = () => {
    if (player) {
      setIsMuted(!isMuted);
      player.volume = isMuted ? 1 : 0;
    }
  };

  return (
    <View>
      <VideoView
        style={{
          width: "100%",
          height: 256,
          borderRadius: 12,
        }}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      <TouchableOpacity
        onPress={toggleMute}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 8,
          borderRadius: 20,
        }}
      >
        <FontAwesome
          name={isMuted ? "volume-off" : "volume-up"}
          size={18}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PostVideo;
