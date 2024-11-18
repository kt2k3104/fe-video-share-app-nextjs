"use client";
import requestApi from "@/utils/api";
import { Box, Grid, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import { useRouter } from "next/navigation";
import VideoBox from "./components/VideoBox";

export interface IParams {
  profile: string;
}

export interface UserProfile {
  id: number;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  videos: Video[];
  followers: Follower[];
  followings: Following[];
}

export interface Video {
  id: number;
  title?: string;
  description?: string;
  url: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  createdAt: string;
}

interface Follower {
  id: number;
  full_name: string;
  username: string;
  avatar_url: string;
}

interface Following {
  id: number;
  full_name: string;
  username: string;
  avatar_url: string;
}

export default function ProfilePage({ params }: { params: IParams }) {
  const [user, setUser] = useState<UserProfile>();
  const router = useRouter();

  // if (user?.avatar_url === null) {
  //   setUser({
  //     ...user,
  //     avatar_url:
  //       "https://scontent.fhan19-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=cZVTekJX4O4Q7kNvgH9tIf2&_nc_zt=24&_nc_ht=scontent.fhan19-1.fna&_nc_gid=AIp-6WWAaxb96Sd5y6M4t60&oh=00_AYAVECT3qcWksSFif9-B8BgbPyvJBS0xzQM_exfZbb0B8w&oe=6760937A",
  //   });
  // }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await requestApi(
          "users/username/" + params.profile,
          "GET",
          null
        );
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <Box
      flex={"1"}
      h={"calc(100vh - 110px)"}
      textAlign={"center"}
      p={"20px 0 0 20px"}
      bgColor={"#111"}
    >
      {user?.id ? (
        <Box
          w={"100%"}
          h={"100%"}
          overflow={"auto"}
          css={{
            "&:hover": {
              overflowY: "auto", // Hiện thanh cuộn khi hover
            },
            "&::-webkit-scrollbar": {
              width: "5px", // Kích thước scrollbar
            },
            scrollbarGutter: "stable",
            "&::-webkit-scrollbar-thumb": {
              background: "#222",
              borderRadius: "24px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          }}
        >
          <Header userParams={user} />
          <Tabs.Root defaultValue="members" mt={"10px"}>
            <Tabs.List>
              <Tabs.Trigger value="members">Video</Tabs.Trigger>
              <Tabs.Trigger value="projects">Đã thích</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="members">
              <Grid
                w={"calc(100% - 40px)"}
                h={"100%"}
                gap={"24px 16px"}
                gridTemplateColumns={{
                  lg: "repeat(3, 1fr)",
                  "2xl": "repeat(4, 1fr)",
                }}
              >
                {user?.videos.map((video, index) => (
                  <VideoBox video={video} key={index} />
                ))}
              </Grid>
            </Tabs.Content>
            <Tabs.Content value="projects">Video đã thích</Tabs.Content>
          </Tabs.Root>
        </Box>
      ) : (
        <Text>404 not found</Text>
      )}
    </Box>
  );
}
