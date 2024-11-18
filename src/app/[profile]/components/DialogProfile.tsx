import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import requestApi from "@/utils/api";
import { HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface UploadProfile {
  full_name?: string;
  username?: string;
  bio?: string;
}

export default function DialogProfile() {
  const myInfo = useUserInfo((state: UserInfoState) => state.userInfo);
  const setMyInfo = useUserInfo((state: UserInfoState) => state.setUserInfo);
  const { register, handleSubmit } = useForm<UploadProfile>();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (data: UploadProfile) => {
    try {
      const response = await requestApi("users/me", "PUT", {
        full_name: data.full_name,
        username: data.username,
        bio: data.bio,
      });
      setMyInfo({ ...myInfo, ...response.data.data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DialogRoot placement={"center"} motionPreset="slide-in-bottom">
      <DialogTrigger asChild>
        <Button
          h={"40px"}
          bgColor={"#fe2c55"}
          _hover={{ opacity: 0.8 }}
          mt={"10px"}
          p={"0 16px"}
        >
          <Text color={"#ffffffe6"} fontWeight={"bold"}>
            Sửa hồ sơ
          </Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa hồ sơ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateProfile)}>
          <DialogBody>
            <HStack justifyContent={"space-between"}>
              <Text minW={"100px"}>Avatar</Text>
              <HStack flex={1} justifyContent={"center"}>
                <label htmlFor="avatar">
                  <Avatar
                    src={
                      loading
                        ? "https://i.gifer.com/ZKZg.gif"
                        : myInfo?.avatar_url
                    }
                    maxW={"100px"}
                    maxH={"100px"}
                    w={"100px"}
                    h={"100px"}
                    size={"xl"}
                    cursor="pointer"
                    _hover={{
                      opacity: "0.8",
                    }}
                  />
                </label>
                <Input
                  display="none"
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) => {
                    const handleUploadAvartar = async () => {
                      try {
                        setLoading(true);
                        if (e.target.files && e.target.files.length > 0) {
                          const formData = new FormData();
                          formData.append("avatar", e.target.files[0]);
                          const response = await requestApi(
                            "users/me/avatar",
                            "POST",
                            formData
                          );
                          e.target.value = "";
                          if (myInfo) {
                            setMyInfo({
                              ...myInfo,
                              avatar_url: response.data.data.avatar_url,
                            });
                          }
                        }
                        setLoading(false);
                      } catch (error) {
                        console.log(error);
                      }
                    };
                    handleUploadAvartar();
                  }}
                />
              </HStack>
            </HStack>
            <HStack mt={"10px"}>
              <Text minW={"100px"}>Username</Text>
              <Input
                type="text"
                defaultValue={myInfo?.username}
                {...register("username")}
              />
            </HStack>
            <HStack mt={"10px"}>
              <Text minW={"100px"}>Full name</Text>
              <Input
                type="text"
                defaultValue={myInfo?.full_name}
                {...register("full_name")}
              />
            </HStack>
            <HStack mt={"10px"}>
              <Text minW={"100px"}>Bio</Text>
              <Input
                type="text"
                defaultValue={myInfo?.bio}
                {...register("bio")}
              />
            </HStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <Button type="submit">Save</Button>
            </DialogActionTrigger>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
